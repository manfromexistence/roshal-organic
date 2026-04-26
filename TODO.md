# TODO - AI Agent Task Tracking

This file tracks tasks, progress, and status for AI agents working on Quadra EDMS.

## Active Tasks

### Current Session (2026-04-25)
- [x] Fix the disabled `Issue Transmittal` action on `/transmittals/new`, align both transmittal creation entry points with auto-filled required subjects plus live validity updates, and rename the shared configuration navigation label to `Project Configuration` - completed 2026-04-26 08:33 +06:00
- [x] Replace the command palette result list overflow with the shared shadcn `ScrollArea` so the global header search popover scrolls through the design-system scrollbar instead of a raw native list scroller - completed 2026-04-26 08:01 +06:00
- [x] Retire the DX loop task and update `AGENTS.md` so normal repo work executes the user's request directly without calling `d` unless the user explicitly re-enables DX - completed 2026-04-26 07:06 +06:00
- [x] Move the global search into the header with shadcn command search, restore the missing `/api/search` instant-results route, make the header collapse to a search button on smaller screens, and harden the remaining matrix responsive overflow - completed 2026-04-26 07:06 +06:00
- [x] Fix the remaining matrix page overflow by correcting the shared dashboard content rail sizing, harden the matrix grids for narrow widths, and apply persisted theme variables before hydration so custom themes do not flash on reload - completed 2026-04-26 04:45 +06:00
- [x] Rework the matrix summary into responsive auto-fit cards, keep matrix overflow local to the live matrix content, restore horizontal scrolling only inside the report modal, and prepare a fresh production deployment - completed 2026-04-26 06:05 +06:00
- [x] Expand the reports workspace to match the root EDMS catalog more closely, widen and scroll-enable the live report modal, rename the visible product header to "Quadra EDMS Demo", and stop the matrix page from overflowing the dashboard rail at desktop tablet widths - completed 2026-04-26 05:31 +06:00
- [x] Fix mobile overflow on the configuration tabs plus the documents, schedule, matrix, and outgoing transmittals pages, and replace touched native UI elements with shadcn equivalents where available - completed 2026-04-26 04:03 +06:00
- [x] Harden EDMS role enforcement so workflow actions respect assignee/admin access, delete operations stay admin-only, the reports workspace carries denser operational data, and the matrix/workflow pages better match the root `index.html` behaviors - completed 2026-04-26 01:38 +06:00
- [x] Enrich the `/reports` live report previews with denser EDMS-style summary/detail sections, stop the `/config` tabs shell from overflowing on mobile, and standardize the listed operational registers onto the shared data-table layout - completed 2026-04-25 23:42 +06:00
- [x] Replace the project setup page placeholders with real settings persistence and stop the matrix page from overflowing the shell width - completed 2026-04-25 22:34 +06:00
- [x] Expand the `/transmittals/new` live PDF preview footer so the bottom section matches the richer root `index.html` transmittal layout with issued/received signature blocks - completed 2026-04-25 22:18 +06:00
- [x] Fix the `/documents` upload sheet file picker flow so the upload button opens reliably and the selected file can be posted to the EDMS upload API - completed 2026-04-25 22:12 +06:00
- [x] Fix the remaining `bun tsc --noEmit` error in the extension-of-time form, rerun format/lint/build, and deploy the linked Vercel production project - completed 2026-04-25 22:02 +06:00
- [x] Audit hidden dummy UI, verify live database connectivity, and check the bulk document import plus bulk upload flows from the DX follow-up prompt - completed 2026-04-25 21:36 +06:00
- [x] Fix the bulk document Excel import path to generate project-scoped document numbers, preserve imported metadata, and map import statuses correctly - completed 2026-04-25 21:36 +06:00
- [x] Fix the bulk upload page hydration mismatch by removing the unstable sheet trigger wrappers around the bulk import and bulk upload launch buttons - completed 2026-04-25 21:36 +06:00
- [x] Remove the dead demo projects table scaffold and its `dashboard-data.json` fixture so hidden mock data cannot resurface in the dashboard - completed 2026-04-25 21:36 +06:00
- [x] Polish the remaining generic browser-tab titles on databook, reports, technical queries, and record detail pages after the second live route audit - completed 2026-04-25 21:22 +06:00
- [x] Complete the remaining EDMS create/register/detail flows for daily reports, extension of time, inspections, safety observations, warranty, meetings, memos, RFIs, and site technical queries, then browser-audit all live dashboard routes - completed 2026-04-25 21:22 +06:00
- [x] Restore the default shell avatars so the header profile trigger uses the shadcn logo and the organization footer uses the evil-rabbit logo, then verify both in the in-app browser - completed 2026-04-25 21:22 +06:00
- [x] Re-run `bun run format` and `bun run lint` after the route completion and shell avatar fixes - completed 2026-04-25 21:22 +06:00
- [x] Audit every live dashboard page for placeholder, dummy, and "not implemented" UI, replace the user-facing ones with working data-driven implementations, and rerun `bun run format` plus `bun run lint` - completed 2026-04-25 20:30 +06:00
- [x] Raise the shared dashboard scroll-track z-index above the fixed header so the shell scrollbar stays draggable across the full viewport - completed 2026-04-25 20:51 +06:00
- [x] Audit the remaining dashboard/login flows for bugs, misconfiguration, and placeholder behavior from the new DX prompt, then implement the missing real behavior - completed 2026-04-25 20:48 +06:00
- [x] Fix dashboard shell scrollbars to use the shared shadcn ScrollArea tracks and restore working logout via Better Auth - completed 2026-04-25 20:23 +06:00
- [x] Fix review document issues from `Quadra Review 25.04.26.odt` - completed 2026-04-25 19:29 +06:00
- [x] Correct Quadra branding text from "Electric" to "Electronic" - completed 2026-04-25 19:20 +06:00
- [x] Fix shared dashboard layout spacing/overflow regressions affecting technical queries, incoming transmittals, configuration tabs, and general page chrome - completed 2026-04-25 19:20 +06:00
- [x] Fix document register sheet field overlap and restore single-file upload responsiveness - completed 2026-04-25 19:20 +06:00
- [x] Fix bulk document upload sheet field overlap - completed 2026-04-25 19:20 +06:00
- [x] Fix transmittal creation responsiveness and printable output without dashboard chrome - completed 2026-04-25 19:20 +06:00
- [x] Restore active schedule linking for document-to-activity mapping - completed 2026-04-25 19:20 +06:00
- [x] Restore technical query registration flow and page route - completed 2026-04-25 19:20 +06:00
- [x] Restore letters recent-activity logging and PDF upload support - completed 2026-04-25 19:20 +06:00
- [x] Implement distribution matrix live logic instead of placeholder empty state - completed 2026-04-25 19:20 +06:00
- [x] Restore databook compilation flow so sample databook generation works - completed 2026-04-25 19:20 +06:00
- [x] Run `bun run format` and `bun run lint` after the fixes - completed 2026-04-25 19:20 +06:00
- [x] Run DX flow command `d` only after all document-listed fixes are completed - completed 2026-04-25 19:30 +06:00

