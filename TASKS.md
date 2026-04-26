# TASKS - Outstanding Work & Feature Rollout

This file tracks features that have been partially implemented and need to be rolled out to all pages, as well as specific bugs that need fixing.

## 📋 Complete Dashboard Page List

All pages currently in the sidebar navigation:

### Main Navigation
1. **Projects** (`/projects`)
2. **Documents** (`/documents`)
3. **Workflows** (`/workflows`)
4. **Bulk Upload** (`/bulk-upload`)
5. **Schedule** (`/schedule`)
6. **Data Book** (`/databook`)
7. **Matrix** (`/matrix`)
8. **Audit** (`/audit`)
9. **Queries** (`/technical-queries`)
10. **Reports** (`/reports`)
11. **Theme** (`/theme`)
12. **Configuration** (`/config`)

### Transmittals
- **Outgoing** (`/transmittals`)
- **Incoming** (`/transmittals/incoming`)
- **New Transmittal** (`/transmittals/new`)

### Queries & RFIs
- **Technical Queries** (`/technical-queries`)
- **Site Tech Queries** (`/site-tech-queries`)
- **RFIs** (`/rfis`)

### Correspondence
- **Letters Register** (`/letters`)
- **New Letter** (`/letters/new`)
- **Memos** (`/memos`)

### Meetings
- **Minutes of Meeting** (`/meetings`)
- **New MoM** (`/meetings/new`)

### Management
- **Submittals** (`/submittals`)
- **Change Orders** (`/change-orders`)
- **Inspections** (`/inspections`)
- **Extension of Time** (`/extension-of-time`)
- **Daily Reports** (`/daily-reports`)
- **Safety Observations** (`/safety-observations`)
- **Commissioning** (`/commissioning`)
- **Warranty** (`/warranty`)
- **Notifications** (`/notifications`)

## 🎯 Auto-Fill & Auto-Selection Features - Partial Rollout

### ✅ Already Implemented (Completed Pages)
The following pages already have smart auto-fill and auto-selection features:

1. **Project Creation Sheet** (`components/edms/project-create-sheet.tsx`)
   - ✅ Auto-generated Project ID (format: PRJ-YYYY-XXXX)
   - ✅ Auto-populated Start Date (current date)
   - ✅ Auto-detected Location (browser geolocation)

2. **Document Creation Sheet** (`components/edms/document-create-sheet.tsx`)
   - ✅ Auto-selected Project (first available project)
   - ✅ Auto-generated Document Number (based on project number)
   - ✅ Auto-suggested Title (from uploaded filename)
   - ✅ File Upload Integration (auto-populates file metadata)

3. **Workflow Creation Sheet** (`components/edms/workflow-create-sheet.tsx`)
   - ✅ Real User Data (fetches real users/project members)
   - ✅ Auto-persisted Due Dates

4. **Document Details Page** (`app/(dashboard)/documents/[id]/page.tsx`)
   - ✅ Download Button (shows when fileUrl exists)

### 🔄 Pages That Need Auto-Fill Features Added

The following pages/sheets need the same smart auto-fill features added:

1. **Transmittal Creation Sheet** (`components/edms/transmittal-create-sheet.tsx`)
   - [ ] Auto-select first project
   - [ ] Auto-generate transmittal number based on project
   - [ ] Auto-populate date with current date
   - [ ] Auto-detect location
   - [ ] Smart document selection suggestions

2. **Notification Creation Sheet** (`components/edms/notification-create-sheet.tsx`)
   - [ ] Auto-select first project
   - [ ] Auto-populate date with current date
   - [ ] Smart recipient suggestions based on project members

3. **Report Generation Sheet** (if exists)
   - [ ] Auto-select first project
   - [ ] Auto-populate date range defaults
   - [ ] Smart report type suggestions

4. **Schedule Entry Sheet** (if exists)
   - [ ] Auto-select first project
   - [ ] Auto-populate date with current date
   - [ ] Auto-suggest task names from templates

5. **Databook Entry Sheet** (if exists)
   - [ ] Auto-select first project
   - [ ] Auto-populate metadata from project defaults

