# Laravel Inertia Migration Plan for Roshal Organic

This plan outlines the complete migration of the Roshal Organic Next.js Bun project to Laravel 12 with Inertia.js and React, configured for cPanel deployment in Bangladesh.

## Overview

**Current Stack:** Next.js 16, React 19, Bun, Turso (SQLite), better-auth, shadcn-ui
**Target Stack:** Laravel 12, Inertia.js v3, React 19, MySQL, Laravel Breeze, shadcn-ui

**Migration Scope:** Complete migration of all features including authentication with RBAC, marketing pages, dashboard, data tables, animations, and e-commerce functionality.

## Phase 1: Laravel Project Setup

### 1.1 Create New Laravel Project
- Install Laravel 12 using Laravel installer: `laravel new roshal-organic`
- Select React starter kit when prompted (includes Inertia + React + Vite)
- Configure for PHP 8.5 compatibility (user's installed version)

### 1.2 Database Configuration
- Set up MySQL database (cPanel compatible)
- Configure `.env` with MySQL credentials
- Update database configuration for production deployment

### 1.3 Install Laravel Breezef
- Install Breeze with Inertia: `php artisan breeze:install inertia --dark`
- This provides:
  - Authentication scaffolding (login, registration, password reset)
  - Email verification
  - Two-factor authentication (optional)
  - Session management
  - Dark mode support

### 1.4 Install shadcn-ui for Laravel
- Use shadcn CLI: `npx shadcn@latest init`
- Configure for Laravel Inertia structure
- Components will be installed to `resources/js/components/ui/`

## Phase 2: Database Migration

### 2.1 Create Laravel Migrations
- Convert Drizzle schema to Laravel migrations:
  - `users` table (id, email, name, role, email_verified_at, created_at, updated_at)
  - `password_resets` table (Breeze default)
  - `sessions` table (Laravel default)
  - `files` table (id, user_id, type, file_id, file_name, created_at)

### 2.2 Create Eloquent Models
- `User` model with role field and RBAC relationships
- `File` model for file uploads
- Configure model relationships and casts

### 2.3 Seed Database
- Create seeder for demo users with all 6 roles:
  - user@gmail.com (user)
  - admin@gmail.com (admin)
  - client@gmail.com (client)
  - pmc@gmail.com (pmc)
  - vendor@gmail.com (vendor)
  - subcontractor@gmail.com (subcontractor)
- All users with password: `password`

### 2.4 Configure RBAC
- Create Laravel policies for each role
- Define permissions in `App\Policies\`
- Middleware for role-based access control

## Phase 3: Authentication Migration

### 3.1 Replace better-auth with Laravel Breeze
- Remove better-auth dependencies
- Use Laravel's built-in authentication
- Implement custom role-based redirects:
  - Admin users → Dashboard
  - Regular users → Marketing pages with user features

### 3.2 Update Login Page
- Migrate current login page design to Laravel Inertia
- Keep video background and testimonial carousel
- Integrate with Laravel Breeze authentication
- Add role selector for registration

### 3.3 Session Management
- Use Laravel's session system
- Configure session driver for cPanel (file or database)
- Set session lifetime to 7 days (matching current setup)

## Phase 4: Frontend Component Migration

### 4.1 Migrate shadcn-ui Components
- Reinstall all current shadcn-ui components using Laravel Inertia CLI
- Components to migrate:
  - Button, Input, Label, Select, Checkbox, Radio, Switch
  - Badge, Card, Avatar, Dialog, Dropdown, Popover, Tooltip
  - Navigation Menu, Tabs, Breadcrumb, Pagination
  - Alert, Toast, Sonner, Callout
  - Sidebar, Scroll Area, Resizable
  - Form components

### 4.2 Migrate Custom Components
- Convert React components to Laravel Inertia pages:
  - `MarketingHeader` → `resources/js/Pages/Marketing/Header.jsx`
  - `MarketingFooter` → `resources/js/Pages/Marketing/Footer.jsx`
  - `DataTable` → `resources/js/Components/DataTable.jsx`
  - `AppSidebar` → `resources/js/Components/AppSidebar.jsx`
  - `ChartAreaInteractive` → `resources/js/Components/ChartAreaInteractive.jsx`
  - `SectionCards` → `resources/js/Components/SectionCards.jsx`

### 4.3 Migrate Marketing Pages
- Convert Next.js app router pages to Laravel Inertia pages:
  - Home page → `resources/js/Pages/Home.jsx`
  - About page → `resources/js/Pages/About.jsx`
  - Products page → `resources/js/Pages/Products.jsx`
  - Contact page → `resources/js/Pages/Contact.jsx`
  - Collections page → `resources/js/Pages/Collections.jsx`
  - Privacy page → `resources/js/Pages/Privacy.jsx`
  - Terms page → `resources/js/Pages/Terms.jsx`

### 4.4 Migrate Dashboard Pages
- Dashboard layout → `resources/js/Pages/Dashboard/Layout.jsx`
- Dashboard page → `resources/js/Pages/Dashboard/Index.jsx`
- User management → `resources/js/Pages/Dashboard/Users.jsx`

### 4.5 Migrate Animation Libraries
- Keep Framer Motion for animations
- Keep GSAP for scroll-based animations
- Configure with Vite for Laravel

## Phase 5: State Management Migration

### 5.1 Replace Zustand with Laravel State
- Use Laravel's shared props for global state
- Use Inertia's page props for component state
- Consider using React Context for complex state

### 5.2 Replace TanStack Query
- Use Laravel's data fetching through Inertia
- Use Laravel controllers for API-like data
- Cache data using Laravel's caching system

### 5.3 Replace Zod Validation
- Use Laravel's built-in validation
- Use Form Request classes for complex validation
- Keep Zod for client-side validation if needed

## Phase 6: File Upload Migration

### 6.1 Migrate File Storage
- Replace Turso file storage with Laravel Storage
- Keep using ImgBB for images (API key in .env)
- Keep using Catbox for other files
- Store only unique IDs in MySQL database

### 6.2 Update File Upload Logic
- Create Laravel controller for file uploads
- Integrate with ImgBB and Catbox APIs
- Update React components to use Laravel endpoints

## Phase 7: Routing Migration

### 7.1 Convert Next.js Routes to Laravel Routes
- Map Next.js app router to Laravel routes in `routes/web.php`
- Marketing routes: `/`, `/about`, `/products`, `/contact`, etc.
- Dashboard routes: `/dashboard`, `/dashboard/users`
- Auth routes: `/login`, `/register`, `/password/reset`
- API routes: Move to Laravel controllers

### 7.2 Configure Middleware
- Apply authentication middleware to protected routes
- Apply role-based middleware to dashboard
- Configure guest middleware for auth pages

## Phase 8: Internationalization

### 8.1 Keep Language Switcher
- Use Laravel's localization features
- Create language files for Bangla and English
- Set Bangla as default language
- Store language preference in session/database

## Phase 9: Theme Configuration

### 9.1 Keep Dark Mode
- Use Laravel Breeze's dark mode support
- Configure Tailwind CSS for dark mode
- Keep dark mode as default

## Phase 10: cPanel Deployment Configuration

### 10.1 Server Requirements
- PHP 8.5
- MySQL 5.7+ or MariaDB 10.3+
- Composer
- Node.js and npm

### 10.2 Build Configuration
- Configure Vite for production build
- Set appropriate asset paths for cPanel
- Optimize assets for production

### 10.3 Environment Configuration
- Create production `.env` file
- Configure database credentials
- Set APP_URL for production domain
- Configure mail settings for cPanel

### 10.4 Deployment Steps
1. Upload Laravel files to cPanel public directory
2. Set proper file permissions (755 for directories, 644 for files)
3. Configure `.htaccess` for Laravel
4. Run `php artisan key:generate`
5. Run `php artisan migrate --seed`
6. Run `npm run build`
7. Configure cron jobs for Laravel scheduler (if needed)

### 10.5 Performance Optimization
- Enable OPcache
- Configure Laravel cache (file or Redis)
- Enable gzip compression
- Configure CDN for static assets (logo, images)

## Phase 11: Testing & Validation

### 11.1 Authentication Testing
- Test login with all 6 roles
- Test registration with role selection
- Test password reset
- Test session management

### 11.2 Feature Testing
- Test marketing pages navigation
- Test dashboard functionality
- Test data table CRUD operations
- Test file uploads (ImgBB, Catbox)
- Test language switcher
- Test theme toggle

### 11.3 Responsive Testing
- Test on mobile devices
- Test on tablet devices
- Test on desktop

### 11.4 Cross-Browser Testing
- Test on Chrome
- Test on Firefox
- Test on Safari
- Test on Edge

## Phase 12: Documentation Updates

### 12.1 Update README.md
- Document Laravel setup instructions
- Update tech stack section
- Add deployment instructions for cPanel
- Update environment variables documentation

### 12.2 Update CHANGELOG.md
- Document all migration changes
- Track breaking changes
- Document new features

### 12.3 Update TODO.md
- Mark migration tasks as completed
- Document any post-migration tasks

## Phase 13: Cleanup

### 13.1 Remove Next.js Artifacts
- Delete `node_modules` from Next.js project
- Delete `.next` directory
- Delete Next.js configuration files
- Delete Bun lockfile

### 13.2 Archive Old Project
- Create backup of Next.js project
- Store in separate directory
- Keep for reference if needed

## Estimated Timeline

- Phase 1-2: 2-3 hours (Laravel setup and database)
- Phase 3: 1-2 hours (Authentication)
- Phase 4: 4-6 hours (Component migration)
- Phase 5: 1-2 hours (State management)
- Phase 6: 1-2 hours (File uploads)
- Phase 7: 1 hour (Routing)
- Phase 8-9: 1 hour (i18n and theme)
- Phase 10: 2-3 hours (cPanel configuration)
- Phase 11: 2-3 hours (Testing)
- Phase 12-13: 1 hour (Documentation and cleanup)

**Total Estimated Time: 16-24 hours**

## Key Considerations

1. **Data Loss Risk**: Backup all Turso database data before migration
2. **Breaking Changes**: Some features may need adjustment for Laravel
3. **Performance**: Laravel with MySQL may have different performance characteristics
4. **Deployment**: cPanel has specific requirements for Laravel deployment
5. **Maintenance**: Laravel requires different maintenance procedures than Next.js

## Success Criteria

- All current features working in Laravel Inertia
- Authentication with RBAC functional
- Marketing pages with animations working
- Dashboard with data tables functional
- File uploads working with ImgBB/Catbox
- Dark mode and language switcher working
- Responsive design maintained
- Successfully deployed on cPanel
- Performance comparable or better than Next.js version
