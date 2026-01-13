-- ============================================================================
-- FIX RLS POLICIES FOR SUBSCRIPTION TABLES
-- ============================================================================
-- This migration fixes the RLS policies that were flagged by Supabase Security Advisor
-- The original policies may have failed to create due to syntax or dependency issues
-- ============================================================================

-- ============================================================================
-- 1. DROP EXISTING POLICIES (if they exist)
-- ============================================================================
DROP POLICY IF EXISTS "Plans are viewable by everyone" ON subscription_plans;
DROP POLICY IF EXISTS "Workspace subscriptions viewable by members" ON workspace_subscriptions;
DROP POLICY IF EXISTS "Workspace usage viewable by members" ON workspace_usage;
DROP POLICY IF EXISTS "Storage quotas viewable by members" ON storage_quotas;
DROP POLICY IF EXISTS "Billing history viewable by admins" ON billing_history;
DROP POLICY IF EXISTS "Feature usage viewable by members" ON feature_usage_log;

-- ============================================================================
-- 2. ENSURE RLS IS ENABLED ON ALL TABLES
-- ============================================================================
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage_quotas ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_history ENABLE ROW LEVEL SECURITY;

-- Also enable on feature_usage_log if it exists
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'feature_usage_log') THEN
        ALTER TABLE feature_usage_log ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- ============================================================================
-- 3. SUBSCRIPTION_PLANS POLICIES
-- Plans should be readable by everyone (public pricing info)
-- ============================================================================

-- Anyone can read active plans (for pricing page, etc.)
CREATE POLICY "subscription_plans_select_public"
ON subscription_plans FOR SELECT
USING (is_active = true);

-- Service role can do everything (for admin/backend operations)
CREATE POLICY "subscription_plans_service_role"
ON subscription_plans FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================================================
-- 4. WORKSPACE_SUBSCRIPTIONS POLICIES
-- Only workspace members can view their workspace's subscription
-- ============================================================================

-- Workspace members can view their subscription
CREATE POLICY "workspace_subscriptions_select_members"
ON workspace_subscriptions FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM workspace_members wm
        WHERE wm.workspace_id = workspace_subscriptions.workspace_id
        AND wm.user_id = auth.uid()
    )
);

-- Service role can do everything (for Stripe webhooks, Edge Functions)
CREATE POLICY "workspace_subscriptions_service_role"
ON workspace_subscriptions FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================================================
-- 5. WORKSPACE_USAGE POLICIES
-- Workspace members can view their usage stats
-- ============================================================================

-- Workspace members can view usage
CREATE POLICY "workspace_usage_select_members"
ON workspace_usage FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM workspace_members wm
        WHERE wm.workspace_id = workspace_usage.workspace_id
        AND wm.user_id = auth.uid()
    )
);

-- Service role can do everything (for triggers, Edge Functions)
CREATE POLICY "workspace_usage_service_role"
ON workspace_usage FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================================================
-- 6. STORAGE_QUOTAS POLICIES
-- Workspace members can view storage quotas
-- ============================================================================

-- Workspace members can view storage quotas
CREATE POLICY "storage_quotas_select_members"
ON storage_quotas FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM workspace_members wm
        WHERE wm.workspace_id = storage_quotas.workspace_id
        AND wm.user_id = auth.uid()
    )
);

-- Service role can do everything (for triggers, Edge Functions)
CREATE POLICY "storage_quotas_service_role"
ON storage_quotas FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================================================
-- 7. BILLING_HISTORY POLICIES
-- Only workspace owners/admins can view billing history
-- ============================================================================

-- Workspace admins/owners can view billing history
CREATE POLICY "billing_history_select_admins"
ON billing_history FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM workspace_members wm
        WHERE wm.workspace_id = billing_history.workspace_id
        AND wm.user_id = auth.uid()
        AND wm.role IN ('owner', 'admin')
    )
);

-- Service role can do everything (for Stripe webhooks)
CREATE POLICY "billing_history_service_role"
ON billing_history FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================================================
-- 8. FEATURE_USAGE_LOG POLICIES (if table exists)
-- ============================================================================
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'feature_usage_log') THEN
        -- Workspace members can view feature usage
        EXECUTE 'CREATE POLICY "feature_usage_log_select_members"
        ON feature_usage_log FOR SELECT
        USING (
            EXISTS (
                SELECT 1 FROM workspace_members wm
                WHERE wm.workspace_id = feature_usage_log.workspace_id
                AND wm.user_id = auth.uid()
            )
        )';
        
        -- Service role can do everything
        EXECUTE 'CREATE POLICY "feature_usage_log_service_role"
        ON feature_usage_log FOR ALL
        TO service_role
        USING (true)
        WITH CHECK (true)';
    END IF;
END $$;

-- ============================================================================
-- VERIFICATION QUERY (run manually to verify)
-- ============================================================================
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
-- FROM pg_policies 
-- WHERE tablename IN ('subscription_plans', 'workspace_subscriptions', 'workspace_usage', 'storage_quotas', 'billing_history', 'feature_usage_log')
-- ORDER BY tablename, policyname;
