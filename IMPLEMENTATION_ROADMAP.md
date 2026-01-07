# Nerlude Implementation Roadmap

> **Last Updated:** December 2024  
> **Status:** Pre-Database Phase  
> **Current Progress:** ~60% Frontend Complete

This document tracks all remaining work, issues, inconsistencies, and improvements needed to complete Nerlude according to the PRD specifications.

---

## Progress Legend

- ⬜ **Not Started** - Work has not begun
- 🔄 **In Progress** - Currently being worked on
- ✅ **Completed** - Finished and tested
- ⚠️ **Blocked** - Waiting on dependency
- 🐛 **Bug** - Issue that needs fixing

---

## Phase 1: Architecture & Foundation Cleanup

**Priority:** 🔴 Critical  
**Estimated Time:** 1-2 days  
**Dependencies:** None

### 1.1 Folder Structure Reorganization

| Task | Status | Description |
|------|--------|-------------|
| Consolidate `/store` and `/stores` folders | ✅ | Two duplicate state management folders exist - merge into single `/stores` |
| Create `/lib` folder structure | ✅ | Add `/lib/db`, `/lib/auth`, `/lib/encryption`, `/lib/utils`, `/lib/api` |
| Move service registry to `/registry` | ✅ | Move from `/data/serviceRegistry.ts` to `/registry/services/` with proper structure |
| Create `/registry/icons` folder | ⬜ | Organize service logos/icons (deferred - no icons yet) |
| Add `/app/api` folder structure | ✅ | Create placeholder API route folders |
| Remove empty component folders | ✅ | `/components/FloatingSidebar`, `/templates/ProjectPage/ProjectHeader`, `/templates/ProjectPage/TabNavigation` are empty |

### 1.2 Environment & Configuration

| Task | Status | Description |
|------|--------|-------------|
| Create `.env.example` file | ✅ | Document all required environment variables |
| Add environment validation | ⬜ | Validate required env vars on startup |
| Create `/config` folder | ✅ | Centralize app configuration constants |
| Add site metadata config | ✅ | SEO, OG images, site name in one place |

### 1.3 TypeScript Types Alignment

| Task | Status | Description |
|------|--------|-------------|
| Add `workspaceId` to Project type | ✅ | Missing from current type definition |
| Add `createdBy` to Project type | ✅ | Missing from current type definition |
| Add Workspace member types | ✅ | `WorkspaceMember`, `ProjectMember` types |
| Add Credential types | ✅ | `ServiceCredential`, `CredentialField` types |
| Add Notification preferences type | ✅ | User notification settings |
| Add Audit log types | ✅ | `AuditLog`, `AuditAction` types |
| Align types with PRD database schema | ✅ | Ensure 1:1 mapping with SQL schema |

---

## Phase 2: UI/UX Consistency & Polish

**Priority:** 🟡 High  
**Estimated Time:** 2-3 days  
**Dependencies:** None

### 2.1 Icon System Standardization

| Task | Status | Description |
|------|--------|-------------|
| Audit all Icon component usage | ⬜ | Find all places using custom `Icon` component |
| Migrate to iconsax-react | ⬜ | Replace custom icons with iconsax where appropriate |
| Create icon mapping utility | ⬜ | Helper to get consistent icons by name |
| Document available icons | ⬜ | Create icon reference in component docs |

### 2.2 Component Consistency

| Task | Status | Description |
|------|--------|-------------|
| Create Loading Skeleton component | ✅ | Reusable skeleton for loading states |
| Create Empty State component | ✅ | Consistent pattern for empty lists/sections |
| Create Error Boundary component | ✅ | Catch and display errors gracefully |
| Create Toast/Notification component | ✅ | For success/error feedback |
| Standardize Button usage | ⬜ | Audit `isPrimary`, `isSecondary`, `isStroke` usage |
| Create Confirm Dialog component | ✅ | Reusable confirmation modal |
| Create Dropdown Menu component | ✅ | Consistent dropdown pattern |

### 2.3 Page-Specific UI Fixes

