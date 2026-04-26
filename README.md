# Quadra EDMS - Enterprise Document Management System

A modern, full-featured Enterprise Document Management System (EDMS) built with Next.js 16, designed for construction and project management workflows. Built with TypeScript, Tailwind CSS 4, and optimized for performance, type safety, and maintainability.

## 🎯 Current Status

### Completed Features
- ✅ Authentication system with better-auth (email/password)
- ✅ Role-based access control (RBAC) with 6 roles: user, admin, client, pmc, vendor, subcontractor
- ✅ Login page with video background and testimonial carousel
- ✅ User management data table with full CRUD operations
- ✅ Theme switcher with dark mode as default
- ✅ Mobile responsive design
- ✅ Database seeding with demo users
- ✅ Turso (SQLite) database with Drizzle ORM
- ✅ Professional code quality with Biome linting
- ✅ Smart form auto-fill and auto-selection features for improved UX

## ✨ Smart Auto-Fill & Auto-Selection Features

Quadra EDMS includes intelligent form features that automatically populate data to reduce manual entry and improve user experience:

### Project Creation Sheet
- **Auto-generated Project ID**: Automatically generates a unique project ID in the format `PRJ-YYYY-XXXX` (e.g., PRJ-2026-A3B7)
- **Auto-populated Start Date**: Automatically fills the start date field with the current date
- **Auto-detected Location**: Uses browser geolocation to automatically detect and fill the user's location (requires user permission)

### Document Creation Sheet
- **Auto-selected Project**: Automatically selects the first available project when the document creation sheet opens
- **Auto-generated Document Number**: Generates a document number based on the selected project's project number
- **Auto-suggested Title**: Suggests a document title based on the uploaded file name (smart filename parsing)
- **File Upload Integration**: Automatically populates file metadata (name, type, size, URL) when a file is uploaded via the integrated upload component

### Workflow Creation Sheet
- **Real User Data**: Fetches and displays real users and project members for reviewer/approver selection
- **Auto-persisted Due Dates**: Automatically saves due dates when creating workflow steps

### Document Details Page
- **Download Button**: Automatically shows a download button for documents with an associated file URL

These features work together to minimize manual data entry, reduce errors, and provide a smoother user experience across the platform.

### In Progress
- 🔄 Document management features
- 🔄 Project workflows
- 🔄 Advanced permissions system

### Planned Features
- � Document upload and version control
- 📋 Transmittal management
- 📋 Drawing and RFI tracking
- 📋 Approval workflows
- 📋 Audit trails
- 📋 Reporting and analytics
- 📋 Integration with project management tools

## �🚀 Tech Stack

### Core Framework
- **Next.js 16.2.4** - React framework with App Router, Server Components, and Turbopack
- **React 19.2.4** - Latest React with improved performance and features
- **TypeScript 5** - End-to-end type safety

### Styling & UI
- **Tailwind CSS 4.2.4** - Utility-first CSS framework with modern features
- **shadcn-ui v4** - Beautiful, accessible component library
- **JetBrains Mono** - Global monospace font
- **Framer Motion** - Animation library for UI transitions

### Authentication & Database
- **better-auth 1.6.7** - Comprehensive authentication framework
- **Drizzle ORM 0.45.2** - Type-safe, lightweight ORM for TypeScript
- **Turso (@libsql/client 0.17.2)** - Edge SQLite database for serverless deployment

### State & Data
- **Zustand 5.0.12** - Fast, scalable state management
- **TanStack Query 5.99.2** - Powerful async state management and data fetching
- **Zod 4.3.6** - TypeScript-first schema validation

### Tooling
- **Bun 1.3.13** - Fast package manager, runtime, and test runner
- **Biome 2.4.12** - Fast formatter and linter (replaced ESLint)

## 📦 Installation

### Prerequisites
- Node.js 18+ or Bun 1.3+
- Git
- Turso database account (for production)

### Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd quadra
```

2. **Install dependencies**
```bash
bun install
```

3. **Environment variables**
Create a `.env` file in the root directory:
```env
DATABASE_URL=libsql://your-database.turso.io
DATABASE_AUTH_TOKEN=your-auth-token
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:3000
```

4. **Run database migrations**
```bash
bun run scripts/migrate.ts
bun run scripts/migrate-accounts.ts
```

5. **Seed database with demo users**
```bash
bun run scripts/seed-users.ts
```

6. **Run development server**
```bash
bun run dev
```

7. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

### Demo Users
All demo users have password: `password`
- `user@gmail.com` - User role
- `admin@gmail.com` - Admin role
- `client@gmail.com` - Client role
- `pmc@gmail.com` - PMC role
- `vendor@gmail.com` - Vendor role
- `subcontractor@gmail.com` - Subcontractor role

## 🛠️ Available Scripts

```bash
# Development server
bun run dev

# Production build
bun run build

# Start production server
bun run start

# Lint with Biome
bun run lint

# Format with Biome
bun run format

# Database migrations
bun run scripts/migrate.ts
bun run scripts/migrate-accounts.ts

# Seed database
bun run scripts/seed-users.ts

# Drop all tables (use with caution)
bun run scripts/drop-tables.ts
```

## 📁 Project Structure

```
quadra/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   └── users/         # User management endpoints
│   ├── login/            # Login page
│   ├── layout.tsx        # Root layout with NuqsAdapter
│   ├── page.tsx          # Home page (user management)
│   └── globals.css       # Global styles (Tailwind v4)
├── components/            # React components
│   ├── data-table/       # Diceui data table components
│   └── ui/               # shadcn-ui components
├── config/               # Configuration files
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
│   ├── auth.ts          # better-auth configuration
│   ├── db.ts            # Drizzle database client
│   ├── schema.ts        # Database schema
│   └── text-utils.ts    # Text utilities
├── scripts/              # Database scripts
│   ├── migrate.ts
│   ├── migrate-accounts.ts
│   ├── seed-users.ts
│   └── drop-tables.ts
├── types/                # TypeScript type definitions
├── CHANGELOG.md          # Changelog (use this for all changes)
├── TODO.md               # AI agent task tracking
├── AI_AGENT_RULES.md     # AI agent guidelines
├── biome.json            # Biome configuration
├── drizzle.config.ts     # Drizzle ORM configuration
├── next.config.ts        # Next.js configuration
├── proxy.ts              # Next.js 16 proxy for auth
└── package.json          # Dependencies
```

## 🔧 Configuration

### Biome
The project uses Biome for linting and formatting. Configuration is in `biome.json` with overrides for third-party components.

### shadcn-ui
Components are managed via shadcn CLI. To add new components:
```bash
bunx shadcn@latest add <component-name>
```

### Tailwind CSS 4
Tailwind CSS 4 is configured with the new v4 syntax. Import in your CSS file:
```css
@import "tailwindcss";
```

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:
1. All changes must be documented in `CHANGELOG.md`
2. AI agents should track their work in `TODO.md`
3. Follow the code quality standards defined in `AI_AGENT_RULES.md`
4. Run linting and formatting before committing

## 📄 License

This project is open source and available under the MIT License.

## � Documentation

- [CHANGELOG.md](./CHANGELOG.md) - Detailed changelog of all changes
- [TODO.md](./TODO.md) - AI agent task tracking
- [AI_AGENT_RULES.md](./AI_AGENT_RULES.md) - Guidelines for AI agents

---

**Built with ❤️ for modern construction project management**
