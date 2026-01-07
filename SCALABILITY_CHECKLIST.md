# Nerlude Scalability & Implementation Checklist v2.0

> **Last Updated:** January 2025  
> **Purpose:** Pre-database implementation checklist covering architecture, security, integrations, and phased roadmap for scaling to 1M+ users.

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Architecture Analysis](#architecture-analysis)
3. [Code Quality & Refactoring](#code-quality--refactoring)
4. [Security Implementation](#security-implementation)
5. [API & Data Flow](#api--data-flow)
6. [Required Integrations & API Keys](#required-integrations--api-keys)
7. [Landing Page Improvements](#landing-page-improvements)
8. [AI/ML Engine Considerations](#aiml-engine-considerations)
9. [Phased Implementation Roadmap](#phased-implementation-roadmap)

---

## Executive Summary

### Current State
- ✅ **Frontend**: Complete with all major features implemented
- ✅ **State Management**: Zustand stores properly structured
- ✅ **Type System**: Comprehensive TypeScript types defined
- ⚠️ **Backend**: API routes planned but not implemented
- ⚠️ **Database**: Supabase placeholders ready, not connected
- ⚠️ **Security**: Encryption utilities scaffolded, not implemented
- ⚠️ **Auth**: Placeholder hooks, needs Supabase Auth integration

### Scalability Assessment: **READY FOR IMPLEMENTATION**

The codebase is well-structured for scaling. Key strengths:
- Modular component architecture
- Proper separation of concerns (templates, components, stores, types)
- Environment-first credential design
- Multi-tenant workspace model

---

## Architecture Analysis

### Current Structure (Good ✅)

```
nerlude/
├── app/                    # Next.js App Router pages
├── components/             # Reusable UI components (40 components)
├── templates/              # Page-level templates (9 major sections)
├── stores/                 # Zustand state management (6 stores)
├── types/                  # TypeScript type definitions
├── lib/                    # Utilities (auth, db, encryption)
├── data/                   # Mock data (to be replaced with API calls)
├── registry/               # Service registry (static data)
├── hooks/                  # Custom React hooks
└── utils/                  # Helper functions
```

### Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                         │
├─────────────────────────────────────────────────────────────────┤
│  Components ──► Zustand Stores ──► API Calls ──► Server         │
│       ▲              │                              │            │
│       └──────────────┴──────────────────────────────┘            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      NEXT.JS API ROUTES                          │
├─────────────────────────────────────────────────────────────────┤
│  /api/auth/*        - Authentication endpoints                   │
│  /api/workspaces/*  - Workspace CRUD + members                   │
│  /api/projects/*    - Project CRUD + services + credentials      │
│  /api/registry/*    - Service registry (read-only)               │
│  /api/dashboard/*   - Aggregated stats                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         SUPABASE                                 │
├─────────────────────────────────────────────────────────────────┤
│  PostgreSQL    - All relational data                             │
│  Auth          - User authentication + OAuth                     │
│  Storage       - Asset uploads (documents, images)               │
│  Realtime      - Live updates (optional Phase 3)                 │
│  Edge Functions - Background jobs (optional)                     │
└─────────────────────────────────────────────────────────────────┘
```

### Multi-Tenant Model

```
User ──► Workspace(s) ──► Project(s) ──► Service(s) ──► Credential(s)
              │                │              │
              └── Members      └── Members    └── Per-Environment
```

**Key Design Decisions:**
1. **Workspace-level isolation**: All data scoped to workspace
2. **Project-level team access**: Granular permissions per project
3. **Environment-first credentials**: Production/Staging/Development separation
4. **Encrypted credential storage**: AES-256-GCM per workspace

---

## Code Quality & Refactoring

### Files Over 500 Lines (Need Refactoring)

| File | Lines | Priority | Recommended Action |
|------|-------|----------|-------------------|
| `templates/ProjectPage/Docs/index.tsx` | 859 | 🔴 High | Split into: DocsSidebar, DocsEditor, DocsTemplates, NewDocModal |
| `data/mockServices.ts` | 831 | 🟡 Medium | Will be replaced by API - OK for now |
| `templates/NewProjectPage/index.tsx` | 798 | 🔴 High | Split into: ManualFlow, ImportFlow, step components |
| `templates/AddServicePage/index.tsx` | 727 | 🔴 High | Split into: CategoryStep, ServiceStep, ConfigureStep, ConfirmStep |
| `registry/services/index.ts` | 678 | 🟢 Low | Static data, acceptable |
| `templates/ServiceDetailPage/index.tsx` | 579 | 🟡 Medium | Split into: OverviewTab, CredentialsTab, UsageTab, SettingsTab |

### Recommended Refactoring Pattern

```tsx
// BEFORE: Monolithic component
const DocsPage = () => {
  // 800+ lines of mixed concerns
}

// AFTER: Modular components
const DocsPage = () => {
  return (
    <DocsProvider>
      <DocsSidebar />
      <DocsEditor />
      <NewDocModal />
    </DocsProvider>
  );
}
```

### Code Consistency Issues

1. **Import ordering**: Some files have inconsistent import order
2. **Component naming**: Mix of `Page` and `Template` suffixes
3. **State management**: Some components use local state when store would be better
4. **Error handling**: Missing error boundaries in some areas

---

## Security Implementation

### Priority 1: Credential Encryption (CRITICAL)

```typescript
// lib/encryption/index.ts - NEEDS IMPLEMENTATION

/**
 * Security Architecture for Credentials:
 * 
 * 1. ENCRYPTION AT REST
 *    - AES-256-GCM encryption for all credential values
 *    - Per-workspace encryption keys (stored in Supabase Vault or env)
 *    - IV (Initialization Vector) generated per encryption
 *    - Auth tag for integrity verification
 * 
 * 2. KEY MANAGEMENT
 *    - Master key in environment variable (ENCRYPTION_KEY)
 *    - Workspace keys derived from master + workspace_id
 *    - Key rotation support (re-encrypt all credentials)
 * 
 * 3. IMPLEMENTATION
 *    - Use Web Crypto API (browser) or Node crypto (server)
 *    - Never log or expose decrypted values
 *    - Decrypt only on-demand, never cache
 */

// Recommended library: @noble/ciphers (modern, audited)
import { gcm } from '@noble/ciphers/aes';
import { randomBytes } from '@noble/ciphers/webcrypto';
```

### Priority 2: Authentication (CRITICAL)

```typescript
// Supabase Auth Implementation Checklist:

□ Email/Password authentication
□ OAuth providers (Google, GitHub)
□ Email verification required
□ Password strength requirements (min 12 chars, complexity)
□ Rate limiting on auth endpoints
□ Session management (JWT with refresh tokens)
□ 2FA/MFA support (TOTP via authenticator apps)
□ Magic link login option
□ Password reset flow
□ Account lockout after failed attempts
```

### Priority 3: Row Level Security (RLS)

```sql
-- Supabase RLS Policies (MUST IMPLEMENT)

-- Workspaces: Users can only see workspaces they're members of
CREATE POLICY "workspace_member_access" ON workspaces
  FOR ALL USING (
    id IN (
      SELECT workspace_id FROM workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Projects: Users can only see projects in their workspaces
CREATE POLICY "project_workspace_access" ON projects
  FOR ALL USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Credentials: Additional check for project membership
CREATE POLICY "credential_project_access" ON service_credentials
  FOR SELECT USING (
    project_service_id IN (
      SELECT id FROM project_services 
      WHERE project_id IN (
        SELECT id FROM projects WHERE workspace_id IN (
          SELECT workspace_id FROM workspace_members 
          WHERE user_id = auth.uid()
        )
      )
    )
  );
```

### Priority 4: Additional Security Measures

| Measure | Priority | Implementation |
|---------|----------|----------------|
| HTTPS Only | 🔴 Critical | Netlify/Vercel handles this |
| CSP Headers | 🔴 Critical | next.config.ts headers |
| CORS Configuration | 🔴 Critical | API route middleware |
| Input Validation | 🔴 Critical | Zod schemas on all inputs |
| SQL Injection Prevention | 🔴 Critical | Supabase parameterized queries |
| XSS Prevention | 🟡 High | React handles, sanitize user content |
| Rate Limiting | 🟡 High | Upstash Redis or Supabase Edge |
| Audit Logging | 🟡 High | Log all credential access |
| IP Allowlisting | 🟢 Medium | Optional for enterprise |
| SOC 2 Compliance | 🟢 Low | Future consideration |

---

## API & Data Flow

### API Routes Structure (To Implement)

```
/api
├── /auth
│   ├── POST /login          - Email/password login
│   ├── POST /register       - New user registration
│   ├── POST /logout         - Clear session
│   ├── POST /forgot-password - Send reset email
│   ├── POST /reset-password  - Reset with token
│   └── POST /verify-email    - Verify email token
│
├── /users
│   ├── GET  /me             - Current user profile
│   ├── PATCH /me            - Update profile
│   └── DELETE /me           - Delete account
│
├── /workspaces
│   ├── GET  /               - List user's workspaces
│   ├── POST /               - Create workspace
│   ├── GET  /:id            - Get workspace details
│   ├── PATCH /:id           - Update workspace
│   ├── DELETE /:id          - Delete workspace
│   └── /members
│       ├── GET  /           - List members
│       ├── POST /           - Invite member
│       ├── PATCH /:userId   - Update role
│       └── DELETE /:userId  - Remove member
│
├── /projects
│   ├── GET  /               - List projects (filtered by workspace)
│   ├── POST /               - Create project
│   ├── GET  /:id            - Get project details
│   ├── PATCH /:id           - Update project
│   ├── DELETE /:id          - Delete project
│   ├── /services
│   │   ├── GET  /           - List services
│   │   ├── POST /           - Add service
│   │   ├── GET  /:serviceId - Get service details
│   │   ├── PATCH /:serviceId - Update service
│   │   ├── DELETE /:serviceId - Remove service
│   │   └── /credentials
│   │       ├── GET  /       - Get credentials (decrypted)
│   │       ├── POST /       - Add credential
│   │       ├── PATCH /:id   - Update credential
│   │       └── DELETE /:id  - Delete credential
│   ├── /assets
│   │   ├── GET  /           - List assets
│   │   ├── POST /           - Upload asset
│   │   └── DELETE /:id      - Delete asset
│   ├── /docs
│   │   ├── GET  /           - List documents
│   │   ├── POST /           - Create document
│   │   ├── PATCH /:id       - Update document
│   │   └── DELETE /:id      - Delete document
│   └── /members
│       ├── GET  /           - List project members
│       ├── POST /           - Invite to project
│       ├── PATCH /:userId   - Update role
│       └── DELETE /:userId  - Remove from project
│
├── /registry
│   ├── GET  /categories     - List service categories
│   └── GET  /services       - List available services
│
├── /dashboard
│   ├── GET  /stats          - Aggregated statistics
│   ├── GET  /alerts         - User alerts
│   └── GET  /activity       - Recent activity
│
└── /notifications
    ├── GET  /               - List notifications
    ├── PATCH /:id/read      - Mark as read
    └── PATCH /:id/dismiss   - Dismiss notification
```

### Database Schema (Supabase)

```sql
-- ============================================
-- CORE TABLES
-- ============================================

-- Users (extends Supabase auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  email_verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Preferences (notification settings, etc.)
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  email_notifications BOOLEAN DEFAULT true,
  email_frequency TEXT DEFAULT 'immediate' CHECK (email_frequency IN ('immediate', 'daily', 'weekly')),
  quiet_hours_start TIME,
  quiet_hours_end TIME,
  in_app_notifications BOOLEAN DEFAULT true,
  renewal_alerts BOOLEAN DEFAULT true,
  cost_alerts BOOLEAN DEFAULT true,
  team_alerts BOOLEAN DEFAULT true,
  system_alerts BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Onboarding Responses
CREATE TABLE user_onboarding (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  user_type TEXT, -- 'solo_founder', 'startup_team', 'agency', etc.
  company_size TEXT,
  how_found_us TEXT,
  use_case TEXT,
  product_count TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- WORKSPACE & TEAM TABLES
-- ============================================

CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  workspace_type TEXT CHECK (workspace_type IN ('personal', 'startup', 'agency', 'enterprise')),
  encryption_key_id TEXT, -- Reference to Supabase Vault
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE workspace_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
  invited_by UUID REFERENCES users(id),
  invited_at TIMESTAMPTZ DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  UNIQUE(workspace_id, user_id)
);

-- Workspace Invites (pending invitations)
CREATE TABLE workspace_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'member', 'viewer')),
  invited_by UUID REFERENCES users(id),
  token TEXT UNIQUE NOT NULL, -- Secure invite token
  expires_at TIMESTAMPTZ NOT NULL,
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PROJECT TABLES
-- ============================================

CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT '🚀',
  type TEXT NOT NULL CHECK (type IN ('web', 'mobile', 'extension', 'desktop', 'api', 'landing', 'embedded', 'game', 'ai', 'custom')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'archived')),
  settings JSONB DEFAULT '{}',
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE project_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
  access_expires_at TIMESTAMPTZ, -- For contractors/temporary access
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

-- Project Invites (pending invitations)
CREATE TABLE project_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'member', 'viewer')),
  invited_by UUID REFERENCES users(id),
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SERVICE TABLES
-- ============================================

-- Service Stacks (grouping for services)
CREATE TABLE service_stacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT 'slate',
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE project_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  stack_id UUID REFERENCES service_stacks(id) ON DELETE SET NULL,
  registry_id TEXT, -- Reference to static service registry
  category_id TEXT NOT NULL CHECK (category_id IN ('infrastructure', 'identity', 'payments', 'communications', 'analytics', 'domains', 'distribution', 'devtools', 'other')),
  sub_category_id TEXT, -- Optional sub-category
  name TEXT NOT NULL,
  custom_logo_url TEXT, -- For custom services
  plan TEXT,
  cost_amount DECIMAL(10,2) DEFAULT 0,
  cost_frequency TEXT DEFAULT 'monthly' CHECK (cost_frequency IN ('monthly', 'yearly', 'one-time')),
  currency TEXT DEFAULT 'USD',
  renewal_date DATE,
  renewal_reminder_days INTEGER[] DEFAULT '{30, 14, 7}', -- Days before renewal to remind
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'paused', 'deprecated')),
  notes TEXT,
  settings JSONB DEFAULT '{}',
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Service Quick Links (dashboard links, docs, etc.)
CREATE TABLE service_quick_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_service_id UUID REFERENCES project_services(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Service Credentials (encrypted per environment)
CREATE TABLE service_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_service_id UUID REFERENCES project_services(id) ON DELETE CASCADE,
  environment TEXT NOT NULL CHECK (environment IN ('production', 'staging', 'development')),
  credentials_encrypted TEXT NOT NULL, -- AES-256-GCM encrypted JSON
  last_rotated_at TIMESTAMPTZ,
  rotation_reminder_days INTEGER, -- Days before suggesting rotation
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_service_id, environment)
);

-- ============================================
-- DOCUMENT & ASSET TABLES
-- ============================================

CREATE TABLE project_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT, -- Markdown content
  doc_type TEXT NOT NULL CHECK (doc_type IN ('architecture', 'getting-started', 'decisions', 'api-reference', 'changelog', 'roadmap', 'troubleshooting', 'meeting-notes', 'environment', 'notes')),
  icon TEXT, -- Icon identifier (e.g., 'edit', 'code')
  emoji TEXT, -- Optional emoji override
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE project_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  file_path TEXT NOT NULL, -- Supabase Storage path
  file_type TEXT, -- MIME type
  file_size INTEGER, -- Bytes
  category TEXT CHECK (category IN ('logo', 'screenshot', 'document', 'brand', 'invoices', 'receipts', 'contracts', 'other')),
  metadata JSONB DEFAULT '{}', -- Additional metadata (dimensions, etc.)
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- BILLING & SUBSCRIPTION TABLES
-- ============================================

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID UNIQUE REFERENCES workspaces(id) ON DELETE CASCADE,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'team')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'past_due', 'canceled', 'trialing')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  trial_ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Plan Limits (for enforcing plan restrictions)
CREATE TABLE plan_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan TEXT UNIQUE NOT NULL,
  max_projects INTEGER,
  max_services_per_project INTEGER,
  max_team_members INTEGER,
  max_storage_mb INTEGER,
  features JSONB DEFAULT '{}', -- Feature flags
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default plan limits
INSERT INTO plan_limits (plan, max_projects, max_services_per_project, max_team_members, max_storage_mb, features) VALUES
  ('free', 1, 5, 1, 100, '{"credential_encryption": false, "api_access": false, "audit_logs": false}'),
  ('pro', 10, NULL, 5, 1000, '{"credential_encryption": true, "api_access": true, "audit_logs": false}'),
  ('team', NULL, NULL, NULL, 10000, '{"credential_encryption": true, "api_access": true, "audit_logs": true, "sso": true}');

-- ============================================
-- AUDIT & NOTIFICATION TABLES
-- ============================================

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL CHECK (action IN ('create', 'update', 'delete', 'view', 'copy_credential', 'invite_member', 'remove_member', 'change_role', 'login', 'logout')),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('project', 'service', 'credential', 'team_member', 'workspace', 'user', 'asset', 'document')),
  entity_id UUID,
  old_data JSONB, -- Previous state (for updates/deletes)
  new_data JSONB, -- New state (for creates/updates)
  metadata JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('renewal', 'cost_alert', 'team', 'system')),
  title TEXT NOT NULL,
  message TEXT,
  data JSONB DEFAULT '{}',
  read_at TIMESTAMPTZ,
  dismissed_at TIMESTAMPTZ,
  snoozed_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- User lookups
