<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AI Agent Rules for Quadra EDMS

All AI agents working on Quadra EDMS MUST follow these rules strictly. These rules ensure maintainability, code quality, and proper documentation for the long-term success of the project.

## 📋 Core Rules

### 1. Documentation Standards
- **ALWAYS** use root `CHANGELOG.md` for tracking changes - never create separate markdown files for changelog purposes
- **ALWAYS** update `README.md` when adding significant features or changing project structure
- **ALWAYS** update `TODO.md` to track what you're working on, current status, and progress
- Never create "stupid markdown files here and there" - use the established documentation structure

### 2. User Instructions
- If the user asks for X, do **exactly** X - nothing more, nothing less
- Do not add "helpful" features or changes that weren't requested
- When uncertain about requirements, ask for clarification with **numbered options** (1, 2, 3, etc.)
- Example: "I'm not sure about the layout. Should I: 1) Put it on the left, 2) Put it on the right, 3) Put it in the center?"

### 3. Research and Dependencies
- **ALWAYS** do latest web search for solutions before implementing
- **ALWAYS** tend to use the latest packages via package manager (Bun)
- When choosing between packages, prefer actively maintained, recently updated options
- Check package compatibility with current project stack (Next.js 16, React 19, etc.)

### 4. When to Ask vs. When to Search
- **DO NOT ask simple stuff** that wastes time - do web search instead
- Examples of when to search: syntax questions, common patterns, library usage
- Examples of when to ask: ambiguous requirements, conflicting instructions, architectural decisions
- If a task is very complex, have a **3 tries rule**

### 5. Three Tries Rule
If you fail to complete a task **3 times in a row**:
1. Stop attempting the task
2. Create a help file named `HELP_NEEDED_[task-name].md` in the root directory
3. Include ALL details in the help file:
   - What you were trying to do
   - What errors you encountered
   - What you tried (all 3 attempts)
   - Current state of the code
   - Any relevant error messages or logs
4. Ask the user specific questions with numbered options
5. Do not continue trying until user provides guidance

### 6. Code Quality Standards
- **ALWAYS** run `bun run format` before committing
- **ALWAYS** run `bun run lint` before committing
- Fix all linting errors that are in your own code
- Third-party component linting errors can be ignored via biome.json overrides
- Maintain proper folder structure as defined in README.md
- Write clean, maintainable, professional code

### 7. Folder Structure
- Follow the established project structure (see README.md)
- Do not create random folders without purpose
- Keep related files together
- Use proper naming conventions (kebab-case for files, PascalCase for components)

### 8. Future Maintainability
- Write code that future developers (and AI agents) can understand
- Add comments for complex logic
- Use descriptive variable and function names
- Avoid "clever" code that's hard to maintain
- Follow existing patterns in the codebase

### 9. UI Component Usage (CRITICAL)
- **ALWAYS** use shadcn-ui components instead of native HTML elements
- **NEVER** use native HTML elements when shadcn-ui equivalents exist
- **ALWAYS** use the data-table component from `@/components/data-table/data-table` for displaying tabular data (default table for the website)
- The data-table component in `components/data-table/` is the real data-table component - this is the default table for the project
- The shadcn-ui Table component exists but is used internally by the data-table component - do not use it directly
- Examples:
  - Use `<DataTable>` from `@/components/data-table/data-table` for all tabular data displays
  - Use `<Button>` from shadcn/ui instead of `<button>`
  - Use `<Input>` from shadcn/ui instead of `<input>`
  - Use `<Select>` from shadcn/ui instead of `<select>`
  - Use `<Dialog>` from shadcn/ui instead of custom modals
- This ensures consistent styling, accessibility, and maintainability
- Check `components/ui/` for available components before using native HTML