| Task | Status | Description |
|------|--------|-------------|
| Dashboard: Add loading states | ✅ | Show skeletons while data loads |
| Dashboard: Fix hardcoded "Welcome, Steven" | ✅ | Should use actual user name |
| Project Overview: Add loading states | ✅ | Show skeletons while data loads |
| Assets Tab: Design proper empty state | ⬜ | Currently has placeholder content |
| Docs Tab: Design proper empty state | ⬜ | Currently has placeholder content |
| Team Tab: Design proper empty state | ⬜ | Currently has placeholder content |
| Settings: Add form validation feedback | ⬜ | Show errors inline |

### 2.4 Responsive Design Improvements

| Task | Status | Description |
|------|--------|-------------|
| Test all pages on mobile | ⬜ | Verify breakpoints work correctly |
| Fix sidebar behavior on mobile | ⬜ | Should be hidden/drawer on mobile |
| Optimize project cards for mobile | ⬜ | May need different layout |
| Test document upload on mobile | ⬜ | Ensure drag/drop works or has fallback |

---

## Phase 3: Authentication & User Management

**Priority:** 🔴 Critical  
**Estimated Time:** 3-5 days  
**Dependencies:** Supabase project setup

### 3.1 Auth UI (Already Exists)

| Task | Status | Description |
|------|--------|-------------|
| Login modal (`/components/Login/SignIn`) | ✅ | Already exists - modal-based login |
| Register modal (`/components/Login/CreateAccount`) | ✅ | Already exists - modal-based registration |
| Reset password modal (`/components/Login/ResetPassword`) | ✅ | Already exists - modal-based reset |
| Create `/app/(auth)/verify-email/page.tsx` | ⬜ | Email verification page (if needed) |

### 3.2 Auth Integration

| Task | Status | Description |
|------|--------|-------------|
| Set up Supabase Auth | ⬜ | Configure auth provider |
| Create auth context/provider | ⬜ | React context for auth state |
| Create `useAuth` hook | ⬜ | Hook for auth operations |
| Add protected route middleware | ⬜ | Redirect unauthenticated users |
| Implement session management | ⬜ | JWT tokens, refresh logic |
| Add logout functionality | ⬜ | Clear session, redirect |
| Implement "Remember me" | ⬜ | Persistent sessions |

### 3.3 User Profile

| Task | Status | Description |
|------|--------|-------------|
| Connect settings/account to real data | ⬜ | Currently static |
| Implement profile update | ⬜ | Name, avatar changes |
| Implement password change | ⬜ | Current + new password flow |
| Add avatar upload | ⬜ | Profile picture storage |
| Implement account deletion | ⬜ | With confirmation |

---

## Phase 4: Database & API Layer

**Priority:** 🔴 Critical  
**Estimated Time:** 5-7 days  
**Dependencies:** Phase 3 (Auth)

### 4.1 Database Setup

| Task | Status | Description |
|------|--------|-------------|
| Create Supabase project | ⬜ | Set up new project |
| Run database migrations | ⬜ | Create all tables from PRD schema |
| Set up Row Level Security (RLS) | ⬜ | Workspace/project isolation |
| Create database indexes | ⬜ | Performance optimization |
| Seed service registry data | ⬜ | Populate service_registry table |
| Seed service categories | ⬜ | Populate service_categories table |

### 4.2 Database Client

| Task | Status | Description |
|------|--------|-------------|
| Create Supabase client (`/lib/db/supabase.ts`) | ⬜ | Server and client instances |
| Create database types from schema | ⬜ | Generate TypeScript types |
| Create query helpers | ⬜ | Common query patterns |
| Set up React Query | ⬜ | Data fetching/caching layer |

### 4.3 API Routes - Projects

| Task | Status | Description |
|------|--------|-------------|
| `GET /api/projects` | ⬜ | List user's projects |
| `POST /api/projects` | ⬜ | Create new project |
| `GET /api/projects/[id]` | ⬜ | Get single project |
| `PATCH /api/projects/[id]` | ⬜ | Update project |
| `DELETE /api/projects/[id]` | ⬜ | Delete project |
| `GET /api/projects/[id]/stats` | ⬜ | Project statistics |

