-- ============================================================================
-- NERLUDE SUBSCRIPTION PLANS & FEATURE LIMITS
-- ============================================================================
-- This migration creates the database structure for:
-- 1. Subscription plans with feature limits
-- 2. Workspace subscriptions linked to Stripe
-- 3. Usage tracking for enforcing limits
-- 4. Storage quota management
-- ============================================================================

-- ============================================================================
-- 1. SUBSCRIPTION PLANS TABLE
-- Defines all available plans and their feature limits
-- ============================================================================
CREATE TABLE IF NOT EXISTS subscription_plans (
    id TEXT PRIMARY KEY,  -- 'free', 'pro', 'team'
    name TEXT NOT NULL,
    description TEXT,
    
    -- Pricing
    price_monthly DECIMAL(10, 2) NOT NULL DEFAULT 0,
    price_yearly DECIMAL(10, 2) NOT NULL DEFAULT 0,
    stripe_price_id_monthly TEXT,  -- Stripe Price ID for monthly billing
    stripe_price_id_yearly TEXT,   -- Stripe Price ID for yearly billing
    stripe_product_id TEXT,        -- Stripe Product ID
    
    -- Core Limits
    max_projects INTEGER NOT NULL DEFAULT 1,           -- -1 = unlimited
    max_workspaces INTEGER NOT NULL DEFAULT 1,         -- -1 = unlimited
    max_team_members INTEGER NOT NULL DEFAULT 1,       -- -1 = unlimited
    max_services_per_project INTEGER NOT NULL DEFAULT 5, -- -1 = unlimited
    max_credentials INTEGER NOT NULL DEFAULT 10,       -- -1 = unlimited
    max_storage_bytes BIGINT NOT NULL DEFAULT 1073741824, -- 1 GB in bytes, -1 = unlimited
    
    -- Feature Flags
    has_environment_separation BOOLEAN NOT NULL DEFAULT FALSE,
    has_service_stacks BOOLEAN NOT NULL DEFAULT FALSE,
    has_cost_analytics BOOLEAN NOT NULL DEFAULT FALSE,
    has_ai_document_import BOOLEAN NOT NULL DEFAULT FALSE,
    has_advanced_alerts BOOLEAN NOT NULL DEFAULT FALSE,  -- email + slack
    has_rbac BOOLEAN NOT NULL DEFAULT FALSE,             -- role-based access control
    has_contractor_access BOOLEAN NOT NULL DEFAULT FALSE, -- time-limited access
    has_audit_logging BOOLEAN NOT NULL DEFAULT FALSE,
    has_api_access BOOLEAN NOT NULL DEFAULT FALSE,
    has_export BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Integration Limits
    max_integrations INTEGER NOT NULL DEFAULT 1,  -- -1 = unlimited
    
    -- Support Level
    support_level TEXT NOT NULL DEFAULT 'community', -- 'community', 'priority', 'dedicated'
    
    -- Display
    is_popular BOOLEAN NOT NULL DEFAULT FALSE,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 2. INSERT DEFAULT PLANS
-- ============================================================================
INSERT INTO subscription_plans (
    id, name, description,
    price_monthly, price_yearly,
    max_projects, max_workspaces, max_team_members, max_services_per_project,
    max_credentials, max_storage_bytes, max_integrations,
    has_environment_separation, has_service_stacks, has_cost_analytics,
    has_ai_document_import, has_advanced_alerts, has_rbac,
    has_contractor_access, has_audit_logging, has_api_access, has_export,
    support_level, is_popular, display_order
) VALUES
-- FREE PLAN
(
    'free', 'Free', 'Perfect for getting started with your first project.',
    0, 0,
    1,    -- max_projects
    1,    -- max_workspaces
    1,    -- max_team_members
    5,    -- max_services_per_project
    10,   -- max_credentials
    1073741824,  -- 1 GB in bytes
    1,    -- max_integrations (email only)
    FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE,
    'community', FALSE, 1
),
-- PRO PLAN
(
    'pro', 'Pro', 'For founders managing multiple products.',
    19.99, 215.89,  -- yearly = 19.99 * 12 * 0.9
    10,   -- max_projects
    3,    -- max_workspaces
    5,    -- max_team_members
    50,   -- max_services_per_project
    -1,   -- unlimited credentials
    10737418240,  -- 10 GB in bytes
    3,    -- max_integrations
    TRUE, TRUE, TRUE, TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE,
    'priority', TRUE, 2
),
-- TEAM PLAN
(
    'team', 'Team', 'For agencies and growing teams.',
    39.99, 431.89,  -- yearly = 39.99 * 12 * 0.9
    -1,   -- unlimited projects
    -1,   -- unlimited workspaces
    -1,   -- unlimited team members
    -1,   -- unlimited services
    -1,   -- unlimited credentials
    107374182400,  -- 100 GB in bytes
    -1,   -- unlimited integrations
    TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE,
    'dedicated', FALSE, 3
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    price_monthly = EXCLUDED.price_monthly,
    price_yearly = EXCLUDED.price_yearly,
    max_projects = EXCLUDED.max_projects,
    max_workspaces = EXCLUDED.max_workspaces,
    max_team_members = EXCLUDED.max_team_members,
    max_services_per_project = EXCLUDED.max_services_per_project,
    max_credentials = EXCLUDED.max_credentials,
    max_storage_bytes = EXCLUDED.max_storage_bytes,
    max_integrations = EXCLUDED.max_integrations,
    has_environment_separation = EXCLUDED.has_environment_separation,
    has_service_stacks = EXCLUDED.has_service_stacks,
    has_cost_analytics = EXCLUDED.has_cost_analytics,
    has_ai_document_import = EXCLUDED.has_ai_document_import,
    has_advanced_alerts = EXCLUDED.has_advanced_alerts,
    has_rbac = EXCLUDED.has_rbac,
    has_contractor_access = EXCLUDED.has_contractor_access,
    has_audit_logging = EXCLUDED.has_audit_logging,
    has_api_access = EXCLUDED.has_api_access,
    has_export = EXCLUDED.has_export,
    support_level = EXCLUDED.support_level,
    is_popular = EXCLUDED.is_popular,
    display_order = EXCLUDED.display_order,
    updated_at = NOW();

-- ============================================================================
-- 3. WORKSPACE SUBSCRIPTIONS TABLE
-- Links workspaces to their subscription plan and Stripe
-- ============================================================================
CREATE TABLE IF NOT EXISTS workspace_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    plan_id TEXT NOT NULL REFERENCES subscription_plans(id) DEFAULT 'free',
    
    -- Stripe Integration
    stripe_customer_id TEXT,           -- Stripe Customer ID
    stripe_subscription_id TEXT,       -- Stripe Subscription ID
    stripe_subscription_status TEXT,   -- 'active', 'past_due', 'canceled', 'trialing', etc.
    
    -- Billing Cycle
    billing_cycle TEXT NOT NULL DEFAULT 'monthly', -- 'monthly' or 'yearly'
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
    canceled_at TIMESTAMPTZ,
    
    -- Trial
    trial_start TIMESTAMPTZ,
    trial_end TIMESTAMPTZ,
    
    -- Override Limits (for custom deals or grandfathered users)
    override_max_projects INTEGER,
    override_max_workspaces INTEGER,
    override_max_team_members INTEGER,
    override_max_services_per_project INTEGER,
    override_max_credentials INTEGER,
    override_max_storage_bytes BIGINT,
    override_max_integrations INTEGER,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(workspace_id)
);

-- ============================================================================
-- 4. WORKSPACE USAGE TABLE
-- Tracks current usage for each workspace to enforce limits
-- ============================================================================
CREATE TABLE IF NOT EXISTS workspace_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    -- Current Usage Counts
    project_count INTEGER NOT NULL DEFAULT 0,
    team_member_count INTEGER NOT NULL DEFAULT 0,
    credential_count INTEGER NOT NULL DEFAULT 0,
    integration_count INTEGER NOT NULL DEFAULT 0,
    
    -- Storage Usage (in bytes)
    storage_used_bytes BIGINT NOT NULL DEFAULT 0,
    
    -- Last Calculated
    last_calculated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(workspace_id)
);