CREATE INDEX idx_users_email ON users(email);

-- Workspace access
CREATE INDEX idx_workspace_members_user ON workspace_members(user_id);
CREATE INDEX idx_workspace_members_workspace ON workspace_members(workspace_id);
CREATE INDEX idx_workspace_invites_email ON workspace_invites(email);
CREATE INDEX idx_workspace_invites_token ON workspace_invites(token);

-- Project access
CREATE INDEX idx_projects_workspace ON projects(workspace_id);
CREATE INDEX idx_project_members_user ON project_members(user_id);
CREATE INDEX idx_project_members_project ON project_members(project_id);
CREATE INDEX idx_project_invites_email ON project_invites(email);
CREATE INDEX idx_project_invites_token ON project_invites(token);

-- Service lookups
CREATE INDEX idx_project_services_project ON project_services(project_id);
CREATE INDEX idx_project_services_stack ON project_services(stack_id);
CREATE INDEX idx_project_services_renewal ON project_services(renewal_date);
CREATE INDEX idx_service_credentials_service ON service_credentials(project_service_id);
CREATE INDEX idx_service_quick_links_service ON service_quick_links(project_service_id);

-- Document & Asset lookups
CREATE INDEX idx_project_documents_project ON project_documents(project_id);
CREATE INDEX idx_project_assets_project ON project_assets(project_id);