### 10. Color Usage (CRITICAL)
- **ALWAYS** use shadcn-ui theme colors instead of hardcoded colors
- **NEVER** use hardcoded color values (e.g., `bg-zinc-50`, `text-zinc-900`)
- Use Tailwind CSS utility classes that reference the theme (e.g., `bg-muted`, `text-foreground`)
- This ensures consistent theming across light/dark modes
- Check `app/globals.css` for available theme color variables

## 🚫 Prohibited Actions

- **NEVER** create changelog files other than `CHANGELOG.md`
- **NEVER** add features that weren't requested
- **NEVER** skip web search for common problems
- **NEVER** ask simple questions that can be answered with search
- **NEVER** create random markdown files without purpose
- **NEVER** commit without running lint and format
- **NEVER** break the established folder structure
- **NEVER** ignore user instructions in favor of "better" ideas
- **NEVER** use native HTML elements when shadcn-ui equivalents exist (CRITICAL)
- **NEVER** use hardcoded color values when shadcn-ui theme colors exist (CRITICAL)

## ✅ Required Actions Before Committing

1. Update `CHANGELOG.md` with your changes
2. Update `TODO.md` with task completion status
3. Run `bun run format`
4. Run `bun run lint`
5. Fix any linting errors in your own code
6. Test your changes manually if possible
7. Commit with a clear, professional message

## 🔍 When to Use Web Search

**SEARCH for:**
- How to use a specific library or function
- Common error messages
- Best practices for specific patterns
- Package alternatives and comparisons
- Syntax questions
- TypeScript type definitions

**ASK USER for:**
- Clarification on ambiguous requirements
- Decisions between multiple valid approaches
- Confirmation of complex architectural changes
- Business logic questions
- Design preferences

## 📊 Progress Tracking

Always update `TODO.md` with:
- Task description
- Current status (in progress, completed, blocked)
- Any blockers or issues encountered
- Next steps if task is incomplete

## 🎯 Success Criteria

A task is considered complete when:
1. User's exact request is fulfilled
2. Code is formatted and linted
3. Documentation is updated (CHANGELOG.md, TODO.md)
4. Changes are committed with professional message
5. No regressions in existing functionality

---

**ALL AI AGENTS MUST FOLLOW THESE RULES WITHOUT EXCEPTION**

# Dx

Last updated: 2026-04-26

## Purpose

DX flow is disabled unless the user explicitly asks to re-enable it.
The agent should directly implement the user's request without calling `d`.

## DX Flow

1. Do not call `d` during normal repo work.
2. Execute the user's request directly.
3. Only use DX again if the user explicitly tells you to resume DX flow.

## Rules

- Do not use `d` unless the user explicitly requests DX flow.
- Implement the user's request directly and report what changed.

## Task Management

### TODO.md Protocol

- At project start or when receiving multi-step tasks, create/update `TODO.md` in the root
- Break user requests into concrete, actionable tasks
- Work top-down: always work on the first "In Progress" item
- Move only one task to "In Progress" at a time
- Mark completed tasks with `[x]`, ~~strikethrough~~, ✅, and timestamp
- Advance automatically to the next pending task without waiting for permission
- Never delete tasks, only mark them completed or blocked
- Update `TODO.md` after every action to reflect current reality

### CHANGELOG.md Protocol

- Maintain `CHANGELOG.md` in the root to track all completed work
- Follow semantic versioning and Keep a Changelog format
- Add entries under `## [Unreleased]` as work completes
- Include: Added, Changed, Fixed, Removed sections as needed
- Be specific about what changed, not just "updated file X"
- Update after completing each significant task or feature
- When releasing, move Unreleased items to a versioned section

### Failure Recovery

- **Three-Strike Rule**: Try 3 different approaches before escalating
- On third failure, create/append to `HELP.md` with full diagnostic info
- Move blocked tasks to "Blocked / Failed" section in `TODO.md`
- Continue with next unblocked task automatically

## Repo Focus