-- ============================================================================
-- 5. STORAGE QUOTAS TABLE
-- Detailed storage tracking per workspace/project
-- ============================================================================
CREATE TABLE IF NOT EXISTS storage_quotas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    
    -- Storage Breakdown (in bytes)
    assets_bytes BIGINT NOT NULL DEFAULT 0,
    documents_bytes BIGINT NOT NULL DEFAULT 0,
    attachments_bytes BIGINT NOT NULL DEFAULT 0,
    total_bytes BIGINT GENERATED ALWAYS AS (assets_bytes + documents_bytes + attachments_bytes) STORED,
    
    -- File Counts
    asset_count INTEGER NOT NULL DEFAULT 0,
    document_count INTEGER NOT NULL DEFAULT 0,
    
    last_calculated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(workspace_id, project_id)
);

-- ============================================================================
-- 6. BILLING HISTORY TABLE
-- Records all billing events for audit trail
-- ============================================================================
CREATE TABLE IF NOT EXISTS billing_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    -- Event Details
    event_type TEXT NOT NULL, -- 'subscription_created', 'subscription_updated', 'payment_succeeded', 'payment_failed', 'refund', etc.
    description TEXT,
    
    -- Stripe References
    stripe_invoice_id TEXT,
    stripe_payment_intent_id TEXT,
    stripe_charge_id TEXT,
    
    -- Amount
    amount_cents INTEGER,
    currency TEXT DEFAULT 'usd',
    
    -- Plan Change Details
    previous_plan_id TEXT REFERENCES subscription_plans(id),
    new_plan_id TEXT REFERENCES subscription_plans(id),
    
    -- Metadata
    metadata JSONB,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 7. FEATURE USAGE LOG TABLE