6. **Matrix Entry Sheet** (if exists)
   - [ ] Auto-select first project
   - [ ] Auto-populate discipline/category from project

7. **Audit Log Sheet** (if exists)
   - [ ] Auto-select first project
   - [ ] Auto-populate date with current date
   - [ ] Auto-populate user info

## � Bulk Operations - Excel Import Verification

### Bulk Upload
- **Location**: `app/(dashboard)/bulk-upload/page.tsx`, `components/edms/document-bulk-upload-sheet.tsx`, `components/edms/document-bulk-import-sheet.tsx`
- **Status**: Needs verification
- **Task**: Ensure bulk document upload via Excel sheet import works correctly
- **Requirements**:
  - [ ] Verify Excel template is correct and downloadable
  - [ ] Verify Excel parsing works for all required fields
  - [ ] Verify bulk upload creates documents correctly in database
  - [ ] Verify file uploads work for multiple documents
  - [ ] Verify error handling for invalid Excel data
  - [ ] Verify progress indicators work during bulk upload

### Bulk Project Creation
- **Location**: `components/edms/project-bulk-create-sheet.tsx` (if exists)
- **Status**: Needs verification
- **Task**: Ensure bulk project creation via Excel sheet import works correctly
- **Requirements**:
  - [ ] Verify Excel template is correct and downloadable
  - [ ] Verify Excel parsing works for all required project fields
  - [ ] Verify bulk project creation works in database
  - [ ] Verify auto-generated project IDs work for bulk imports
  - [ ] Verify error handling for invalid Excel data
  - [ ] Verify progress indicators work during bulk creation

## �🐛 Specific Bugs to Fix

### High Priority

1. **Schedule Page - Document Link Not Working**
   - Location: `app/(dashboard)/schedule/page.tsx` or related component
   - Issue: The "link document" link is not functioning correctly
   - Action: Investigate the link implementation and fix the routing or URL

2. **Correspondence Page - Letter Creation Not Working**
   - Location: `app/(dashboard)/correspondence/page.tsx` or related component
   - Issue: Letter creation feature is not working
   - Action: Debug the letter creation flow and fix any broken functionality

### Medium Priority

3. **Breadcrumb Component - Slug Readability**
   - Location: `components/site-header.tsx` and related pages
   - Issue: Route slugs are scary to read (e.g., `/documents/[id]`)
   - Action: Create a slug-to-proper-name mapping and update breadcrumb component to use readable names
   - Example mapping:
     - `documents` → "Documents"
     - `projects` → "Projects"
     - `workflows` → "Workflows"
     - `transmittals` → "Transmittals"
     - `schedule` → "Schedule"
     - `correspondence` → "Correspondence"
     - `reports` → "Reports"
     - `databook` → "Data Book"
     - `matrix` → "Matrix"
     - `audit` → "Audit Log"

4. **Dashboard Header - Fixed Position**
   - Location: `components/dashboard-layout.tsx` or header component
   - Issue: Header scrolls past content instead of staying fixed
   - Action: Make header position fixed/sticky at the top with proper z-index

5. **Documents Page - New Document Button**
   - Location: `app/(dashboard)/documents/page.tsx`
   - Issue: "New Document" button redirects to upload page instead of opening sheet
   - Action: Replace redirect with direct sheet trigger on the same page

## 📋 Implementation Priority Order

1. **Fix bugs first** (Schedule link, Correspondence letter creation)
2. **Breadcrumb slug mapping** (improves UX across all pages)
3. **Dashboard header fixed position** (improves UX across all pages)
4. **Documents page sheet integration** (fixes user flow)
5. **Roll out auto-fill features** (start with most used sheets: Transmittal, Notification)

## 🎯 Success Criteria

A task is considered complete when:
- All auto-fill features are implemented on the target page
- The features work correctly and match the implementation on Project/Document sheets
- Bugs are fixed and verified working
- Code is formatted with `bun run format`
- Code passes linting with `bun run lint`
- CHANGELOG.md is updated with the changes
- TODO.md is updated with task completion status

---

**Note for AI Agents**: When working on these tasks, always reference the existing implementations in `project-create-sheet.tsx` and `document-create-sheet.tsx` as the gold standard for how auto-fill features should be implemented.