- Primary app: `apps/dashboard`
- Secondary app: `apps/construction` (theme editor source — do NOT modify without understanding the migration plan below)
- Deployment target: Vercel project `app-quadra`
- Production URL: `https://app-quadra.vercel.app`
- Runtime: **Bun** (`bun run dev`, `bun test`, etc.)
- Package manager: `bun@1.3.11` (workspace at `f:\quadra`)

## File Policy

- Keep this file short and focused on agent behavior
- Do not store secrets, environment variables, or redundant examples here
- Use `TODO.md` for task tracking, `CHANGELOG.md` for work history
- Use `HELP.md` only when tasks fail after 3 attempts
- **NEVER create stray markdown files** (README, SUMMARY, IMPLEMENTATION, ANALYSIS, etc.) unless explicitly requested by the user
- **NEVER create scripts** (PowerShell, bash, Python, etc.) unless explicitly requested by the user
- Focus on implementing actual code changes, not documentation
- The only acceptable markdown files are: `TODO.md`, `CHANGELOG.md`, `HELP.md` (when blocked after 3 attempts)
- If you need to document something, update existing files or add code comments

---

## Project State — EDMS Dashboard (as of 2026-04-19)

> **READ THIS BEFORE STARTING ANY WORK ON `apps/dashboard`.**
> This section documents exactly what has been done and what remains.

### Architecture

| Layer | Technology |
|---|---|
| Framework | Next.js 16 App Router (`apps/dashboard`) |
| ORM | Drizzle ORM + Turso (libsql) |
| UI Components | `@midday/ui` (packages/ui) — Radix + Tailwind |
| Styling | Tailwind CSS 3.4 with OKLCH CSS variables |
| API | tRPC v11 + Next.js Route Handlers |
| Auth | better-auth |
| Runtime | Bun |

### Completed Work

#### 1. EDMS Pages (all fully functional)

All pages live under `apps/dashboard/src/app/[locale]/(app)/(sidebar)/`:

| Route | File | Status |
|---|---|---|
| `/documents` | `documents/page.tsx` | ✅ DB-backed |
| `/projects` | `projects/page.tsx` | ✅ DB-backed |
| `/workflows` | `workflows/page.tsx` | ✅ DB-backed |
| `/transmittals` | `transmittals/page.tsx` | ✅ DB-backed |
| `/notifications` | `notifications/page.tsx` | ✅ DB-backed |
| `/reports` | `reports/page.tsx` | ✅ PrintButton |
| `/schedule` | `schedule/page.tsx` | ✅ PrintButton |
| `/databook` | `databook/page.tsx` | ✅ PrintButton |
| `/matrix` | `matrix/page.tsx` | ✅ PrintButton |
| `/audit` | `audit/page.tsx` | ✅ PrintButton |

#### 2. Theme Migration — OKLCH (DONE)

The color system has been **fully migrated from HSL to OKLCH**:

- **`packages/ui/tailwind.config.ts`** — All color tokens now use `oklch(var(--token) / <alpha-value>)` syntax.
- **`packages/ui/src/globals.css`** — All `:root` and `.dark` CSS variable values are now OKLCH space-separated triplets (e.g., `--background: 0.145 0 0` for dark mode).
- **`apps/dashboard/src/styles/globals.css`** — All remaining `hsl(var(--*))` references replaced with `oklch(var(--*))`. Sidebar variables migrated to explicit `oklch(...)` values matching `apps/construction/config/theme.ts`.

**Default "Quadra" theme values** (from `apps/construction/config/theme.ts`):

| Variable | Light | Dark |
|---|---|---|
| `--background` | `1 0 0` | `0.145 0 0` |
| `--foreground` | `0.145 0 0` | `0.985 0 0` |
| `--card` | `1 0 0` | `0.205 0 0` |
| `--primary` | `0.205 0 0` | `0.922 0 0` |
| `--border` | `0.922 0 0` | `0.275 0 0` |

#### 3. Bulk Upload, Search, AI Chat, Reports (DONE)

