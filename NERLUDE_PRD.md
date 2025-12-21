# Nelrude - Product Requirements Document (PRD)

> **Project Codename:** Nelrude  
> **Domain:** nelrude.com  
> **Version:** 1.0  
> **Last Updated:** December 2024

---

## System Prompt Context

You are building **Nelrude**, a product infrastructure management platform for founders, indie hackers, agencies, and small teams. The goal is to create the **single source of truth** for everything that powers their software products—from hosting and databases to API keys, domains, credentials, assets, and team access.

We are transforming an existing Next.js boilerplate template into Nelrude. The architecture must be **modular and scalable** to support future growth including social features, marketplace integrations, AI recommendations, and team collaboration at scale.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Solution Overview](#3-solution-overview)
4. [Target Users](#4-target-users)
5. [Core Value Propositions](#5-core-value-propositions)
6. [Product Architecture](#6-product-architecture)
7. [Feature Specifications](#7-feature-specifications)
8. [Database Schema](#8-database-schema)
9. [Navigation & UX Flow](#9-navigation--ux-flow)
10. [Service Registry System](#10-service-registry-system)
11. [UI/UX Guidelines](#11-uiux-guidelines)
12. [API Structure](#12-api-structure)
13. [Security Requirements](#13-security-requirements)
14. [Technical Stack](#14-technical-stack)
15. [Future Roadmap](#15-future-roadmap)
16. [Success Metrics](#16-success-metrics)

---

## 1. Executive Summary

### What is Nelrude?

Nelrude is the **control center for founders** to manage the hidden infrastructure behind all their software products. It centralizes domains, hosting, databases, API keys, credentials, billing, renewals, assets, and team access across multiple projects in one organized, secure platform.

### The One-Liner

> "Nelrude is where founders organize everything that powers their products—so nothing falls through the cracks."

### Why "Nelrude"?

The name evokes **clarity and structure**—a foundation you can build upon. It's short, memorable, and doesn't pigeonhole the product into a narrow use case.

---

## 2. Problem Statement

### The Chaos of Modern Product Building

Every software product—web app, mobile app, Chrome extension, API—is glued together by a sprawling mess of services:

- **Hosting** scattered across Vercel, Railway, AWS, DigitalOcean
- **Domains** spread across Namecheap, Cloudflare, GoDaddy
- **Databases** on Supabase, PlanetScale, Firebase, MongoDB
- **Payments** through Stripe, Paddle, LemonSqueezy
- **API keys** buried in `.env` files, Notion docs, or memory
- **Credentials** shared insecurely via Slack DMs or email
- **Renewals** that sneak up and cause outages
- **Costs** that accumulate invisibly until the credit card bill arrives

### The Pain is Real

Research validates this problem extensively:

- Founders regularly **lose domains** to expiration (some permanently)
- **Surprise bills** of $100-$8,000 from forgotten services
- **2.5 hours per week** average spent managing API keys alone
- **No visibility** into per-product infrastructure costs
- **Onboarding contractors** requires hours of credential hunting
- **Offboarding** risks leaving access in the wrong hands

### Current "Solutions" Are Inadequate

| Current Approach | Why It Fails |
|-----------------|--------------|
| Notion/Spreadsheets | Manual, no alerts, insecure for credentials, gets stale |
| Password Managers | No project context, no cost tracking, no renewals |
| Enterprise Tools (Zylo, Cledara) | $10K+/year, designed for IT departments, massive overkill |
| Memory | Works until it doesn't—then it's catastrophic |

### The Gap

There is **no dedicated solution** for indie hackers, small teams, and agencies to manage product infrastructure at an appropriate price point ($15-50/month) with the right feature set.

---

## 3. Solution Overview

### Nelrude's Core Promise

Nelrude gives founders a **single source of truth** to:

1. **Organize** all services by project (what powers what)
2. **Secure** credentials with proper encryption and access control
3. **Track** costs per project and across the portfolio
4. **Alert** before renewals, expirations, and anomalies
5. **Collaborate** with team members and contractors safely
6. **Document** architecture decisions and project context

### How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│                         NELRUDE                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │ Project  │  │ Project  │  │ Project  │  │ Project  │        │
│  │    A     │  │    B     │  │    C     │  │    D     │        │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘        │
│       │             │             │             │               │
│       ▼             ▼             ▼             ▼               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    SERVICE LAYER                         │   │
│  │  Hosting │ Database │ Domain │ Payments │ Email │ ...   │   │
│  └─────────────────────────────────────────────────────────┘   │
│       │             │             │             │               │
│       ▼             ▼             ▼             ▼               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Credentials │ Costs │ Renewals │ Team Access │ Assets  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Target Users

### Primary Persona: The Portfolio Founder

- **Who:** Solo founder or duo running 2-8 active products
- **Profile:** Technical (full-stack dev), 28-42 years old, $50K-200K revenue
- **Pain:** Juggling too many services across too many projects
- **Goal:** Peace of mind that nothing will break due to oversight
- **WTP:** $19-39/month

### Secondary Persona: The Agency Owner

- **Who:** Small agency (2-15 people) managing 10-50 client projects
- **Profile:** Technical founder or CTO, responsible for client infrastructure
- **Pain:** Risk of client outages, credential chaos, billing attribution
- **Goal:** Professional infrastructure management, client trust
- **WTP:** $49-99/month

### Tertiary Persona: The Startup CTO

- **Who:** Early-stage startup (2-20 people) with multiple product lines
- **Profile:** Technical leader managing team and infrastructure
- **Pain:** Onboarding/offboarding, cost visibility, documentation
- **Goal:** Operational clarity as the team scales
- **WTP:** $49-149/month

---

## 5. Core Value Propositions

### 1. Never Miss a Renewal Again
Proactive alerts for domains, SSL certs, subscriptions, and API key expirations—delivered via email, Slack, or in-app.

### 2. Know Your True Costs
See exactly what each product costs to run. Identify waste. Make informed decisions about which projects to continue or sunset.

### 3. One-Click Context Switching
Jump between projects and instantly see everything: credentials, services, status, docs. No more hunting through Notion pages.

### 4. Secure Credential Management
Encrypted storage with environment separation (prod/staging/dev). Share with team members without exposing raw secrets.

### 5. Onboard & Offboard in Minutes
Grant project access to contractors. Revoke it when they're done. Know exactly what they had access to.

### 6. Your Products, Documented
Architecture decisions, notes, assets—all tied to the project they belong to. Ready for handoff or sale.

---

## 6. Product Architecture

### 6.1 Architectural Principles

1. **Modular by Design**
   - Every feature is a self-contained module
   - Modules can be enabled/disabled per plan
   - New modules can be added without disrupting existing ones

2. **Project-Centric Data Model**
   - Everything belongs to a Project
   - Projects belong to a Workspace
   - Workspaces belong to Users/Teams

3. **Service Registry Pattern**
   - Pre-defined service catalog with metadata
   - Dynamic forms based on service type
   - Extensible for custom services

4. **Event-Driven Alerts**
   - Background jobs monitor renewal dates
   - Webhooks for external integrations
   - Notification preferences per user

5. **Security-First Credentials**
   - Encryption at rest (AES-256)
   - Field-level encryption for secrets
   - Audit logs for access

### 6.2 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER                               │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                    Next.js Application                       │    │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │    │
│  │  │Dashboard│ │ Project │ │ Service │ │Settings │           │    │
│  │  │  View   │ │  View   │ │  View   │ │  View   │           │    │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘           │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                           API LAYER                                  │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                   Next.js API Routes                         │    │
│  │  /api/projects  /api/services  /api/credentials  /api/...   │    │
│  └─────────────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                   Middleware Layer                           │    │
│  │     Auth │ Rate Limiting │ Validation │ Error Handling      │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         SERVICE LAYER                                │
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐             │
│  │   Project     │ │   Service     │ │  Credential   │             │
│  │   Service     │ │   Registry    │ │   Service     │             │
│  └───────────────┘ └───────────────┘ └───────────────┘             │
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐             │
│  │   Renewal     │ │    Team       │ │    Asset      │             │
│  │   Service     │ │   Service     │ │   Service     │             │
│  └───────────────┘ └───────────────┘ └───────────────┘             │
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐             │
│  │ Notification  │ │   Billing     │ │   Analytics   │             │
│  │   Service     │ │   Service     │ │   Service     │             │
│  └───────────────┘ └───────────────┘ └───────────────┘             │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          DATA LAYER                                  │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │              PostgreSQL (via Supabase/Neon)                  │    │
│  │   Users │ Workspaces │ Projects │ Services │ Credentials    │    │
│  └─────────────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                     Redis (Optional)                         │    │
│  │            Session Cache │ Rate Limiting │ Queues           │    │
│  └─────────────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                    File Storage (S3/R2)                      │    │
│  │               Assets │ Logos │ Documents                     │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       BACKGROUND JOBS                                │
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐             │
│  │   Renewal     │ │     Cost      │ │   Service     │             │
│  │   Checker     │ │   Aggregator  │ │ Health Check  │             │
│  └───────────────┘ └───────────────┘ └───────────────┘             │
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐             │
│  │  Notification │ │    Report     │ │   Cleanup     │             │
│  │   Dispatcher  │ │   Generator   │ │     Jobs      │             │
│  └───────────────┘ └───────────────┘ └───────────────┘             │
└─────────────────────────────────────────────────────────────────────┘
```

### 6.3 Module Structure

```
/src
├── /app                          # Next.js App Router
│   ├── /(auth)                   # Auth pages (login, register, etc.)
│   ├── /(dashboard)              # Main app pages
│   │   ├── /page.tsx             # Dashboard/Home
│   │   ├── /projects
│   │   │   ├── /page.tsx         # Projects list
│   │   │   ├── /new/page.tsx     # New project wizard
│   │   │   └── /[projectId]
│   │   │       ├── /page.tsx     # Project overview
│   │   │       ├── /services/page.tsx
│   │   │       ├── /assets/page.tsx
│   │   │       ├── /team/page.tsx
│   │   │       ├── /docs/page.tsx
│   │   │       └── /settings/page.tsx
│   │   ├── /settings             # User/workspace settings
│   │   └── /billing              # Subscription management
│   └── /api                      # API routes
│       ├── /projects
│       ├── /services
│       ├── /credentials
│       ├── /assets
│       ├── /team
│       ├── /notifications
│       └── /webhooks
│
├── /components
│   ├── /ui                       # Base UI components (shadcn)
│   ├── /common                   # Shared components
│   ├── /dashboard                # Dashboard-specific components
│   ├── /project                  # Project-related components
│   ├── /service                  # Service-related components
│   └── /modals                   # Modal components
│
├── /modules                      # Feature modules
│   ├── /projects
│   │   ├── /components
│   │   ├── /hooks
│   │   ├── /services
│   │   └── /types
│   ├── /services
│   ├── /credentials
│   ├── /assets
│   ├── /team
│   ├── /notifications
│   └── /billing
│
├── /lib
│   ├── /db                       # Database client & queries
│   ├── /auth                     # Authentication utilities
│   ├── /encryption               # Credential encryption
│   ├── /notifications            # Notification dispatching
│   └── /utils                    # General utilities
│
├── /registry                     # Service Registry
│   ├── /services                 # Service definitions
│   │   ├── hosting.ts
│   │   ├── database.ts
│   │   ├── domain.ts
│   │   ├── payments.ts
│   │   └── ...
│   ├── /icons                    # Service icons/logos
│   └── index.ts                  # Registry exports
│
├── /hooks                        # Global React hooks
├── /stores                       # State management (Zustand)
├── /types                        # Global TypeScript types
└── /config                       # App configuration
```

---

## 7. Feature Specifications

### 7.1 Dashboard (Home)

**Purpose:** Portfolio overview and quick actions

**Layout:**
- No sidebar on dashboard
- Full-width content area
- Prominent "New Project" button

**Components:**
1. **Quick Stats Bar**
   - Total active projects
   - Monthly burn (sum of all costs)
   - Total services count
   - Upcoming renewals (next 30 days)

2. **Alerts Section**
   - Priority-sorted list of action items
   - Domain expirations
   - SSL certificate renewals
   - Subscription renewals
   - Cost anomalies
   - Each alert has: dismiss, snooze, take action

3. **Projects Grid**
   - Card per project
   - Project icon/emoji
   - Project name
   - Project type badge
   - Status indicator (active/paused/archived)
   - Monthly cost
   - Service count
   - Alert count (if any)
   - Click to navigate to project

4. **Add Project Card**
   - Dashed border, + icon
   - Opens new project wizard

**Filtering & Sorting:**
- Filter by: All, Active, Paused, Archived
- Sort by: Name, Last updated, Cost, Alerts

---

### 7.2 Project View

**Purpose:** Complete view of a single project's infrastructure

**Layout:**
- Floating sidebar on left (appears when in project context)
- Main content area

**Sidebar Navigation:**
```
[Project Icon] [Project Name]
● Active

─────────────────
Overview
Services
Assets
Docs & Notes
Team
Settings
─────────────────
SERVICE CATEGORIES
├── Hosting (2)
├── Database (1)
├── Domain (1)
├── Payments (1)
├── Email (1)
└── Analytics (2)
```

**Overview Tab:**
- Project stats (cost, services, team, next renewal)
- Active alerts for this project
- Recent activity feed
- Quick actions (add service, invite member)

**Services Tab:**
- Grouped by category
- Service cards with:
  - Service logo (from registry)
  - Service name
  - Plan/tier (if applicable)
  - Monthly cost
  - Status indicator
  - Renewal date
- "Add Service" button per category
- Click card → Service detail view

**Assets Tab:**
- File upload area
- Organized by type:
  - Logos (icon, full, dark mode variants)
  - Screenshots (app store, marketing)
  - Documents (guides, contracts)
  - Brand assets (colors, fonts)
- Preview thumbnails
- Download/delete actions

**Docs & Notes Tab:**
- Rich text editor
- Sections:
  - Architecture notes
  - Getting started guide
  - Decision log
  - Free-form notes
- Markdown support
- Auto-save

**Team Tab:**
- Current team members
- Role badges (Owner, Admin, Member, Viewer)
- Access expiration (for contractors)
- Invite member button
- Remove member action

**Settings Tab:**
- Project name & icon
- Project type
- Status (Active/Paused/Archived)
- Environment configuration
- Danger zone (archive/delete)
- Export project data

---

### 7.3 Service Detail View

**Purpose:** View and manage a single service's configuration

**Layout:**
- Same sidebar as project view
- Focused content area

**Sections:**

1. **Header**
   - Service logo (large)
   - Service name
   - Category badge
   - Status indicator
   - Quick links: Dashboard, Docs, Status Page, Billing
   - Edit/Delete actions

2. **Stats Row**
   - Status: Healthy/Warning/Error
   - Monthly cost
   - Billing cycle
   - Next renewal date

3. **Credentials Section**
   - Environment selector dropdown (Production/Staging/Development)
   - Dynamic fields based on service type:
     - URLs (project URL, API endpoint)
     - Keys (public key, secret key)
     - Passwords
     - Connection strings
   - Show/hide toggle per field
   - Copy button per field
   - "Last copied" indicator

4. **Configuration Section**
   - Plan/tier display
   - Region/location
   - Resource limits
   - Custom configuration fields

5. **Quick Links**
   - Configurable list of relevant URLs
   - Dashboard, documentation, status page, billing

6. **Notes**
   - Service-specific notes
   - Tips, gotchas, decisions

7. **Activity Log**
   - Recent changes to this service
   - Who changed what, when

---

### 7.4 New Project Wizard

**Purpose:** Guided project creation with smart defaults

**Flow:**

```
Step 1: Project Details
├── Project name (required)
├── Project description (optional)
├── Project icon/emoji picker
└── Project type selector:
    ├── Web Application
    ├── Mobile App
    ├── Browser Extension
    ├── Desktop Application
    ├── API / Backend
    └── Landing Page

Step 2: Choose Template (Optional)
├── SaaS Starter
│   └── Pre-selects: Vercel, Supabase, Stripe, Resend, Plausible
├── Mobile App Starter
│   └── Pre-selects: Expo, Firebase, RevenueCat, Sentry
├── Chrome Extension
│   └── Pre-selects: Chrome Web Store, Firebase
├── API Backend
│   └── Pre-selects: Railway, PostgreSQL, Redis
└── Start Blank
    └── No pre-selections

Step 3: Add Essential Services
├── Domain (optional)
│   └── Quick add: domain name, registrar, expiry
├── Hosting (recommended)
│   └── Select from registry, auto-show plan options
├── Database (recommended)
│   └── Select from registry, auto-show plan options
├── Authentication (optional)
│   └── Select from registry
└── Payments (optional)
    └── Select from registry

Step 4: Confirmation
├── Summary of project
├── List of services to be added
└── "Create Project" button
```

**Smart Behaviors:**
- Templates pre-populate services
- Each service selection shows plan dropdown
- Skip any step to proceed
- Can always add more services later

---

### 7.5 Add Service Flow

**Purpose:** Add a new service to a project

**Flow:**

```
Step 1: Select Category
├── Hosting & Infrastructure
├── Database
├── Domain & DNS
├── Authentication
├── Payments
├── Email & Communications
├── Analytics & Monitoring
├── Storage & CDN
├── AI & APIs
├── Dev Tools
├── Marketing & Support
├── App Stores
└── Custom / Other

Step 2: Select Service (filtered by category)
├── Shows service logos in a grid
├── Search/filter within category
├── Each option shows:
│   ├── Service logo
│   ├── Service name
│   └── Brief description
└── "Custom Service" option always available

Step 3: Configure Service (dynamic based on selection)
├── Plan/Tier Dropdown (populated from registry)
│   └── e.g., Vercel: Hobby, Pro, Enterprise
├── Cost Input
│   ├── Amount
│   ├── Frequency (monthly/yearly/one-time)
│   └── Auto-fill from plan if known
├── Renewal Date (optional)
├── Credentials Section
│   ├── Dynamic fields based on service type
│   └── e.g., Stripe shows: Publishable Key, Secret Key, Webhook Secret
├── Notes (optional)
└── Quick Links (optional)

Step 4: Confirm & Add
```

---

### 7.6 Notifications & Alerts

**Types:**
1. **Renewal Alerts**
   - Domain expiration (30, 14, 7, 3, 1 days before)
   - SSL certificate expiration
   - Subscription renewal reminders
   - API key expiration

2. **Cost Alerts**
   - Monthly cost exceeds threshold
   - Cost increased significantly from last month
   - New charge detected

3. **Team Alerts**
   - Team member access expiring
   - New member joined
   - Member removed

4. **System Alerts**
   - Service health issues (if integrated)
   - Backup reminders

**Delivery Channels:**
- In-app notification center
- Email (digest or immediate)
- Slack webhook (future)
- Browser push (future)

**User Preferences:**
- Per-channel toggles
- Frequency settings (immediate, daily digest, weekly)
- Quiet hours

---

### 7.7 Team & Access Management

**Roles:**
| Role | Permissions |
|------|-------------|
| Owner | Full access, billing, delete workspace |
| Admin | Manage projects, services, team (except billing) |
| Member | View all, edit assigned projects |
| Viewer | Read-only access |
| Contractor | Time-limited access to specific projects |

**Features:**
- Invite via email
- Set role on invite
- Set access expiration (for contractors)
- Revoke access
- Audit log of access changes

---

### 7.8 Settings

**User Settings:**
- Profile (name, email, avatar)
- Password change
- Two-factor authentication
- Notification preferences
- Connected accounts (future: Google, GitHub)

**Workspace Settings:**
- Workspace name
- Default currency
- Team management
- Billing & subscription
- API keys (for integrations)
- Data export
- Delete workspace

---

## 8. Database Schema

### Core Entities

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  avatar_url TEXT,
  password_hash TEXT,
  email_verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Workspaces (multi-tenant support)
CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Workspace Members
CREATE TABLE workspace_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL DEFAULT 'member', -- owner, admin, member, viewer
  invited_by UUID REFERENCES users(id),
  invited_at TIMESTAMP DEFAULT NOW(),
  accepted_at TIMESTAMP,
  UNIQUE(workspace_id, user_id)
);

-- Projects
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(50), -- emoji or icon identifier
  type VARCHAR(50) NOT NULL, -- web, mobile, extension, desktop, api, landing
  status VARCHAR(50) DEFAULT 'active', -- active, paused, archived
  settings JSONB DEFAULT '{}',
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Project Members (for granular access)
CREATE TABLE project_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL DEFAULT 'member',
  access_expires_at TIMESTAMP, -- for contractors
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

-- Service Categories
CREATE TABLE service_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  display_order INT DEFAULT 0
);

-- Service Registry (predefined services)
CREATE TABLE service_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES service_categories(id),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT,
  website_url TEXT,
  docs_url TEXT,
  status_page_url TEXT,
  plans JSONB, -- array of {name, monthly_cost, features}
  credential_schema JSONB, -- defines what fields to collect
  default_quick_links JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Project Services (instances of services per project)
CREATE TABLE project_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  service_registry_id UUID REFERENCES service_registry(id), -- NULL for custom
  category_id UUID REFERENCES service_categories(id),
  
  -- Service details
  name VARCHAR(255) NOT NULL, -- can override registry name
  custom_logo_url TEXT, -- for custom services
  plan VARCHAR(100),
  
  -- Cost tracking
  cost_amount DECIMAL(10, 2),
  cost_frequency VARCHAR(50), -- monthly, yearly, one-time
  currency VARCHAR(3) DEFAULT 'USD',
  
  -- Renewal tracking
  renewal_date DATE,
  renewal_reminder_days INT[] DEFAULT '{30, 14, 7}',
  
  -- Status
  status VARCHAR(50) DEFAULT 'active', -- active, inactive, deprecated
  
  -- Metadata
  notes TEXT,
  quick_links JSONB,
  settings JSONB DEFAULT '{}',
  
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Service Credentials (encrypted)
CREATE TABLE service_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_service_id UUID REFERENCES project_services(id) ON DELETE CASCADE,
  environment VARCHAR(50) NOT NULL DEFAULT 'production', -- production, staging, development
  
  -- Encrypted credential data
  credentials_encrypted TEXT NOT NULL, -- AES-256 encrypted JSON
  
  -- Metadata (not encrypted)
  last_rotated_at TIMESTAMP,
  rotation_reminder_days INT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(project_service_id, environment)
);

-- Assets
CREATE TABLE assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL, -- logo, screenshot, document, brand
  file_url TEXT NOT NULL,
  file_size INT,
  mime_type VARCHAR(100),
  metadata JSONB DEFAULT '{}',
  
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Project Documents
CREATE TABLE project_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  
  title VARCHAR(255) NOT NULL,
  content TEXT, -- markdown content
  doc_type VARCHAR(50) DEFAULT 'note', -- architecture, getting_started, decisions, note
  
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  
  type VARCHAR(50) NOT NULL, -- renewal, cost_alert, team, system
  title VARCHAR(255) NOT NULL,
  message TEXT,
  data JSONB, -- additional context
  
  read_at TIMESTAMP,
  dismissed_at TIMESTAMP,
  snoozed_until TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Audit Log
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  
  action VARCHAR(100) NOT NULL, -- create, update, delete, view, copy_credential
  entity_type VARCHAR(50) NOT NULL, -- project, service, credential, team_member
  entity_id UUID,
  
  old_data JSONB,
  new_data JSONB,
  ip_address INET,
  user_agent TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_projects_workspace ON projects(workspace_id);
CREATE INDEX idx_project_services_project ON project_services(project_id);
CREATE INDEX idx_project_services_renewal ON project_services(renewal_date);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id) WHERE read_at IS NULL;
CREATE INDEX idx_audit_logs_workspace ON audit_logs(workspace_id, created_at DESC);
```

---

## 9. Navigation & UX Flow

### 9.1 Navigation States

**State 1: Dashboard (No Sidebar)**
```
┌─────────────────────────────────────────────────────────────────┐
│  [Logo] Nelrude                    [Search] [Notifications] [👤]│
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│                    FULL WIDTH DASHBOARD                          │
│                                                                  │
│  [Quick Stats] [Alerts] [Project Grid] [+ New Project]          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**State 2: Inside Project (Floating Sidebar)**
```
┌─────────────────────────────────────────────────────────────────┐
│  [Logo] Nelrude                    [Search] [Notifications] [👤]│
├──────────────┬──────────────────────────────────────────────────┤
│              │                                                   │
│  [← Back]    │                                                   │
│              │           PROJECT CONTENT AREA                    │
│  [Project]   │                                                   │
│  ● Active    │   (Overview, Services, Assets, Docs, Team)       │
│              │                                                   │
│  ──────────  │                                                   │
│  Overview    │                                                   │
│  Services    │                                                   │
│  Assets      │                                                   │
│  Docs        │                                                   │
│  Team        │                                                   │
│  Settings    │                                                   │
│  ──────────  │                                                   │
│  CATEGORIES  │                                                   │
│  Hosting (2) │                                                   │
│  Database(1) │                                                   │
│  ...         │                                                   │
│              │                                                   │
└──────────────┴──────────────────────────────────────────────────┘
```

### 9.2 Navigation Rules

1. **Dashboard is the home**
   - URL: `/dashboard`
   - No sidebar
   - Shows all projects
   - Primary action: Create project

2. **Entering a project reveals sidebar**
   - URL: `/projects/[id]`
   - Sidebar slides in from left
   - Sidebar persists across all project sub-pages
   - Sidebar shows project-specific navigation

3. **Service detail is within project context**
   - URL: `/projects/[id]/services/[serviceId]`
   - Same sidebar as project
   - Breadcrumb: Project > Services > [Service Name]

4. **Back button behavior**
   - From project → Dashboard
   - From service → Project services list
   - From settings → Previous page

5. **Sidebar interactions**
   - Collapse/expand toggle
   - Hover to peek (when collapsed)
   - Remembers state per user

### 9.3 URL Structure

```
/                           → Redirect to /dashboard
/dashboard                  → Portfolio dashboard
/projects/new               → New project wizard
/projects/[id]              → Project overview
/projects/[id]/services     → Services list
/projects/[id]/services/new → Add service flow
/projects/[id]/services/[serviceId] → Service detail
/projects/[id]/assets       → Assets library
/projects/[id]/docs         → Documentation
/projects/[id]/team         → Team management
/projects/[id]/settings     → Project settings
/settings                   → User settings
/settings/workspace         → Workspace settings
/settings/billing           → Billing & subscription
```

---

## 10. Service Registry System

### 10.1 Registry Architecture

The Service Registry is a **predefined catalog** of services that Nelrude understands. It provides:

- **Service metadata** (name, logo, URLs)
- **Plan information** (tiers, pricing)
- **Credential schema** (what fields to collect)
- **Smart defaults** (quick links, common settings)

### 10.2 Registry Data Structure

```typescript
interface ServiceRegistryEntry {
  id: string;
  slug: string;
  name: string;
  category: ServiceCategory;
  
  // Branding
  logo: {
    light: string;  // URL or local path
    dark: string;   // Dark mode variant
    icon: string;   // Small icon version
  };
  
  // Links
  website: string;
  docs: string;
  statusPage?: string;
  dashboard?: string;
  
  // Plans (for dropdown population)
  plans: {
    id: string;
    name: string;
    monthlyCost?: number;
    yearlyCost?: number;
    features?: string[];
  }[];
  
  // Credential Schema (defines form fields)
  credentialSchema: {
    fields: CredentialField[];
  };
  
  // Default quick links
  defaultQuickLinks: {
    label: string;
    url: string;  // Can use placeholders like {projectUrl}
  }[];
}

interface CredentialField {
  key: string;
  label: string;
  type: 'text' | 'password' | 'url' | 'textarea';
  required: boolean;
  placeholder?: string;
  helpText?: string;
  sensitive: boolean;  // If true, hide by default
}
```

### 10.3 Example Registry Entries

```typescript
// Vercel
{
  slug: 'vercel',
  name: 'Vercel',
  category: 'hosting',
  logo: {
    light: '/logos/vercel-light.svg',
    dark: '/logos/vercel-dark.svg',
    icon: '/logos/vercel-icon.svg'
  },
  website: 'https://vercel.com',
  docs: 'https://vercel.com/docs',
  statusPage: 'https://www.vercel-status.com',
  plans: [
    { id: 'hobby', name: 'Hobby', monthlyCost: 0 },
    { id: 'pro', name: 'Pro', monthlyCost: 20 },
    { id: 'enterprise', name: 'Enterprise', monthlyCost: null }
  ],
  credentialSchema: {
    fields: [
      { key: 'project_url', label: 'Project URL', type: 'url', required: true, sensitive: false },
      { key: 'team_id', label: 'Team ID', type: 'text', required: false, sensitive: false },
      { key: 'api_token', label: 'API Token', type: 'password', required: false, sensitive: true }
    ]
  },
  defaultQuickLinks: [
    { label: 'Dashboard', url: 'https://vercel.com/dashboard' },
    { label: 'Deployments', url: '{project_url}' },
    { label: 'Analytics', url: '{project_url}/analytics' }
  ]
}

// Supabase
{
  slug: 'supabase',
  name: 'Supabase',
  category: 'database',
  logo: { ... },
  plans: [
    { id: 'free', name: 'Free', monthlyCost: 0 },
    { id: 'pro', name: 'Pro', monthlyCost: 25 },
    { id: 'team', name: 'Team', monthlyCost: 599 },
    { id: 'enterprise', name: 'Enterprise', monthlyCost: null }
  ],
  credentialSchema: {
    fields: [
      { key: 'project_url', label: 'Project URL', type: 'url', required: true, sensitive: false },
      { key: 'anon_key', label: 'Anon Key (Public)', type: 'password', required: true, sensitive: false },
      { key: 'service_role_key', label: 'Service Role Key', type: 'password', required: true, sensitive: true },
      { key: 'db_password', label: 'Database Password', type: 'password', required: false, sensitive: true },
      { key: 'db_connection_string', label: 'Connection String', type: 'textarea', required: false, sensitive: true }
    ]
  }
}

// Stripe
{
  slug: 'stripe',
  name: 'Stripe',
  category: 'payments',
  credentialSchema: {
    fields: [
      { key: 'publishable_key', label: 'Publishable Key', type: 'text', required: true, sensitive: false },
      { key: 'secret_key', label: 'Secret Key', type: 'password', required: true, sensitive: true },
      { key: 'webhook_secret', label: 'Webhook Secret', type: 'password', required: false, sensitive: true },
      { key: 'webhook_url', label: 'Webhook Endpoint URL', type: 'url', required: false, sensitive: false }
    ]
  }
}
```

### 10.4 Service Categories

```typescript
const serviceCategories = [
  { slug: 'hosting', name: 'Hosting & Infrastructure', icon: 'Cloud' },
  { slug: 'database', name: 'Database', icon: 'Database' },
  { slug: 'domain', name: 'Domain & DNS', icon: 'Globe' },
  { slug: 'auth', name: 'Authentication', icon: 'Shield' },
  { slug: 'payments', name: 'Payments', icon: 'CreditCard' },
  { slug: 'email', name: 'Email & Communications', icon: 'Mail' },
  { slug: 'analytics', name: 'Analytics & Monitoring', icon: 'BarChart' },
  { slug: 'storage', name: 'Storage & CDN', icon: 'HardDrive' },
  { slug: 'ai', name: 'AI & APIs', icon: 'Cpu' },
  { slug: 'devtools', name: 'Dev Tools', icon: 'Terminal' },
  { slug: 'marketing', name: 'Marketing & Support', icon: 'Megaphone' },
  { slug: 'appstores', name: 'App Stores', icon: 'Smartphone' },
  { slug: 'other', name: 'Other / Custom', icon: 'Box' }
];
```

### 10.5 Initial Service Registry

| Category | Services to Include |
|----------|-------------------|
| Hosting | Vercel, Netlify, Railway, Render, Fly.io, DigitalOcean, AWS, Heroku, Cloudflare Pages |
| Database | Supabase, PlanetScale, Neon, Firebase, MongoDB Atlas, Upstash, Turso |
| Domain | Namecheap, Cloudflare, GoDaddy, Google Domains, Porkbun |
| Auth | Clerk, Auth0, Supabase Auth, Firebase Auth, NextAuth |
| Payments | Stripe, Paddle, LemonSqueezy, Gumroad, RevenueCat |
| Email | Resend, Sendgrid, Postmark, Mailgun, Amazon SES |
| Analytics | Plausible, PostHog, Mixpanel, Amplitude, Google Analytics |
| Monitoring | Sentry, LogRocket, Datadog, New Relic |
| Storage | Cloudinary, Uploadthing, AWS S3, Cloudflare R2, Bunny CDN |
| AI | OpenAI, Anthropic, Replicate, Hugging Face |
| Dev Tools | GitHub, GitLab, Linear, Notion |
| App Stores | Apple Developer, Google Play Console, Chrome Web Store |

---

## 11. UI/UX Guidelines

### 11.1 Design Principles

1. **Clarity over cleverness**
   - Information should be immediately scannable
   - No hidden menus or buried features
   - Consistent patterns throughout

2. **Speed is a feature**
   - Instant feedback on all actions
   - Optimistic updates where safe
   - Keyboard shortcuts for power users

3. **Progressive disclosure**
   - Show essentials first
   - Reveal complexity as needed
   - Don't overwhelm new users

4. **Trust through transparency**
   - Always show what's encrypted
   - Clear indication of who has access
   - Audit everything

### 11.2 Visual Design

**Colors:**
- Primary: Neutral grays (professional, trustworthy)
- Accent: Blue for actions, amber for warnings, green for success, red for danger
- Dark mode: Full support

**Typography:**
- Clean sans-serif (Inter, Geist)
- Clear hierarchy: headings, body, captions
- Monospace for credentials and code

**Spacing:**
- Generous whitespace
- 4px base unit
- Consistent padding/margins

**Components:**
- Use shadcn/ui as base
- Custom components where needed
- Consistent border radius (8px for cards, 6px for inputs)

### 11.3 Micro-interactions

- **Copy to clipboard:** Brief "Copied!" feedback
- **Show/hide passwords:** Smooth toggle with icon change
- **Card hover:** Subtle lift and border change
- **Alerts:** Can be dismissed, snoozed, or actioned
- **Form submission:** Loading states, success/error feedback
- **Navigation:** Smooth sidebar transitions

### 11.4 Responsive Design

- **Desktop-first** (primary use case)
- **Tablet:** Sidebar collapsible, adjusted grids
- **Mobile:** Functional but simplified; may hide some features

### 11.5 Accessibility

- WCAG 2.1 AA compliance
- Keyboard navigable
- Screen reader friendly
- Sufficient color contrast
- Focus indicators

---

## 12. API Structure

### 12.1 API Design Principles

- RESTful conventions
- JSON request/response
- JWT authentication
- Consistent error format
- Rate limiting
- Pagination for lists

### 12.2 Core Endpoints

```
Authentication
POST   /api/auth/login
POST   /api/auth/register
POST   /api/auth/logout
POST   /api/auth/refresh
POST   /api/auth/forgot-password
POST   /api/auth/reset-password

Users
GET    /api/users/me
PATCH  /api/users/me
DELETE /api/users/me

Workspaces
GET    /api/workspaces
POST   /api/workspaces
GET    /api/workspaces/:id
PATCH  /api/workspaces/:id
DELETE /api/workspaces/:id

Workspace Members
GET    /api/workspaces/:id/members
POST   /api/workspaces/:id/members
PATCH  /api/workspaces/:id/members/:userId
DELETE /api/workspaces/:id/members/:userId

Projects
GET    /api/projects
POST   /api/projects
GET    /api/projects/:id
PATCH  /api/projects/:id
DELETE /api/projects/:id
GET    /api/projects/:id/stats

Project Members
GET    /api/projects/:id/members
POST   /api/projects/:id/members
PATCH  /api/projects/:id/members/:userId
DELETE /api/projects/:id/members/:userId

Services
GET    /api/projects/:id/services
POST   /api/projects/:id/services
GET    /api/projects/:id/services/:serviceId
PATCH  /api/projects/:id/services/:serviceId
DELETE /api/projects/:id/services/:serviceId

Credentials
GET    /api/projects/:id/services/:serviceId/credentials
POST   /api/projects/:id/services/:serviceId/credentials
PATCH  /api/projects/:id/services/:serviceId/credentials/:env
DELETE /api/projects/:id/services/:serviceId/credentials/:env

Assets
GET    /api/projects/:id/assets
POST   /api/projects/:id/assets
GET    /api/projects/:id/assets/:assetId
DELETE /api/projects/:id/assets/:assetId

Documents
GET    /api/projects/:id/docs
POST   /api/projects/:id/docs
GET    /api/projects/:id/docs/:docId
PATCH  /api/projects/:id/docs/:docId
DELETE /api/projects/:id/docs/:docId

Service Registry
GET    /api/registry/categories
GET    /api/registry/services
GET    /api/registry/services/:slug

Notifications
GET    /api/notifications
PATCH  /api/notifications/:id/read
PATCH  /api/notifications/:id/dismiss
PATCH  /api/notifications/:id/snooze

Dashboard
GET    /api/dashboard/stats
GET    /api/dashboard/alerts
GET    /api/dashboard/activity
```

### 12.3 Error Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      { "field": "name", "message": "Name is required" }
    ]
  }
}
```

### 12.4 Pagination Format

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

---

## 13. Security Requirements

### 13.1 Authentication

- **Method:** JWT tokens with refresh token rotation
- **Session:** Secure HTTP-only cookies
- **2FA:** TOTP-based (optional, encouraged for admins)
- **Password:** Bcrypt hashing, minimum strength requirements

### 13.2 Credential Encryption

- **Algorithm:** AES-256-GCM
- **Key Management:** Per-workspace encryption keys
- **Key Storage:** Environment variable or secrets manager
- **Decryption:** On-demand, never stored decrypted at rest

```typescript
// Encryption approach
const encryptCredentials = (data: object, key: string): string => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(data)), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString('base64');
};

const decryptCredentials = (encryptedData: string, key: string): object => {
  const buffer = Buffer.from(encryptedData, 'base64');
  const iv = buffer.slice(0, 16);
  const tag = buffer.slice(16, 32);
  const encrypted = buffer.slice(32);
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return JSON.parse(decrypted.toString());
};
```

### 13.3 Access Control

- **Row-level security** via Supabase policies or middleware
- **Workspace isolation:** Users can only access their workspaces
- **Project isolation:** Respect project-level permissions
- **Credential access logging:** Every view/copy logged

### 13.4 Audit Logging

All sensitive actions are logged:
- Credential views and copies
- Team member changes
- Project deletions
- Settings changes
- Login/logout events

### 13.5 Rate Limiting

- **API:** 100 requests/minute per user
- **Auth:** 10 attempts/minute per IP
- **Sensitive endpoints:** Stricter limits

### 13.6 Data Protection

- **HTTPS only**
- **HSTS headers**
- **CSP headers**
- **XSS protection**
- **CSRF tokens**

---

## 14. Technical Stack

### 14.1 Recommended Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Framework | Next.js 14+ (App Router) | SSR, API routes, modern patterns |
| Language | TypeScript | Type safety, better DX |
| Styling | Tailwind CSS | Utility-first, fast development |
| UI Components | shadcn/ui | High quality, customizable |
| Database | PostgreSQL (Supabase/Neon) | Robust, scalable, great tooling |
| ORM | Prisma or Drizzle | Type-safe queries |
| Authentication | NextAuth.js or Clerk | Flexible, well-maintained |
| File Storage | Cloudflare R2 or S3 | Cost-effective, scalable |
| Email | Resend | Developer-friendly, reliable |
| Hosting | Vercel | Seamless Next.js deployment |
| State Management | Zustand | Simple, powerful |
| Forms | React Hook Form + Zod | Validation, performance |
| Background Jobs | Trigger.dev or Inngest | Serverless-friendly |

### 14.2 Development Tools

- **Code Quality:** ESLint, Prettier
- **Testing:** Vitest, Playwright (E2E)
- **CI/CD:** GitHub Actions
- **Monitoring:** Sentry, Vercel Analytics

### 14.3 Boilerplate Transformation

Since we're transforming an existing Next.js boilerplate:

1. **Keep:** Auth setup, base UI components, project structure
2. **Adapt:** Database schema, API routes, page structure
3. **Add:** Service registry, encryption layer, notification system
4. **Replace:** As needed based on boilerplate choices

---

## 15. Future Roadmap

### Phase 1: MVP (Months 1-2)
- [ ] User authentication
- [ ] Workspace creation
- [ ] Project CRUD
- [ ] Service registry (top 20 services)
- [ ] Manual service/credential entry
- [ ] Basic renewal alerts (email)
- [ ] Dashboard overview

### Phase 2: Core Features (Months 3-4)
- [ ] Team invitations and roles
- [ ] Asset management
- [ ] Documentation/notes
- [ ] Notification preferences
- [ ] Cost tracking and aggregation
- [ ] Environment support (prod/staging/dev)

### Phase 3: Polish & Growth (Months 5-6)
- [ ] Service logo library (100+ services)
- [ ] Project templates
- [ ] Slack integration
- [ ] Data export
- [ ] Audit logs UI
- [ ] Mobile-responsive improvements

### Phase 4: Advanced Features (Months 7+)
- [ ] API integrations (auto-sync from Stripe, Vercel, etc.)
- [ ] Browser extension for quick capture
- [ ] AI-powered recommendations
- [ ] Cost optimization suggestions
- [ ] Public project profiles (for hiring/selling)
- [ ] Marketplace for templates

### Phase 5: Scale & Expand
- [ ] White-label for agencies
- [ ] Enterprise features (SSO, advanced audit)
- [ ] Community features (stack sharing)
- [ ] Partner program with service providers

---

## 16. Success Metrics

### 16.1 North Star Metric

**Monthly Active Projects (MAP):** Projects with at least one update or view in the last 30 days.

### 16.2 Key Performance Indicators

| Metric | Target (Month 6) | Target (Month 12) |
|--------|------------------|-------------------|
| Registered Users | 500 | 2,000 |
| Paying Customers | 100 | 400 |
| Monthly Recurring Revenue | $2,000 | $10,000 |
| Average Projects per User | 2.5 | 3 |
| Average Services per Project | 5 | 6 |
| Churn Rate (Monthly) | < 8% | < 5% |
| NPS Score | > 40 | > 50 |

### 16.3 Engagement Metrics

- **Weekly Active Users:** Should be > 60% of registered
- **Credential Copies per User:** Indicates daily utility
- **Alert Response Rate:** % of alerts actioned
- **Service Additions per Week:** Growth indicator

### 16.4 Quality Metrics

- **Uptime:** 99.9%
- **API Response Time:** < 200ms p95
- **Error Rate:** < 0.1%
- **Support Tickets per 100 Users:** < 5

---

## Appendix A: Glossary

| Term | Definition |
|------|------------|
| Project | A software product (app, website, API) that a user is building/maintaining |
| Service | An external tool/platform that powers part of a project (hosting, database, etc.) |
| Credential | Secret information needed to access a service (API key, password, etc.) |
| Workspace | A container for projects, typically representing a company or individual |
| Registry | The predefined catalog of known services and their metadata |
| Environment | A deployment context (production, staging, development) |

---

## Appendix B: Competitor Reference

| Tool | Focus | Pricing | Gap Nelrude Fills |
|------|-------|---------|-------------------|
| Notion | General docs | $10/user | No structure for credentials, no alerts |
| 1Password | Passwords | $8/user | No project context, no cost tracking |
| KIT.domains | Domains only | $15-39/mo | Only covers domains |
| Substly | SaaS spend | $105+/mo | Too expensive, enterprise-focused |
| Cledara | Cards + spend | $200+/mo | Overkill for indie hackers |

---

## Appendix C: Service Logo Sources

For service logos, use in priority order:

1. **Official brand resources** from each service
2. **SimpleIcons** (simpleicons.org) - SVG icons for brands
3. **Brandfetch API** - Programmatic logo fetching
4. **Custom SVGs** - Create minimal icons as fallback

Store logos locally in `/public/logos/` with consistent naming:
- `{service-slug}.svg` - Default
- `{service-slug}-dark.svg` - Dark mode variant
- `{service-slug}-icon.svg` - Small icon variant

---

## Appendix D: Sample User Flows

### Flow 1: First-Time User
1. Land on marketing site
2. Sign up with email
3. Create first workspace (auto-named)
4. Prompted to create first project
5. Go through project wizard
6. Arrive at project overview with added services
7. Explore dashboard

### Flow 2: Daily Check-In
1. Open Nelrude
2. See dashboard with alerts
3. Notice domain expiring
4. Click alert → go to service
5. Open registrar dashboard (quick link)
6. Renew domain
7. Update renewal date in Nelrude
8. Dismiss alert

### Flow 3: Onboard Contractor
1. Open project
2. Go to Team tab
3. Invite contractor by email
4. Set role (Member) and expiration (30 days)
5. Contractor receives invite
6. Contractor can now access project credentials
7. After 30 days, access auto-revokes

---

*End of PRD*

---

**Document Control**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Dec 2024 | [Founder] | Initial PRD |
