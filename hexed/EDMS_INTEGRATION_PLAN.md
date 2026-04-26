# EDMS Integration Plan

## Overview
Integrate the EDMS folder (`edms/`) into the current Quadra project by converting components, moving pages, and updating dependencies.

## Phase 1: Component Migration (Priority: High)

### 1.1 Convert @midday/ui to shadcn-ui
- Replace all `@midday/ui` imports with `@/components/ui`
- Update component props to match shadcn-ui API
- Components to convert:
  - Badge → shadcn/ui/badge
  - Button → shadcn/ui/button
  - Popover → shadcn/ui/popover
  - ScrollArea → shadcn/ui/scroll-area
  - Input → shadcn/ui/input
  - Label → shadcn/ui/label
  - Select → shadcn/ui/select
  - Sheet → shadcn/ui/sheet
  - Dialog → shadcn/ui/dialog
  - Form components → shadcn/ui/form
  - Checkbox → shadcn/ui/checkbox
  - Switch → shadcn/ui/switch
  - Textarea → shadcn/ui/textarea
  - Card → shadcn/ui/card
  - Avatar → shadcn/ui/avatar
  - DropdownMenu → shadcn/ui/dropdown-menu
  - Separator → shadcn/ui/separator
  - Tabs → shadcn/ui/tabs
  - Alert → shadcn/ui/alert
  - Command → shadcn/ui/command

### 1.2 Move EDMS Components
Move from `edms/components/` to `components/`:
- `edms/components/edms/` → `components/edms/`
- `edms/components/ui/` → `components/ui/` (if any)
- `edms/components/` (tables) → `components/`

## Phase 2: Page Migration (Priority: High)

### 2.1 Move Pages to App Directory
Move from `edms/*.tsx` to `app/`:
- `edms/audit-page.tsx` → `app/audit/page.tsx`
- `edms/bulk-upload-page.tsx` → `app/bulk-upload/page.tsx`
- `edms/change-orders-page.tsx` → `app/change-orders/page.tsx`
- `edms/commissioning-page.tsx` → `app/commissioning/page.tsx`
- `edms/daily-reports-page.tsx` → `app/daily-reports/page.tsx`
- `edms/databook-page.tsx` → `app/databook/page.tsx`
- `edms/documents-id-page.tsx` → `app/documents/[id]/page.tsx`
- `edms/documents-new-page.tsx` → `app/documents/new/page.tsx`
- `edms/documents-page.tsx` → `app/documents/page.tsx`
- `edms/extension-of-time-page.tsx` → `app/extension-of-time/page.tsx`
- `edms/inspections-page.tsx` → `app/inspections/page.tsx`
- `edms/letters-new-page.tsx` → `app/letters/new/page.tsx`
- `edms/letters-page.tsx` → `app/letters/page.tsx`
- `edms/letters-page-client.tsx` → `app/letters/page-client.tsx`
- `edms/matrix-page.tsx` → `app/matrix/page.tsx`
- `edms/meetings-new-page.tsx` → `app/meetings/new/page.tsx`
- `edms/meetings-page.tsx` → `app/meetings/page.tsx`
- `edms/notifications-page.tsx` → `app/notifications/page.tsx`
- `edms/projects-id-page.tsx` → `app/projects/[id]/page.tsx`
- `edms/projects-page.tsx` → `app/projects/page.tsx`
- `edms/reports-page.tsx` → `app/reports/page.tsx`
- `edms/safety-observations-page.tsx` → `app/safety-observations/page.tsx`
- `edms/schedule-page.tsx` → `app/schedule/page.tsx`
- `edms/submittals-page.tsx` → `app/submittals/page.tsx`
- `edms/technical-queries-page.tsx` → `app/technical-queries/page.tsx`
- `edms/transmittals-id-page.tsx` → `app/transmittals/[id]/page.tsx`
- `edms/transmittals-new-page.tsx` → `app/transmittals/new/page.tsx`
- `edms/transmittals-page.tsx` → `app/transmittals/page.tsx`
- `edms/warranty-page.tsx` → `app/warranty/page.tsx`
- `edms/workflows-id-page.tsx` → `app/workflows/[id]/page.tsx`
- `edms/workflows-page.tsx` → `app/workflows/page.tsx`

### 2.2 Move Settings Pages
Move from `edms/settings-*.tsx` to `app/settings/`:
- `edms/settings-accounts-page.tsx` → `app/settings/accounts/page.tsx`
- `edms/settings-developer-page.tsx` → `app/settings/developer/page.tsx`
- `edms/settings-members-page.tsx` → `app/settings/members/page.tsx`
- `edms/settings-notifications-page.tsx` → `app/settings/notifications/page.tsx`
- `edms/settings-page.tsx` → `app/settings/page.tsx`