- `DocumentBulkUploadSheet` supports multi-file concurrent upload.
- `/api/search/route.ts` — Drizzle `ilike` queries across `projects` + `documents`.
- `/api/chat/route.ts` — Injects user's active project portfolio as RAG context.
- `PrintButton` component (`apps/dashboard/src/components/edms/print-button.tsx`) integrated into all report pages with `print:hidden` utilities.

#### 4. Database Seed (DONE)

Script: `apps/dashboard/src/db/scripts/seed-edms.ts`

Run with: `bun run apps/dashboard/src/db/scripts/seed-edms.ts`

Populates: Projects, Documents, Workflows, WorkflowSteps, Transmittals, Notifications.

#### 5. Theme Verification Test (DONE)

File: `apps/dashboard/src/theme.test.ts`

Run with: `bun test src/theme.test.ts` (from `apps/dashboard/`)

All 3 tests pass:
- `Theme configuration uses OKLCH`
- `Theme variables are OKLCH space separated`
- `Dashboard specific variables are OKLCH`

Test script in `apps/dashboard/package.json` is now `"test": "bun test src"`.

---

### Pending Work — THE BIG ONE: Theme Editor Migration

> ⚠️ **This is the most complex remaining task. Read carefully before starting.**

**Goal:** Port the full theme editor from `apps/construction` into `apps/dashboard` so users can live-edit the Quadra theme from inside the dashboard.

**Why it's hard:** The construction app is a standalone Next.js app with its own store, types, hooks, and component tree. Naively copying files will break imports, cause dark mode to not work, and create a situation where the background doesn't change and the UI breaks with the light theme.

#### Files to understand before starting

| File | Purpose |
|---|---|
| `apps/construction/config/theme.ts` | **Authoritative** OKLCH theme definitions. `defaultLightThemeStyles`, `defaultDarkThemeStyles`, `defaultThemeState`. This is what "Quadra" means. |
| `apps/construction/types/editor.ts` | `ThemeEditorState` type — the shape of the theme editor store. |
| `apps/construction/types/theme.ts` | `ThemePreset` and related types. |
| `apps/construction/store/editor-store.ts` | Zustand store driving the theme editor. |
| `apps/construction/store/theme-preset-store.ts` | Zustand store for preset management. |
| `apps/construction/components/editor/editor.tsx` | The top-level editor component. |
| `apps/construction/components/editor/theme-control-panel.tsx` | Left panel — color pickers and controls. |
| `apps/construction/components/editor/theme-preview-panel.tsx` | Right panel — live preview. |
| `apps/construction/components/editor/theme-preset-select.tsx` | Preset dropdown. |
| `apps/construction/components/theme-script.tsx` | The critical script that injects CSS variables into `<html>` on mount — **this is what makes dark mode work**. |
| `apps/construction/components/theme-provider.tsx` | Wraps the app with theme context. |

#### Correct migration strategy (step by step)

> Do these in order. Do not skip steps.

1. **Create `packages/theme` package** (or add to `packages/ui`):
   - Move `config/theme.ts`, `types/editor.ts`, `types/theme.ts` to a shared package.
   - Export them from `@midday/theme` (or `@midday/ui/theme`).
   - Both `apps/construction` and `apps/dashboard` should import from here.

2. **Port the Zustand stores** into `apps/dashboard/src/store/`:
   - `editor-store.ts` → `apps/dashboard/src/store/theme-editor-store.ts`
   - `theme-preset-store.ts` → `apps/dashboard/src/store/theme-preset-store.ts`
   - Fix all import paths.

3. **Copy and adapt `theme-script.tsx`** into `apps/dashboard/src/components/theme-script.tsx`:
   - This script runs before hydration and sets CSS vars on `<html>`.
   - It MUST be injected in `apps/dashboard/src/app/[locale]/layout.tsx` inside `<head>` as `<Script strategy="beforeInteractive">` or as a raw inline script.
   - **Without this, dark mode background will not change.** This is the #1 failure mode.