### Current Session (2026-04-24)
- [x] Complete TASKS.md backlog items by fixing schedule document linking, real letter creation, breadcrumb/header UX, real transmittal/bulk/report flows, databook section entry, and theme persistence across page navigation - completed 2026-04-24 23:58 +06:00
- [x] Fix bulk-upload button rendering by removing suppressHydrationWarning from SheetTrigger in document-bulk-upload-sheet and document-bulk-import-sheet - completed 2026-04-24 21:43 +06:00
- [x] Fix React key prop warning in site-header.tsx by using Fragment with key prop instead of shorthand fragment syntax - completed 2026-04-24 21:45 +06:00
- [x] Fix document creation sheet by creating /api/edms/uploads route using Catbox API with proper FormData format (reqtype=fileupload, fileToUpload), removing FormField wrapper from DocumentFileUpload, and using hidden input for fileUrl validation - completed 2026-04-24 22:11 +06:00
- [x] Fix document file upload UI to show uploaded file details with clickable link to open file and remove button to clear upload - completed 2026-04-24 22:00 +06:00
- [x] Fix document file upload button click handler by using onClick to trigger file input instead of asChild with label - completed 2026-04-24 22:04 +06:00
- [x] Fix document file upload to require project selection with clear error message and auto-select first project when available - completed 2026-04-24 22:21 +06:00
- [x] Fix document details page to show download button for documents with fileUrl - completed 2026-04-24 22:16 +06:00
- [x] Improve EDMS sheet UX defaults and fix empty workflow assignee loading â€” in-page document sheet, auto-filled EDMS form defaults, and real workflow assignee loading completed 2026-04-24 22:09 +06:00
- [x] ~~Deep bug, UI, and configuration review requested via DX prompt~~ ✅ completed 2026-04-24 20:53 +06:00
- [x] Fix sidebar icon collapse regression — added `collapsible="icon"` to `AppSidebar` in `dashboard-layout.tsx` (was defaulting to `offcanvas`, which hides the sidebar entirely)
- [x] Fix hydration mismatch in activity entry popover on projects page by removing asChild from PopoverTrigger
- [x] Auto-generate random project ID in project creation form (format: PRJ-YYYY-XXXX)
- [x] Auto-populate start date with current date in project creation form
- [x] Auto-populate user location using browser geolocation in project creation form
- [x] Fix status dropdown padding/margin issue in project creation form
- [x] Fix upload endpoint errors by changing `/api/upload/avatar` to `/api/upload/imgbb` in image-card-upload and document-upload-form components
- [x] Fix manifest.webmanifest 500 error by removing conflicting public/manifest.webmanifest file
- [x] Fix server action error by updating createProject action signature to match form fields
- [x] Fix location auto-population by using form.setValue instead of form.reset
- [x] Fix workflow sheet padding by adding px-6 to SheetContent
- [x] Fix disabled items in workflow sheet by removing disabled conditions from reviewer and approver selects
- [x] Fix bulk upload Excel import by implementing createDocument action with actual database insertion using Drizzle ORM (XLSX library already in use)
- [x] Fix location to show actual user location by implementing reverse geocoding using OpenStreetMap Nominatim API
- [x] Fix status dropdown UI issue by removing conflicting mt-0 class from FormItem
- [x] Fix project creation to actually insert into database using Drizzle ORM instead of returning temp-id
- [x] Check all create and CRUD sheet components for native HTML elements and replace with shadcn-ui
- [x] Replace native HTML file input in project-template-upload-sheet with Button-triggered file input
- [x] Fix inconsistent padding in document-version-sheet, workflow-action-sheet, and project-template-upload-sheet
- [x] Create reusable lib functions in lib/edms/form-helpers.ts for common UI patterns (ID generation, date helpers, location detection, status options)
- [x] Update project-create-sheet, document-create-sheet, document-version-sheet, and transmittal-create-sheet to use lib/edms/form-helpers
- [x] Implement all server actions with actual database operations instead of dummy TODO implementations (createProject, createDocument, createDocumentVersion, createDocumentWorkflow, recordWorkflowDecision, createTransmittal, updateUserDetails, updateUserRole, deleteUser, toggleUserStatus)