### 4.4 API Routes - Services

| Task | Status | Description |
|------|--------|-------------|
| `GET /api/projects/[id]/services` | ⬜ | List project services |
| `POST /api/projects/[id]/services` | ⬜ | Add service to project |
| `GET /api/projects/[id]/services/[serviceId]` | ⬜ | Get single service |
| `PATCH /api/projects/[id]/services/[serviceId]` | ⬜ | Update service |
| `DELETE /api/projects/[id]/services/[serviceId]` | ⬜ | Remove service |

### 4.5 API Routes - Credentials

| Task | Status | Description |
|------|--------|-------------|
| Create encryption utilities | ⬜ | AES-256-GCM encrypt/decrypt |
| `GET /api/projects/[id]/services/[serviceId]/credentials` | ⬜ | Get credentials (decrypted) |
| `POST /api/projects/[id]/services/[serviceId]/credentials` | ⬜ | Save credentials (encrypted) |
| `PATCH /api/projects/[id]/services/[serviceId]/credentials/[env]` | ⬜ | Update credentials |
| `DELETE /api/projects/[id]/services/[serviceId]/credentials/[env]` | ⬜ | Delete credentials |

### 4.6 API Routes - Other

| Task | Status | Description |
|------|--------|-------------|
| `GET /api/dashboard/stats` | ⬜ | Dashboard statistics |
| `GET /api/dashboard/alerts` | ⬜ | Active alerts |
| `GET /api/registry/categories` | ⬜ | Service categories |
| `GET /api/registry/services` | ⬜ | Service registry |
| `GET /api/notifications` | ⬜ | User notifications |
| `PATCH /api/notifications/[id]/read` | ⬜ | Mark as read |

### 4.7 Replace Mock Data

| Task | Status | Description |
|------|--------|-------------|
| Dashboard: Replace `mockProjects` | ⬜ | Fetch from API |
| Dashboard: Replace `mockAlerts` | ⬜ | Fetch from API |
| Dashboard: Replace `mockStats` | ⬜ | Fetch from API |
| Project Page: Replace mock data | ⬜ | Fetch from API |
| Add Service: Use real registry | ⬜ | Fetch from database |

---

## Phase 5: Core Features Completion

**Priority:** 🟡 High  
**Estimated Time:** 5-7 days  
**Dependencies:** Phase 4 (Database)

### 5.1 Service Detail View

| Task | Status | Description |
|------|--------|-------------|
| Create `/app/projects/[id]/services/[serviceId]/page.tsx` | ⬜ | Service detail route |
| Build service header component | ⬜ | Logo, name, status, quick links |
| Build stats row component | ⬜ | Cost, billing cycle, renewal |
| Build credentials section | ⬜ | Environment selector, show/hide, copy |
| Build configuration section | ⬜ | Plan, region, limits |
| Build notes section | ⬜ | Service-specific notes |
| Build activity log section | ⬜ | Recent changes |
| Add edit/delete actions | ⬜ | Service management |

### 5.2 Assets Management

| Task | Status | Description |
|------|--------|-------------|
| Set up Supabase Storage | ⬜ | Or Cloudflare R2 |
| Create file upload component | ⬜ | Drag/drop, progress |
| Create asset grid view | ⬜ | Thumbnails, metadata |
| Implement asset categorization | ⬜ | Logos, screenshots, documents |
| Add download functionality | ⬜ | Direct download links |
| Add delete functionality | ⬜ | With confirmation |
| Create `/app/projects/[id]/assets/page.tsx` | ⬜ | Dedicated route |

### 5.3 Documentation/Notes

| Task | Status | Description |
|------|--------|-------------|
| Choose rich text editor | ⬜ | Tiptap, Lexical, or similar |
| Implement markdown support | ⬜ | Parse and render markdown |
| Create document CRUD | ⬜ | Create, edit, delete docs |
| Add auto-save functionality | ⬜ | Save on change with debounce |
| Create document types | ⬜ | Architecture, getting started, notes |
| Create `/app/projects/[id]/docs/page.tsx` | ⬜ | Dedicated route |