-- Audit & Notification lookups
CREATE INDEX idx_audit_logs_workspace ON audit_logs(workspace_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id) WHERE read_at IS NULL;

-- Subscription lookups
CREATE INDEX idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id);
CREATE INDEX idx_subscriptions_stripe_subscription ON subscriptions(stripe_subscription_id);

-- ============================================
-- SERVICE-LEVEL NOTIFICATION SETTINGS
-- ============================================

-- Per-service notification preferences (from ServiceDetailPage/SettingsTab)
CREATE TABLE service_notification_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_service_id UUID UNIQUE REFERENCES project_services(id) ON DELETE CASCADE,
  renewal_reminders BOOLEAN DEFAULT true,
  usage_alerts BOOLEAN DEFAULT false,
  billing_notifications BOOLEAN DEFAULT true,
  usage_threshold_percent INTEGER DEFAULT 80, -- Alert when usage exceeds this %
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for service notification settings
CREATE INDEX idx_service_notification_settings_service ON service_notification_settings(project_service_id);
```

---

## Required Integrations & API Keys

### Tier 1: Core (Required for MVP)

| Service | Purpose | API Key Needed | Priority |
|---------|---------|----------------|----------|
| **Supabase** | Database, Auth, Storage | `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | 🔴 Critical |
| **Resend** | Transactional emails | `RESEND_API_KEY` | 🔴 Critical |