4. **Copy and adapt `theme-provider.tsx`**:
   - Ensure it reads from the Zustand store and applies CSS variables via `document.documentElement.style.setProperty`.
   - Replace `next-themes` `ThemeProvider` wrapping if it conflicts.

5. **Copy editor UI components** into `apps/dashboard/src/components/theme-editor/`:
   - `editor.tsx`, `theme-control-panel.tsx`, `theme-preview-panel.tsx`, `color-picker.tsx`, `colors-tab-content.tsx`, `theme-preset-select.tsx`, `hsl-adjustment-controls.tsx`, `shadow-control.tsx`, etc.
   - Fix all imports.

6. **Create theme editor page** at `apps/dashboard/src/app/[locale]/(app)/(sidebar)/theme/page.tsx`:
   - Render the editor component.
   - Add to sidebar navigation in `apps/dashboard/src/components/main-menu.tsx`.

7. **Test dark mode thoroughly**:
   - Dark mode background MUST change from `oklch(0.145 0 0)` to `oklch(1 0 0)` on toggle.
   - The UI must not break in light mode.
   - A random theme preset MUST NOT be selected by default — "Quadra" (the defaults from `config/theme.ts`) must be the initial state.

8. **Add bun tests** for:
   - Default theme state matches `defaultThemeState` from `config/theme.ts`.
   - Theme script correctly generates CSS variable strings.

#### Known failure modes to avoid

| Failure | Cause | Fix |
|---|---|---|
| Background doesn't change on dark/light toggle | `theme-script.tsx` not injected before hydration | Inject as `beforeInteractive` script in layout |
| UI breaks in light mode | CSS variables fall back to OKLCH `0 0 0` (black) | Ensure `:root` always has valid fallbacks |
| Random theme selected on load | `theme-preset-store` not initialized with `defaultThemeState` | Hydrate store with `defaultThemeState` from `config/theme.ts` |
| `oklch(var(--x))` not working | Tailwind still using `hsl(var(--x))` | All color tokens in `tailwind.config.ts` must use `oklch(var(...) / <alpha-value>)` |

---

### Running the Dashboard

```powershell
# From the repo root
bun run dev:dashboard

# Or directly
cd apps/dashboard
bun run dev
# Dashboard runs on http://localhost:3001
```

### Running Tests

```powershell
cd apps/dashboard
bun test src
# Runs theme tests + any other *.test.ts files under src/
```

---

# Quadra - Modern Web Stack 2026

## Project Overview
- **Name**: Quadra
- **Framework**: Next.js 16.2.4
- **Package Manager**: Bun 1.3.13
- **Styling**: Tailwind CSS 4.2.4
- **UI Components**: shadcn-ui v4
- **Font**: JetBrains Mono (global)
- **Linting/Formatting**: Biome 2.4.12 (ESLint removed)

## Tech Stack

### Core
- **Next.js 16.2.4** - React framework with App Router, SSR, Turbopack (400% faster dev startup)
- **React 19.2.4** - Latest React with Server Components
- **TypeScript 5** - Type safety throughout

### UI & Styling
- **shadcn-ui v4** - Copy-paste components built on Radix UI + Tailwind CSS
- **Tailwind CSS 4.2.4** - Utility-first CSS framework
- **Lucide React** - Icon library
- **diceui data-table** - Advanced data table components with filtering, sorting, pagination

### State & Data
- **Zustand 5.0.12** - Minimalist state management
- **TanStack Query 5.99.2** - Async state management, caching, server state
- **Zod 4.3.6** - TypeScript-first schema validation

### Database & ORM
- **Drizzle ORM 0.45.2** - Type-safe SQL ORM
- **Turso 0.17.2** - Edge SQLite database (@libsql/client)
- **Dexie.js 4.4.2** - IndexedDB wrapper for offline-first storage

### Authentication
- **better-auth 1.6.7** - Modern TypeScript authentication framework

