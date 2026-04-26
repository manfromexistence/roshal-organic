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
