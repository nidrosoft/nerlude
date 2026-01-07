# Nerlude Improvement Roadmap

This document organizes all suggested improvements into three phases based on complexity and effort required.

---

## ✅ Already Completed
- [x] Toast notifications for user actions
- [x] Breadcrumb navigation on project pages
- [x] Search functionality in Add Service page
- [x] Skip button in onboarding flow
- [x] Fixed sidebar shaking on hover (Settings & Project pages)
- [x] Sticky headers on settings pages
- [x] Updated gear icon in settings sidebar

---

## Phase 1: Easy (1-2 hours each)

Quick wins that improve UX with minimal code changes.

### 1.1 Empty State for Dashboard
**Description:** When no projects exist, show a more engaging empty state with illustration and clear CTA instead of an empty grid.
**Files:** `templates/DashboardPage/ProjectsGrid/index.tsx`
**Effort:** ~30 min

### 1.2 Dark Mode Toggle
**Description:** Add a dark mode toggle in the header or settings. The theme system already exists in the UI store.
**Files:** `components/Header/index.tsx`, `stores/uiStore.ts`
**Effort:** ~1 hour

### ~~1.3 Danger Zone Confirmation~~ ✅
**Description:** Require typing "DELETE" to confirm account/workspace deletion for extra safety.
**Files:** `templates/SettingsPage/AccountSettings/index.tsx`, `templates/SettingsPage/WorkspaceSettings/index.tsx`
**Status:** Completed

### ~~1.4 Show/Hide Toggle for Credentials~~ ✅
**Description:** Add visibility toggle and copy button for API key fields in Add Service.
**Files:** `templates/AddServicePage/index.tsx`
**Status:** Completed

### ~~1.5 Recently Used Services~~ ✅
**Description:** Show services the user has added to other projects at the top of Add Service page.
**Files:** `templates/AddServicePage/index.tsx`, `stores/projectStore.ts`
**Status:** Completed

### ~~1.6 Onboarding Progress Persistence~~ ✅
**Description:** Save onboarding progress to localStorage so users don't lose progress on refresh.
**Files:** `templates/OnboardingPage/Form/index.tsx`
**Status:** Completed

### ~~1.7 Quick Actions Menu on Project Header~~ ✅
**Description:** Add a "..." menu on project cards/headers for quick actions (archive, duplicate, export).
**Files:** `templates/ProjectPage/Overview/index.tsx`, `templates/DashboardPage/ProjectsGrid/index.tsx`
**Status:** Completed

---

## Phase 2: Medium (2-4 hours each) ✅ COMPLETED

Features that require more planning and multiple component changes.

### ~~2.1 Command Palette (Cmd+K)~~ ✅
**Description:** Global search/command palette for quick navigation to projects, services, and actions.
**Files:** `components/CommandPalette/index.tsx`, `app/providers.tsx`, `stores/uiStore.ts`
**Status:** Completed

### ~~2.2 Activity Feed on Dashboard~~ ✅
**Description:** Add a recent activity timeline showing project changes, service additions, etc.
**Files:** `templates/DashboardPage/ActivityFeed/index.tsx`, `data/mockActivity.ts`
**Status:** Completed

### ~~2.3 Project Duplication~~ ✅
**Description:** Allow duplicating an existing project as a template with all its services.
**Files:** `templates/DashboardPage/ProjectCard/index.tsx`
**Status:** Completed

### ~~2.4 Bulk Service Add~~ ✅
**Description:** Allow selecting multiple services at once instead of adding one at a time.
**Files:** `templates/AddServicePage/index.tsx`
**Status:** Completed

### ~~2.5 Mobile Bottom Navigation~~ ✅
**Description:** Add bottom navigation bar for logged-in users on mobile devices.
**Files:** `components/MobileNav/index.tsx`, `components/Layout/index.tsx`
**Status:** Completed

### ~~2.6 Unsaved Changes Warning~~ ✅
**Description:** Show warning when navigating away from forms with unsaved changes.
**Files:** `hooks/useUnsavedChanges.ts`, `components/UnsavedChangesModal/index.tsx`
**Status:** Completed

### ~~2.7 Template Preview in New Project~~ ✅
**Description:** Show preview of what services each template includes before selecting.
**Files:** `templates/NewProjectPage/index.tsx`
**Status:** Completed