-- Tracks feature usage for analytics and potential overage billing
-- ============================================================================
CREATE TABLE IF NOT EXISTS feature_usage_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Feature Details
    feature_name TEXT NOT NULL, -- 'ai_document_import', 'api_call', 'export', etc.
    usage_count INTEGER NOT NULL DEFAULT 1,
    
    -- Context
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    metadata JSONB,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 8. INDEXES FOR PERFORMANCE
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_workspace_subscriptions_workspace_id ON workspace_subscriptions(workspace_id);
CREATE INDEX IF NOT EXISTS idx_workspace_subscriptions_stripe_customer_id ON workspace_subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_workspace_subscriptions_stripe_subscription_id ON workspace_subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_workspace_usage_workspace_id ON workspace_usage(workspace_id);
CREATE INDEX IF NOT EXISTS idx_storage_quotas_workspace_id ON storage_quotas(workspace_id);
CREATE INDEX IF NOT EXISTS idx_storage_quotas_project_id ON storage_quotas(project_id);
CREATE INDEX IF NOT EXISTS idx_billing_history_workspace_id ON billing_history(workspace_id);
CREATE INDEX IF NOT EXISTS idx_billing_history_created_at ON billing_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feature_usage_log_workspace_id ON feature_usage_log(workspace_id);
CREATE INDEX IF NOT EXISTS idx_feature_usage_log_feature_name ON feature_usage_log(feature_name);
CREATE INDEX IF NOT EXISTS idx_feature_usage_log_created_at ON feature_usage_log(created_at DESC);

-- ============================================================================
-- 9. HELPER FUNCTIONS
-- ============================================================================

-- Function to get effective limit for a workspace (considers overrides)
CREATE OR REPLACE FUNCTION get_workspace_limit(
    p_workspace_id UUID,
    p_limit_name TEXT
) RETURNS BIGINT AS $$
DECLARE
    v_plan_limit BIGINT;
    v_override_limit BIGINT;
BEGIN
    -- Get the plan limit and any override
    SELECT 
        CASE p_limit_name
            WHEN 'max_projects' THEN sp.max_projects
            WHEN 'max_workspaces' THEN sp.max_workspaces
            WHEN 'max_team_members' THEN sp.max_team_members
            WHEN 'max_services_per_project' THEN sp.max_services_per_project
            WHEN 'max_credentials' THEN sp.max_credentials
            WHEN 'max_storage_bytes' THEN sp.max_storage_bytes
            WHEN 'max_integrations' THEN sp.max_integrations
            ELSE 0
        END,
        CASE p_limit_name
            WHEN 'max_projects' THEN ws.override_max_projects
            WHEN 'max_workspaces' THEN ws.override_max_workspaces
            WHEN 'max_team_members' THEN ws.override_max_team_members
            WHEN 'max_services_per_project' THEN ws.override_max_services_per_project
            WHEN 'max_credentials' THEN ws.override_max_credentials
            WHEN 'max_storage_bytes' THEN ws.override_max_storage_bytes
            WHEN 'max_integrations' THEN ws.override_max_integrations
            ELSE NULL
        END
    INTO v_plan_limit, v_override_limit
    FROM workspace_subscriptions ws
    JOIN subscription_plans sp ON ws.plan_id = sp.id
    WHERE ws.workspace_id = p_workspace_id;
    
    -- Return override if set, otherwise plan limit
    RETURN COALESCE(v_override_limit, v_plan_limit, 0);