### 2.3 Move Config Pages
Move from `edms/config-*.tsx` to `app/config/`:
- `edms/config-disciplines.tsx` → `app/config/disciplines/page.tsx`
- `edms/config-doc-types.tsx` → `app/config/doc-types/page.tsx`
- `edms/config-general.tsx` → `app/config/general/page.tsx`
- `edms/config-numbering.tsx` → `app/config/numbering/page.tsx`
- `edms/config-page.tsx` → `app/config/page.tsx`
- `edms/config-stakeholders.tsx` → `app/config/stakeholders/page.tsx`
- `edms/config-workflow.tsx` → `app/config/workflow/page.tsx`

## Phase 3: Theme Editor Integration (Priority: Medium)

### 3.1 Integrate with Existing Theme Settings
- The current project has `app/settings/theme/page.tsx` with theme editor
- The edms theme-editor uses @midday/ui theme system
- Options:
  1. Replace edms theme-editor with existing shadcn-ui theme editor
  2. Port edms theme-editor to use shadcn-ui components
  3. Keep existing theme editor and ignore edms theme-editor

**Recommended**: Use existing theme editor in `components/theme-editor/` and delete edms theme-editor

### 3.2 Clean Up Theme Editor Files
Delete or move:
- `edms/theme-editor/` folder (if not needed)
- `edms/theme-page.tsx` (use existing theme settings)

## Phase 4: Data Table Integration (Priority: High)

### 4.1 Replace Old Data Tables
EDMS uses custom tables that need to be converted to the project's data-table:
- Already converted: `commissioning-table.tsx`, `daily-reports-table.tsx`, `databook-table.tsx`, `disciplines-table.tsx`, `doc-types-table.tsx`
- Still in edms: `edms/components/change-orders-table.tsx`, `edms/components/documents-table.tsx`, `edms/components/inspections-table.tsx`, etc.

### 4.2 Convert Remaining Tables
Convert tables in `edms/components/` to use:
- `@/components/data-table/data-table` (the project's data-table)
- `@/components/data-table/data-table-column-header`
- Or simple HTML tables if data-table is too complex

## Phase 5: Server Actions & Database (Priority: High)

### 5.1 Create Missing Server Actions
Create server actions in `actions/`:
- `actions/notifications.ts` (for notification read/unread)
- `actions/documents.ts` (for document CRUD)
- `actions/projects.ts` (for project CRUD)
- `actions/transmittals.ts` (for transmittal CRUD)
- `actions/workflows.ts` (already exists, expand as needed)
- `actions/admin-users.ts` (already exists)

### 5.2 Database Schema
- The edms folder has `edms/turso/` with database schema
- Integrate with existing `lib/schema.ts` and `lib/db.ts`
- Update schema to include EDMS tables

## Phase 6: Sidebar & Navigation (Priority: Medium)

### 6.1 Update Sidebar
Add EDMS routes to sidebar navigation:
- Documents
- Transmittals
- Submittals
- Workflows
- Projects
- Meetings
- Letters
- Technical Queries
- Change Orders
- Inspections
- Safety Observations
- Daily Reports
- Databook
- Schedule
- Warranty
- Extension of Time
- Matrix
- Reports
- Config
- Audit
- Bulk Upload

### 6.2 Sidebar Layout
Use existing `edms/sidebar-layout.tsx` or integrate with current sidebar

## Phase 7: Imports & Dependencies (Priority: High)

### 7.1 Update Import Paths
After moving files, update all imports:
- `@/components/edms/...` → keep as is
- `@/lib/edms/...` → keep as is
- Remove `@midday/ui` imports
- Add missing shadcn-ui components if needed

### 7.2 Create Missing Utilities
Create missing lib files:
- `lib/edms/notification-feed.ts` (if referenced)
- `lib/text-utils.ts` (already exists, check if complete)
- `lib/export.ts` (already exists)
- `lib/filter-columns.ts` (already exists)

## Phase 8: Testing & Validation (Priority: High)

### 8.1 Build Check
- Run `bun run build` after each phase
- Fix TypeScript errors
- Fix lint errors

### 8.2 Manual Testing
- Test each migrated page
- Test notification bell functionality
- Test theme settings
- Test data tables

## Execution Order

1. **Phase 1**: Component Migration (convert @midday/ui to shadcn-ui)
2. **Phase 2**: Page Migration (move pages to app/)
3. **Phase 4**: Data Table Integration (convert remaining tables)
4. **Phase 5**: Server Actions (create missing actions)
5. **Phase 6**: Sidebar (update navigation)
6. **Phase 7**: Imports (update paths)
7. **Phase 8**: Testing (build and manual test)
8. **Phase 3**: Theme Editor (decide on approach)

## Notes

- The `edms/` folder uses `@midday/ui` which needs to be replaced with shadcn-ui
- The current project already has a theme editor in `components/theme-editor/`
- Notification bell has been integrated into `components/site-header.tsx`
- Login page is now at `/login` (moved from `(login)` route group)
- Use the project's existing data-table component from `@/components/data-table/data-table`
- Exclude `edms/` from tsconfig during migration to avoid build errors