### Tier 2: Enhanced Features

| Service | Purpose | API Key Needed | Priority |
|---------|---------|----------------|----------|
| **Stripe** | Payments & subscriptions | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | 🟡 High |
| **PostHog** | Product analytics | `NEXT_PUBLIC_POSTHOG_KEY` | 🟡 High |
| **Sentry** | Error tracking | `NEXT_PUBLIC_SENTRY_DSN` | 🟡 High |

### Tier 3: Project Import Features

| Service | Purpose | API Key Needed | Priority |
|---------|---------|----------------|----------|
| **OpenAI** | Document parsing, AI extraction | `OPENAI_API_KEY` | 🟡 High |
| **Gmail API** | Email import (receipts) | OAuth credentials | 🟢 Medium |
| **Plaid** | Bank statement parsing | `PLAID_CLIENT_ID`, `PLAID_SECRET` | 🟢 Medium |

### Tier 4: Optional Enhancements

| Service | Purpose | API Key Needed | Priority |
|---------|---------|----------------|----------|
| **Cloudflare R2** | Asset storage (alternative) | R2 credentials | 🟢 Low |
| **Upstash Redis** | Rate limiting, caching | `UPSTASH_REDIS_URL` | 🟢 Low |
| **Trigger.dev** | Background jobs | `TRIGGER_API_KEY` | 🟢 Low |
| **Loops** | Marketing emails | `LOOPS_API_KEY` | 🟢 Low |