END;
$$ LANGUAGE plpgsql;

-- Function to check if workspace has feature access
CREATE OR REPLACE FUNCTION workspace_has_feature(
    p_workspace_id UUID,
    p_feature_name TEXT
) RETURNS BOOLEAN AS $$
DECLARE
    v_has_feature BOOLEAN;
BEGIN
    SELECT 
        CASE p_feature_name
            WHEN 'environment_separation' THEN sp.has_environment_separation
            WHEN 'service_stacks' THEN sp.has_service_stacks
            WHEN 'cost_analytics' THEN sp.has_cost_analytics
            WHEN 'ai_document_import' THEN sp.has_ai_document_import
            WHEN 'advanced_alerts' THEN sp.has_advanced_alerts
            WHEN 'rbac' THEN sp.has_rbac
            WHEN 'contractor_access' THEN sp.has_contractor_access
            WHEN 'audit_logging' THEN sp.has_audit_logging
            WHEN 'api_access' THEN sp.has_api_access
            WHEN 'export' THEN sp.has_export
            ELSE FALSE
        END
    INTO v_has_feature
    FROM workspace_subscriptions ws
    JOIN subscription_plans sp ON ws.plan_id = sp.id
    WHERE ws.workspace_id = p_workspace_id;
    
    RETURN COALESCE(v_has_feature, FALSE);
END;
$$ LANGUAGE plpgsql;

-- Function to check if workspace can perform action (within limits)
CREATE OR REPLACE FUNCTION can_workspace_create(
    p_workspace_id UUID,
    p_resource_type TEXT  -- 'project', 'team_member', 'credential', 'integration'
) RETURNS BOOLEAN AS $$
DECLARE
    v_limit BIGINT;
    v_current_count BIGINT;
BEGIN
    -- Get the limit
    v_limit := get_workspace_limit(p_workspace_id, 'max_' || p_resource_type || 's');
    
    -- Unlimited
    IF v_limit = -1 THEN
        RETURN TRUE;
    END IF;
    
    -- Get current count
    SELECT 
        CASE p_resource_type
            WHEN 'project' THEN project_count
            WHEN 'team_member' THEN team_member_count
            WHEN 'credential' THEN credential_count
            WHEN 'integration' THEN integration_count
            ELSE 0
        END
    INTO v_current_count
    FROM workspace_usage
    WHERE workspace_id = p_workspace_id;
    
    RETURN COALESCE(v_current_count, 0) < v_limit;
END;
$$ LANGUAGE plpgsql;

-- Function to check storage quota
CREATE OR REPLACE FUNCTION can_upload_file(
    p_workspace_id UUID,
    p_file_size_bytes BIGINT
) RETURNS BOOLEAN AS $$
DECLARE
    v_limit BIGINT;
    v_current_usage BIGINT;
BEGIN
    -- Get storage limit
    v_limit := get_workspace_limit(p_workspace_id, 'max_storage_bytes');
    
    -- Unlimited
    IF v_limit = -1 THEN
        RETURN TRUE;
    END IF;
    
    -- Get current usage
    SELECT storage_used_bytes INTO v_current_usage
    FROM workspace_usage
    WHERE workspace_id = p_workspace_id;
    
    RETURN (COALESCE(v_current_usage, 0) + p_file_size_bytes) <= v_limit;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 10. TRIGGERS FOR AUTOMATIC USAGE TRACKING
-- ============================================================================

-- Trigger to update project count
CREATE OR REPLACE FUNCTION update_project_count() RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO workspace_usage (workspace_id, project_count)
        VALUES (NEW.workspace_id, 1)
        ON CONFLICT (workspace_id) DO UPDATE
        SET project_count = workspace_usage.project_count + 1,
            updated_at = NOW();
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE workspace_usage
        SET project_count = GREATEST(0, project_count - 1),
            updated_at = NOW()
        WHERE workspace_id = OLD.workspace_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_project_count ON projects;