### 5.4 Team Management

| Task | Status | Description |
|------|--------|-------------|
| Create invite member flow | ⬜ | Email invitation |
| Implement role assignment | ⬜ | Owner, Admin, Member, Viewer |
| Add access expiration | ⬜ | For contractors |
| Implement member removal | ⬜ | With confirmation |
| Create team member list UI | ⬜ | Avatars, roles, actions |
| Create `/app/projects/[id]/team/page.tsx` | ⬜ | Dedicated route |
| Send invitation emails | ⬜ | Via Resend |

### 5.5 Workspace Management

| Task | Status | Description |
|------|--------|-------------|
| Create workspace on signup | ⬜ | Auto-create default workspace |
| Implement workspace settings | ⬜ | Name, currency, etc. |
| Add workspace member management | ⬜ | Invite to workspace |
| Implement workspace switching | ⬜ | If user has multiple |

---

## Phase 6: Notifications & Alerts System

**Priority:** 🟡 High  
**Estimated Time:** 3-4 days  
**Dependencies:** Phase 4 (Database)

### 6.1 Notification Infrastructure

| Task | Status | Description |
|------|--------|-------------|
| Create notifications table queries | ⬜ | CRUD operations |
| Build notification center UI | ⬜ | Dropdown in header |
| Implement mark as read | ⬜ | Single and bulk |
| Implement dismiss | ⬜ | Remove from list |
| Implement snooze | ⬜ | Delay notification |
| Add notification preferences | ⬜ | Per-type toggles |

### 6.2 Renewal Alert Engine

| Task | Status | Description |
|------|--------|-------------|
| Set up background job system | ⬜ | Trigger.dev, Inngest, or cron |
| Create renewal checker job | ⬜ | Check dates daily |
| Generate renewal alerts | ⬜ | 30, 14, 7, 3, 1 days before |
| Create alert templates | ⬜ | Domain, SSL, subscription |

### 6.3 Email Notifications

| Task | Status | Description |
|------|--------|-------------|
| Set up Resend | ⬜ | Email provider |
| Create email templates | ⬜ | Renewal, team, system |
| Implement email sending | ⬜ | On alert creation |
| Add email preferences | ⬜ | Immediate, digest, off |
| Create unsubscribe flow | ⬜ | One-click unsubscribe |

### 6.4 Cost Alerts

| Task | Status | Description |
|------|--------|-------------|
| Implement cost aggregation | ⬜ | Per project, total |
| Create cost threshold settings | ⬜ | User-defined limits |
| Generate cost alerts | ⬜ | When threshold exceeded |
| Track cost changes | ⬜ | Month-over-month comparison |

---

## Phase 7: Security & Audit

**Priority:** 🟡 High  
**Estimated Time:** 2-3 days  
**Dependencies:** Phase 4 (Database)

### 7.1 Credential Security

| Task | Status | Description |
|------|--------|-------------|
| Implement AES-256-GCM encryption | ⬜ | For credential storage |
| Create encryption key management | ⬜ | Per-workspace keys |
| Add credential access logging | ⬜ | Track views and copies |
| Implement credential rotation reminders | ⬜ | Optional feature |

### 7.2 Audit Logging

| Task | Status | Description |
|------|--------|-------------|
| Create audit log table queries | ⬜ | Insert on actions |
| Log credential access | ⬜ | View, copy events |
| Log team changes | ⬜ | Add, remove, role change |
| Log project changes | ⬜ | Create, update, delete |
| Create audit log viewer UI | ⬜ | In workspace settings |

### 7.3 Security Headers & Protection

| Task | Status | Description |
|------|--------|-------------|
| Add security headers | ⬜ | CSP, HSTS, X-Frame-Options |
| Implement rate limiting | ⬜ | API and auth endpoints |
| Add CSRF protection | ⬜ | For form submissions |
| Implement input sanitization | ⬜ | Prevent XSS |

---

## Phase 8: Polish & Production Readiness