---

## Landing Page Improvements

### Current State Analysis

The landing page covers:
- ✅ Hero with clear value proposition
- ✅ Logo cloud (social proof)
- ✅ Problem statement
- ✅ Features (6 key features)
- ✅ How it works
- ✅ Integrations showcase
- ✅ Use cases
- ✅ Testimonials
- ✅ Comparison table
- ✅ Pricing
- ✅ FAQ
- ✅ CTA section

### Recommended Additions

| Section | Priority | Description |
|---------|----------|-------------|
| **Security Badge Section** | 🔴 High | "Bank-level encryption", "SOC 2 ready", "GDPR compliant" badges |
| **Live Demo/Interactive Preview** | 🔴 High | Embedded demo or video walkthrough |
| **ROI Calculator** | 🟡 Medium | "Calculate how much you'll save" interactive widget |
| **Case Study Snippets** | 🟡 Medium | Real numbers: "Saved 10 hours/month" |
| **Agency/Team Pricing** | 🟡 Medium | Highlight multi-workspace for agencies |
| **API/Developer Section** | 🟢 Low | For technical users who want API access |
| **Changelog/Updates** | 🟢 Low | Show active development |

### Hero Improvements

```tsx
// Current
"The Control Center For Your Product Infrastructure"

// Suggested alternatives (A/B test):
"Stop Losing Money to Forgotten Renewals"
"One Dashboard for All Your SaaS Subscriptions"
"The Operating System for Indie Hackers"
```