### ~~2.8 Keyboard Shortcuts~~ ✅
**Description:** Add keyboard shortcuts (Cmd+N for new project, Cmd+S for save, etc.).
**Files:** `hooks/useKeyboardShortcuts.ts`, `components/KeyboardShortcutsProvider/index.tsx`
**Status:** Completed

### ~~2.9 Billing History with Mock Data~~ ✅
**Description:** Add mock billing history data to the Plan settings page for demo purposes.
**Files:** `templates/SettingsPage/ManagePlan/index.tsx`, `data/mockBilling.ts`
**Status:** Completed

### ~~2.10 Custom Project Icon Upload~~ ✅
**Description:** Allow custom image upload for project icons, not just emoji selection.
**Files:** `templates/NewProjectPage/index.tsx`, `components/ImageUpload/index.tsx`
**Status:** Completed

---

## Phase 3: Complex (4+ hours each)

Major features requiring significant architecture or new pages.

### 3.1 Service Detail Page
**Description:** Click on a service to see full details, credentials, usage stats, and management options.
**Files:** New `app/projects/[id]/services/[serviceId]/page.tsx`, new `templates/ServiceDetailPage/`
**Effort:** ~6 hours

### 3.2 Visual Dependency Graph for Stacks
**Description:** Show visual dependency graph between services in the Stacks tab.
**Files:** `templates/ProjectPage/Stacks/index.tsx`, new visualization library integration
**Effort:** ~8 hours

### 3.3 Integrations Page
**Description:** Connect external tools (Slack, GitHub, etc.) for notifications and automation.
**Files:** New `app/settings/integrations/page.tsx`, new `templates/SettingsPage/Integrations/`
**Effort:** ~6 hours

### 3.4 Audit Log
**Description:** Track who made what changes and when across the workspace.
**Files:** New `app/settings/audit/page.tsx`, new `templates/SettingsPage/AuditLog/`, `types/index.ts`
**Effort:** ~6 hours

### 3.5 In-App Help Center
**Description:** Add help center with documentation, FAQs, and support chat widget.
**Files:** New `components/HelpWidget/index.tsx`, new `app/help/page.tsx`
**Effort:** ~8 hours

### 3.6 Welcome Tour
**Description:** Optional guided tour of the dashboard after onboarding for first-time users.
**Files:** New `components/WelcomeTour/index.tsx`, integration with a tour library
**Effort:** ~4 hours

### 3.7 Workspace Creation Flow
**Description:** After onboarding, prompt user to name their first workspace before dashboard.
**Files:** New step in onboarding or new `app/workspace/new/page.tsx`
**Effort:** ~4 hours

### 3.8 API Keys / Personal Tokens
**Description:** Add personal API tokens section in settings for integrations.
**Files:** New section in `templates/SettingsPage/AccountSettings/index.tsx` or new page
**Effort:** ~4 hours

### 3.9 Data Export Functionality
**Description:** Implement actual data export with format selection (JSON, CSV).
**Files:** `templates/SettingsPage/WorkspaceSettings/index.tsx`, new export utilities
**Effort:** ~4 hours

### 3.10 Confetti Animation on First Project
**Description:** Add celebratory confetti animation when user creates their first project.
**Files:** `templates/NewProjectPage/index.tsx`, new `components/Confetti/index.tsx`
**Effort:** ~2 hours (but fun!)

---

## Summary

| Phase | Items | Estimated Total Time |
|-------|-------|---------------------|
| Phase 1 (Easy) | 7 items | ~6 hours |
| Phase 2 (Medium) | 10 items | ~22 hours |
| Phase 3 (Complex) | 10 items | ~52 hours |

---

## Recommended Priority Order

### Start with Phase 1 (Quick Wins):
1. Empty State for Dashboard
2. Dark Mode Toggle
3. Danger Zone Confirmation
4. Show/Hide Toggle for Credentials

### Then Phase 2 (High Impact):
1. Command Palette (Cmd+K)
2. Keyboard Shortcuts
3. Unsaved Changes Warning
4. Activity Feed

### Finally Phase 3 (Major Features):
1. Service Detail Page
2. Welcome Tour
3. Visual Dependency Graph
4. Integrations Page

---

*Last updated: January 6, 2026*