### Current Session (2026-04-23)
- [x] Fix better-auth authentication error by adding accounts table
- [x] Create migration script for accounts table
- [x] Update seed script to create account records
- [x] Make login page fully responsive on mobile
- [x] Add theme toggler to login page
- [x] Position role selector properly on mobile (top, full width)
- [x] Position theme toggler properly (desktop: beside role, mobile: right side)
- [x] Set dark mode as default theme
- [x] Improve code quality (organize imports, fix unused variables)
- [x] Update biome.json with appropriate linting overrides
- [x] Format all files with Biome
- [x] Create CHANGELOG.md for tracking changes
- [x] Update README.md with current status and goals
- [x] Create TODO.md for tracking AI agent work
- [x] Create AI_AGENT_RULES.md for AI agent guidelines
- [x] Move AI agent rules to AGENTS.md
- [x] Fix "Credential account not found" error by adding password field to accounts table
- [x] Update accounts schema with password field
- [x] Update migration script for password field
- [x] Update seed script to store password in account record
- [x] Drop and recreate tables with new schema
- [x] Re-run migration and seed scripts successfully
- [x] Research ImgBB and Catbox APIs for file uploads
- [x] Create API route for ImgBB image upload
- [x] Create API route for Catbox file upload
- [x] Add files table to database schema
- [x] Create migration script for files table
- [x] Add two upload inputs to home page
- [x] Implement file rendering from stored IDs
- [x] Update biome.json to disable noImgElement rule
- [x] Create database schema test script (test-schema.ts)
- [x] Create authentication test script (test-auth.ts)
- [x] Fix sessions table schema (missing token column)
- [x] Fix accounts table field names (provider->providerId, provider_account_id->accountId)
- [x] Fix password hashing to use scrypt (@better-auth/utils)
- [x] Add emailVerified field to users table
- [x] Add ipAddress and userAgent fields to sessions table
- [x] Remove passwordHash from users table (password in accounts only)
- [x] Drop and recreate tables with correct schema
- [x] Re-run migration with correct schema
- [x] Re-seed users and accounts with correct data
- [x] Test authentication flow (sign-in and sign-up)
- [x] Authentication now working correctly