### Missing Trust Elements

1. **Security certifications** (even if pending)
2. **Data residency options** (EU, US)
3. **Uptime guarantee** (99.9%)
4. **Money-back guarantee** (30 days)
5. **Customer logos** (real companies using it)

---

## AI/ML Engine Considerations

### Phase 1: Document Parsing (MVP)

```typescript
/**
 * AI-Powered Project Import
 * 
 * Use Case: User uploads receipts, invoices, or screenshots
 * Goal: Extract service name, cost, renewal date automatically
 * 
 * Implementation:
 * 1. OCR for images (Tesseract.js or OpenAI Vision)
 * 2. GPT-4 for structured extraction
 * 3. Confidence scoring for manual review
 */

interface ExtractionResult {
  serviceName: string;
  cost: number;
  frequency: 'monthly' | 'yearly';
  renewalDate?: string;
  confidence: number; // 0-1
  needsReview: boolean;
}
```

### Phase 2: Smart Recommendations

```typescript
/**
 * AI Features for Future:
 * 
 * 1. COST OPTIMIZATION
 *    - "You're paying for Vercel Pro but only using 10% of limits"
 *    - "Consider switching from X to Y, save $50/mo"
 * 
 * 2. STACK SUGGESTIONS
 *    - "Projects like yours typically use..."
 *    - "Missing: Error tracking. Consider Sentry."
 * 
 * 3. RENEWAL PREDICTIONS
 *    - ML model to predict churn risk
 *    - Smart reminder timing
 * 
 * 4. NATURAL LANGUAGE QUERIES
 *    - "What's my total AWS spend?"
 *    - "Show me all expiring domains"
 */
```