### Tooling
- **Bun 1.3.13** - Fast runtime, package manager, test runner
- **Biome 2.4.12** - Linter and formatter (replaced ESLint)

### Query State Management
- **nuqs 2.8.9** - URL search params state management (for data table)

## Project Structure
```
f:\hexed\quadra\
├── app/
│   ├── layout.tsx (with NuqsAdapter)
│   ├── page.tsx (main page with users table)
│   └── globals.css (Tailwind v4 + JetBrains Mono)
├── components/
│   ├── ui/ (shadcn components)
│   ├── data-table/ (diceui components)
│   └── users-table.tsx (default data table component)
├── config/ (data-table config)
├── hooks/ (use-data-table, use-debounced-callback)
├── lib/ (data-table utilities, parsers, format)
├── types/ (TypeScript types for data-table)
├── biome.json (linting config with overrides for third-party components)
└── package.json
```

## shadcn/ui Ecosystem Research (2026)

### Top Block Libraries

1. **Shadcnblocks** (shadcnblocks.com) - $149-$299 lifetime
   - 1350+ blocks, 1189+ components, 12+ templates
   - Best overall: complete solution for Marketing + App UI + eCommerce
   - Strong tooling, monthly releases, Shadcn MCP integration

2. **Cult UI** (cult-ui.com) - Free (Open Source)
   - 100+ components, 100+ blocks, 10+ templates
   - Best open source: AI SDK agents, 100+ AI blocks, full-stack templates
   - 100% open source under MIT license, Next.js + Supabase templates

3. **21st.dev** (21st.dev) - Free (No Paid Tiers)
   - 500+ components, 200+ blocks
   - Best marketplace: largest shadcn/ui component marketplace
   - 100% open source, community-driven, no subscriptions

4. **Shadcn Studio** (shadcnstudio.com) - $219-$359 lifetime
   - 700+ blocks, 608+ components, 10+ templates
   - Best for Figma-first workflow with custom Figma plugins

5. **Tailark** (tailark.com) - $249-$399 lifetime
   - 300+ blocks, 43+ pages
   - Best for bespoke marketing design and visual consistency

6. **Aceternity UI** (ui.aceternity.com) - $299 lifetime
   - 101+ components, 94+ blocks, 13+ templates
   - Best for motion-heavy components (Framer Motion integration)

7. **Magic UI** (magicui.design) - $199 lifetime
   - 150+ components, 50+ blocks, 9+ templates
   - Best for quick animated effects (Marquee, Globe, Dock, patterns)

8. **Shadcn Space** (shadcnspace.com) - Free
   - UI component management tool
   - Best tooling: drag-and-drop interface, real-time preview

### Core shadcn/ui Components
- **Form**: Button, Input, Label, Select, Checkbox, Radio, Switch, Slider, Textarea, Form
- **Data Display**: Badge, Card, Avatar, Dialog, Dropdown, Popover, Tooltip, Progress, Skeleton
- **Navigation**: Nav Menu, Tabs, Breadcrumb, Pagination, Command, Collapsible, Accordion, Scroll Area, Sheet
- **Feedback**: Alert, Alert Dialog, Toast, Sonner, Callout
- **Layout**: Aspect Ratio, Container, Divider, Resizable
- **Typography**: Typography, Masonry, Calendar
- **Note**: Use the data-table component (from @/components/data-table/data-table) for all tabular data displays - this is the default table for the website

## Configuration Notes
- Biome configured to ignore linting rules for third-party components (data-table, ui components)
- JetBrains Mono set as global font (replaced Geist Sans/Mono)
- ESLint removed, using Biome exclusively
- NuqsAdapter wraps the app for URL query state management
- Suspense boundary added for data table component

## Pages
- **/** - Main page with users table (default data-table component)

## Build Status
- Build successful with all changes integrated
- TypeScript compilation successful
- All linting warnings addressed (third-party component overrides added)