**Priority:** 🟠 Medium  
**Estimated Time:** 3-5 days  
**Dependencies:** Phases 1-7

### 8.1 Performance Optimization

| Task | Status | Description |
|------|--------|-------------|
| Implement data caching | ⬜ | React Query cache strategies |
| Add optimistic updates | ⬜ | Instant UI feedback |
| Optimize images | ⬜ | Next.js Image component |
| Add lazy loading | ⬜ | For heavy components |
| Analyze bundle size | ⬜ | Remove unused code |

### 8.2 Error Handling

| Task | Status | Description |
|------|--------|-------------|
| Create global error boundary | ⬜ | Catch React errors |
| Add API error handling | ⬜ | Consistent error format |
| Create error pages | ⬜ | 404, 500, etc. |
| Add error reporting | ⬜ | Sentry integration |
| Create user-friendly error messages | ⬜ | No technical jargon |

### 8.3 Testing

| Task | Status | Description |
|------|--------|-------------|
| Set up testing framework | ⬜ | Vitest or Jest |
| Write unit tests for utilities | ⬜ | Encryption, helpers |
| Write component tests | ⬜ | Key UI components |
| Set up E2E testing | ⬜ | Playwright |
| Write critical path tests | ⬜ | Auth, project CRUD |

### 8.4 Documentation

| Task | Status | Description |
|------|--------|-------------|
| Create README.md | ⬜ | Project setup guide |
| Document environment variables | ⬜ | All required vars |
| Create component documentation | ⬜ | Props, usage examples |
| Write API documentation | ⬜ | Endpoint reference |
| Create deployment guide | ⬜ | Vercel, Supabase setup |

### 8.5 Deployment

| Task | Status | Description |
|------|--------|-------------|
| Set up production Supabase | ⬜ | Separate from dev |
| Configure Vercel project | ⬜ | Environment variables |
| Set up domain | ⬜ | nerlude.com or nelrude.com |
| Configure SSL | ⬜ | HTTPS everywhere |
| Set up monitoring | ⬜ | Uptime, performance |
| Create backup strategy | ⬜ | Database backups |

---

## Known Issues & Bugs

| ID | Severity | Description | Status |
|----|----------|-------------|--------|
| BUG-001 | 🟡 Medium | Dashboard shows hardcoded "Welcome, Steven" | ✅ |
| BUG-002 | 🟢 Low | Duplicate store folders (`/store` and `/stores`) | ✅ |
| BUG-003 | 🟢 Low | Empty component folders exist | ✅ |
| BUG-004 | 🟡 Medium | No loading states on data-dependent pages | ⬜ |
| BUG-005 | 🟡 Medium | Mixed icon systems (custom Icon + iconsax) | ⬜ |

---

## Technical Debt

| ID | Priority | Description | Status |
|----|----------|-------------|--------|
| DEBT-001 | 🟡 High | Mock data should be removed after API integration | ⬜ |
| DEBT-002 | 🟠 Medium | Service registry should be in database, not file | ⬜ |
| DEBT-003 | 🟠 Medium | Need consistent error handling pattern | ⬜ |
| DEBT-004 | 🟢 Low | Some components could be more reusable | ⬜ |
| DEBT-005 | 🟠 Medium | No form validation library (should add Zod) | ⬜ |

---

## Future Enhancements (Post-MVP)

These are from the PRD roadmap but not required for initial launch:

| Feature | PRD Phase | Description |
|---------|-----------|-------------|
| Slack integration | Phase 3 | Notifications via Slack |
| Browser extension | Phase 4 | Quick capture from any page |
| AI recommendations | Phase 4 | Suggest services, optimizations |
| API integrations | Phase 4 | Auto-sync from Stripe, Vercel, etc. |
| Public project profiles | Phase 4 | For hiring/selling |
| White-label | Phase 5 | For agencies |
| SSO/SAML | Phase 5 | Enterprise auth |

---

## Changelog

| Date | Changes |
|------|---------|
| Dec 2024 | Initial roadmap created based on PRD review |

---

*This document should be updated as tasks are completed. Mark items with ✅ when done.*