## Completed Features

### Authentication & User Management
- [x] Email/password authentication with better-auth
- [x] Role-based access control (RBAC) with 6 roles
- [x] Login page with video background and testimonial carousel
- [x] User management data table with CRUD operations
- [x] Database seeding with demo users
- [x] Accounts table for better-auth compatibility

### UI/UX
- [x] Mobile responsive design
- [x] Theme switcher with dark mode default
- [x] Professional styling with shadcn-ui and Tailwind CSS 4

### Code Quality
- [x] Biome linting and formatting
- [x] TypeScript type safety
- [x] Organized imports and clean code
- [x] Proper folder structure

### Documentation
- [x] CHANGELOG.md
- [x] Updated README.md
- [x] TODO.md

## Planned Features

### Document Management
- [ ] Document upload functionality
- [ ] Document version control
- [ ] Document metadata management
- [ ] File type validation
- [ ] File size limits

### Transmittal Management
- [ ] Create transmittals
- [ ] Track transmittal status
- [ ] Transmittal approval workflows
- [ ] Transmittal history

### Drawing & RFI Management
- [ ] Drawing upload and tracking
- [ ] RFI creation and management
- [ ] Drawing revision control
- [ ] RFI response tracking

### Approval Workflows
- [ ] Multi-level approval system
- [ ] Approval notifications
- [ ] Approval history
- [ ] Role-based approval permissions

### Audit Trails
- [ ] Activity logging
- [ ] Change tracking
- [ ] User action history
- [ ] Compliance reporting

### Reporting & Analytics
- [ ] Document statistics
- [ ] User activity reports
- [ ] Project status dashboards
- [ ] Export functionality

### Integrations
- [ ] Project management tool integration
- [ ] Email notifications
- [ ] Calendar integration
- [ ] API endpoints for external systems

## Technical Debt

### Code Quality
- [ ] Add unit tests for critical functions
- [ ] Add integration tests for API routes
- [ ] Add E2E tests with Playwright
- [ ] Improve error handling throughout

### Performance
- [ ] Optimize database queries
- [ ] Implement caching strategies
- [ ] Add loading states for all async operations
- [ ] Optimize bundle size

### Security
- [ ] Add rate limiting to API routes
- [ ] Implement CSRF protection
- [ ] Add input sanitization
- [ ] Security audit

## Notes

### Database Schema
- Users table: id, email, name, role, passwordHash, createdAt, updatedAt
- Sessions table: id, userId, token, expiresAt, createdAt, updatedAt
- Accounts table: id, userId, provider, providerAccountId, createdAt, updatedAt

### RBAC Roles and Permissions
- **user**: read:documents, read:projects
- **admin**: read:documents, write:documents, delete:documents, read:projects, write:projects, delete:projects, manage:users
- **client**: read:documents, read:projects, read:reports
- **pmc**: read:documents, write:documents, read:projects, write:projects, approve:documents
- **vendor**: read:documents, write:documents, read:projects
- **subcontractor**: read:documents, write:documents, read:projects

### Demo Users
All demo users have password: `password`
- user@gmail.com (user)
- admin@gmail.com (admin)
- client@gmail.com (client)
- pmc@gmail.com (pmc)
- vendor@gmail.com (vendor)
- subcontractor@gmail.com (subcontractor)

## Last Updated
2026-04-24 - Completed comprehensive admin dashboard with 30+ pages, linting configuration, and build verification