### Phase 3: Email Integration

```typescript
/**
 * Gmail/Email Integration for Auto-Import
 * 
 * Flow:
 * 1. User connects Gmail via OAuth
 * 2. We scan for receipts from known services
 * 3. Extract: service, amount, date
 * 4. Auto-create or update services
 * 
 * Privacy:
 * - Only read emails from whitelisted senders
 * - Never store email content, only extracted data
 * - User can disconnect anytime
 */
```

---

## Phased Implementation Roadmap

### Phase 1: Foundation (Week 1-2) 🔴 Critical

| Task | Complexity | Description |
|------|------------|-------------|
| Supabase Setup | Easy | Create project, configure auth |
| Database Schema | Medium | Run SQL migrations |
| RLS Policies | Medium | Implement row-level security |
| Auth Integration | Medium | Replace placeholder auth with Supabase |
| Environment Variables | Easy | Set up production env vars |

**Deliverable:** Users can sign up, log in, and have isolated workspaces.

---

### Phase 2: Core CRUD (Week 3-4) 🔴 Critical

| Task | Complexity | Description |
|------|------------|-------------|
| Workspace API | Easy | CRUD endpoints |
| Project API | Medium | CRUD + member management |
| Service API | Medium | CRUD + category filtering |
| Replace Mock Data | Medium | Connect stores to API |
| Error Handling | Easy | Global error boundaries |

**Deliverable:** Full CRUD operations working with real database.

---

### Phase 3: Credentials & Security (Week 5-6) 🔴 Critical

| Task | Complexity | Description |
|------|------------|-------------|
| Encryption Implementation | Complex | AES-256-GCM encryption |
| Credential API | Complex | Encrypt/decrypt on read/write |
| Audit Logging | Medium | Log all credential access |
| 2FA/MFA | Medium | TOTP implementation |
| Rate Limiting | Easy | Upstash or Supabase Edge |

**Deliverable:** Secure credential storage with audit trail.

---

### Phase 4: Payments & Billing (Week 7-8) 🟡 High

| Task | Complexity | Description |
|------|------------|-------------|
| Stripe Integration | Medium | Products, prices, checkout |
| Subscription Management | Medium | Upgrade, downgrade, cancel |
| Usage Limits | Medium | Enforce plan limits |
| Billing Portal | Easy | Stripe customer portal |
| Webhook Handling | Medium | Subscription events |

**Deliverable:** Monetization ready, users can subscribe.

---

### Phase 5: Notifications & Alerts (Week 9-10) 🟡 High

| Task | Complexity | Description |
|------|------------|-------------|
| Email Service | Easy | Resend integration |
| Renewal Reminders | Medium | Scheduled jobs |
| In-App Notifications | Easy | Real-time with Supabase |
| Notification Preferences | Easy | User settings |
| Alert Dashboard | Easy | Already built, connect to API |

**Deliverable:** Proactive renewal alerts working.

---

### Phase 6: File Uploads & Assets (Week 11-12) 🟡 Medium

| Task | Complexity | Description |
|------|------------|-------------|
| Supabase Storage | Easy | Configure buckets |
| Asset Upload API | Medium | Upload, list, delete |
| Document Storage | Medium | Markdown documents |
| File Type Validation | Easy | Security checks |
| Storage Limits | Easy | Per-plan limits |