CREATE TRIGGER trigger_update_project_count
AFTER INSERT OR DELETE ON projects
FOR EACH ROW EXECUTE FUNCTION update_project_count();

-- Trigger to update storage usage when assets are added/removed
CREATE OR REPLACE FUNCTION update_storage_usage() RETURNS TRIGGER AS $$
DECLARE
    v_workspace_id UUID;
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Get workspace_id from project
        SELECT workspace_id INTO v_workspace_id
        FROM projects WHERE id = NEW.project_id;
        
        -- Update workspace usage
        INSERT INTO workspace_usage (workspace_id, storage_used_bytes)
        VALUES (v_workspace_id, NEW.file_size)
        ON CONFLICT (workspace_id) DO UPDATE
        SET storage_used_bytes = workspace_usage.storage_used_bytes + NEW.file_size,
            updated_at = NOW();
            
        -- Update storage quota for project
        INSERT INTO storage_quotas (workspace_id, project_id, assets_bytes, asset_count)
        VALUES (v_workspace_id, NEW.project_id, NEW.file_size, 1)
        ON CONFLICT (workspace_id, project_id) DO UPDATE
        SET assets_bytes = storage_quotas.assets_bytes + NEW.file_size,
            asset_count = storage_quotas.asset_count + 1,
            updated_at = NOW();
            
    ELSIF TG_OP = 'DELETE' THEN
        -- Get workspace_id from project
        SELECT workspace_id INTO v_workspace_id
        FROM projects WHERE id = OLD.project_id;
        
        -- Update workspace usage
        UPDATE workspace_usage
        SET storage_used_bytes = GREATEST(0, storage_used_bytes - OLD.file_size),
            updated_at = NOW()
        WHERE workspace_id = v_workspace_id;
        
        -- Update storage quota for project
        UPDATE storage_quotas
        SET assets_bytes = GREATEST(0, assets_bytes - OLD.file_size),
            asset_count = GREATEST(0, asset_count - 1),
            updated_at = NOW()
        WHERE workspace_id = v_workspace_id AND project_id = OLD.project_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_storage_usage ON assets;
CREATE TRIGGER trigger_update_storage_usage
AFTER INSERT OR DELETE ON assets
FOR EACH ROW EXECUTE FUNCTION update_storage_usage();

-- ============================================================================
-- 11. ROW LEVEL SECURITY
-- ============================================================================
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage_quotas ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_usage_log ENABLE ROW LEVEL SECURITY;

-- Plans are readable by everyone (public pricing)
CREATE POLICY "Plans are viewable by everyone" ON subscription_plans
    FOR SELECT USING (is_active = TRUE);

-- Workspace subscriptions are viewable by workspace members
CREATE POLICY "Workspace subscriptions viewable by members" ON workspace_subscriptions
    FOR SELECT USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
        )
    );

-- Workspace usage viewable by workspace members
CREATE POLICY "Workspace usage viewable by members" ON workspace_usage
    FOR SELECT USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
        )
    );

-- Storage quotas viewable by workspace members
CREATE POLICY "Storage quotas viewable by members" ON storage_quotas
    FOR SELECT USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
        )
    );

-- Billing history viewable by workspace admins/owners only
CREATE POLICY "Billing history viewable by admins" ON billing_history
    FOR SELECT USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members 
            WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
        )
    );

-- Feature usage log viewable by workspace members
CREATE POLICY "Feature usage viewable by members" ON feature_usage_log
    FOR SELECT USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
        )
    );

-- ============================================================================
-- 12. INITIALIZE DEFAULT SUBSCRIPTION FOR EXISTING WORKSPACES
-- ============================================================================
INSERT INTO workspace_subscriptions (workspace_id, plan_id)
SELECT id, 'free' FROM workspaces
WHERE id NOT IN (SELECT workspace_id FROM workspace_subscriptions)
ON CONFLICT (workspace_id) DO NOTHING;

-- Initialize usage tracking for existing workspaces
INSERT INTO workspace_usage (workspace_id, project_count, team_member_count)
SELECT 
    w.id,
    COALESCE((SELECT COUNT(*) FROM projects WHERE workspace_id = w.id), 0),
    COALESCE((SELECT COUNT(*) FROM workspace_members WHERE workspace_id = w.id), 0)
FROM workspaces w
WHERE w.id NOT IN (SELECT workspace_id FROM workspace_usage)
ON CONFLICT (workspace_id) DO NOTHING;