**Deliverable:** Users can upload and manage assets.

---

### Phase 7: AI Import Features (Week 13-14) 🟢 Medium

| Task | Complexity | Description |
|------|------------|-------------|
| OpenAI Integration | Medium | API setup |
| Document Parsing | Complex | Extract from PDFs/images |
| Receipt Processing | Complex | OCR + structured extraction |
| Review UI | Medium | Confidence-based review |
| Bulk Import | Medium | Multiple documents |

**Deliverable:** AI-powered project import from documents.

---

### Phase 8: Team & Collaboration (Week 15-16) 🟢 Medium

| Task | Complexity | Description |
|------|------------|-------------|
| Invite System | Medium | Email invites with tokens |
| Role Permissions | Medium | RBAC implementation |
| Contractor Access | Medium | Time-limited access |
| Activity Feed | Easy | Team activity log |
| Handoff Export | Medium | Export project for sale |

**Deliverable:** Full team collaboration features.

---

### Phase 9: Analytics & Insights (Week 17-18) 🟢 Low

| Task | Complexity | Description |
|------|------------|-------------|
| Cost Analytics | Medium | Charts and trends |
| Usage Reports | Medium | Per-project breakdown |
| Export Reports | Easy | PDF/CSV export |
| Benchmark Data | Complex | Anonymous comparisons |

**Deliverable:** Rich analytics dashboard.

---

### Phase 10: Polish & Scale (Week 19-20) 🟢 Low

| Task | Complexity | Description |
|------|------------|-------------|
| Performance Optimization | Medium | Query optimization, caching |
| Mobile Responsiveness | Easy | Final mobile polish |
| Accessibility Audit | Medium | WCAG compliance |
| Load Testing | Medium | Verify 1M user capacity |
| Documentation | Easy | API docs, help center |

**Deliverable:** Production-ready for scale.

---

## Code Refactoring Priority

### Immediate (Before Phase 1)

1. **Split `Docs/index.tsx`** (859 lines)
   - `DocsProvider.tsx` - Context for document state
   - `DocsSidebar.tsx` - Document list and navigation
   - `DocsEditor.tsx` - Markdown editor
   - `DocsTemplates.tsx` - Template selection
   - `NewDocModal.tsx` - Create document modal

2. **Split `NewProjectPage/index.tsx`** (798 lines)
   - `ManualProjectFlow.tsx` - Manual creation steps
   - `ImportProjectFlow.tsx` - Document import flow
   - `ProjectBasicsStep.tsx` - Name, type, icon
   - `ProjectTemplateStep.tsx` - Template selection
   - `ProjectServicesStep.tsx` - Service selection

3. **Split `AddServicePage/index.tsx`** (727 lines)
   - `CategoryStep.tsx` - Category selection
   - `ServiceStep.tsx` - Service selection
   - `ConfigureStep.tsx` - Plan and credentials
   - `ConfirmStep.tsx` - Review and confirm

### Before Phase 3

4. **Split `ServiceDetailPage/index.tsx`** (579 lines)
   - `ServiceOverviewTab.tsx`
   - `ServiceCredentialsTab.tsx`
   - `ServiceUsageTab.tsx`
   - `ServiceSettingsTab.tsx`

---

## Summary Checklist

### Pre-Launch Essentials

- [ ] Supabase database connected
- [ ] Authentication working (email + OAuth)
- [ ] RLS policies implemented
- [ ] Credential encryption implemented
- [ ] Stripe payments integrated
- [ ] Email notifications working
- [ ] Error tracking (Sentry) enabled
- [ ] Analytics (PostHog) enabled
- [ ] Files over 500 lines refactored
- [ ] Security audit completed

### Scale Readiness

- [ ] Database indexes optimized
- [ ] API rate limiting enabled
- [ ] CDN configured (Vercel/Netlify)
- [ ] Monitoring dashboards set up
- [ ] Backup strategy documented
- [ ] Incident response plan created

---

*This document should be updated as implementation progresses. Each phase completion should be marked and dated.*
