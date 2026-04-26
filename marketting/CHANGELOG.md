# Changelog

All notable changes to Roshal Organic will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Page Navigation and Routing**
  - Created dashboard layout with navigation header and tabs for account pages
  - Fixed navigation links in marketing-header (/profile → /account, /cart → /checkout)
  - Fixed navigation links in bottom-navigation (/cart → /checkout, /profile → /account)
  - Added dashboard navigation tabs (Account, Orders, Watchlist)
  - Added user dropdown menu with links to all dashboard pages
  - All pages now properly connected with correct routing
- **Landing Page Improvements with Proper Card Sizing**
  - Fixed oversized category icons (64px → 48px on mobile, 56px on desktop)
  - Fixed oversized product images (250px → 150px on mobile, 180px on desktop)
  - Reduced card padding throughout (p-4 → p-3 for smaller cards)
  - Reduced text sizes (text-xl → text-base, text-sm → text-xs)
  - Reduced avatar sizes (h-4 w-4 → h-3 w-3 on mobile)
  - Added Why Choose Us section with 4 feature cards
  - Added How It Works section with 3 step cards
  - Added Special Offers section with promotional banner
  - Added Social Proof section with statistics cards
  - All new sections use shadcn-ui Card components with proper sizing
  - Responsive design for all new sections (mobile-first approach)
- **Responsive Design Improvements for All Pages**
  - Product listing page with responsive grid (1/2/3/4 columns)
  - Product details page with responsive image heights (300/400/500px)
  - Checkout page with responsive spacing and layout adjustments
  - Account page with responsive tabs (2/4 columns on mobile/desktop)
  - Watchlist page with responsive header and grid layout
  - Order history page with responsive tabs and order cards
  - Marketing landing page with responsive section padding and grids
  - All text sizes adjusted for mobile (xs/sm) and desktop (base/lg)
  - All spacing adjusted with md: breakpoints for medium screens
  - Avatar sizes responsive (16/24 on mobile/desktop)
  - Icon sizes responsive throughout
- **User Account Pages with shadcn-ui Components**
  - Account page (/account) with comprehensive user profile management
  - Profile tab with editable user information (name, email, phone)
  - Avatar display with fallback initials
  - Account statistics cards (total orders, total spent, wishlist items)
  - Addresses tab with saved shipping addresses
  - Default address badge with edit/delete/set default actions
  - Payment methods tab with saved payment options (bKash, Nagad)
  - Settings tab with notification preferences and security options
  - Two-factor authentication toggle
  - Account deletion in danger zone
  - Watchlist page (/watchlist) with saved products grid
  - Empty state with call-to-action to browse products
  - Product cards with badges, stock status, and action buttons
  - Heart icon for wishlist items with filled state
  - Add to cart and view details buttons
  - Clear all watchlist functionality
  - Order history page (/orders) with comprehensive order tracking
  - Tab-based filtering (All, Processing, Shipped, Delivered, Cancelled)
  - Order cards with status icons and badges
  - Status indicators (CheckCircle, Truck, Clock, XCircle)
  - Order items display with quantities and prices
  - Track order button for active orders
  - Reorder and invoice download for delivered orders
  - Order total display
- **E-Commerce Core Pages with shadcn-ui Components**
  - Product details page (/products/[id]) with full product information
  - Quantity selector with increment/decrement buttons
  - Stock status indicators (in-stock, low-stock, out-of-stock)
  - Price display with original price and discount calculation
  - Add to Cart and Buy Now buttons
  - Wishlist and Share buttons
  - Delivery information card (free delivery, quality assured, easy returns)
  - Product tabs (Description, Features, Reviews) using Accordion component
  - Related products section with category filtering
  - Breadcrumb navigation with shadcn-ui Button components
  - Checkout page (/checkout) with complete order flow
  - Shipping information form with all required fields
  - Payment method selection (Cash on Delivery, bKash, Nagad, Credit/Debit Card)
  - Order summary with cart items display
  - Price breakdown (subtotal, delivery fee, discount, total)
  - Promo code input field
  - Terms and conditions checkbox
  - Delivery information card
  - Security badge with lock icon
- **Marketing Page Enhancements with shadcn-ui Components**
  - Testimonials section with Card, Avatar, and Star components
  - Newsletter subscription section with Input and Button components
  - FAQ section with Accordion component for collapsible questions
  - Scroll reveal animations for all new sections
  - Hover animations with Framer Motion
  - Bilingual support (Bangla/English) for all new content
  - 3 customer testimonials with ratings and reviews
  - 4 FAQ items covering common questions
  - Newsletter subscription form with email input
- **Amazon-Style Product Listing and Filtering Pages**
  - Product filter sidebar with categories, price range slider, and customer ratings
  - Product card component with Amazon-style layout (grid/list view toggle)
  - Product sort bar with search, sorting options, and view mode toggle
  - Instant filter updates without page reload
  - Mobile-responsive filter sidebar using Sheet component
  - Social proof features (star ratings, review counts, badges)
  - Stock status indicators (in-stock, low-stock, out-of-stock)
  - Product badges (new, bestseller, sale)
  - Sorting options: Featured, Price (low/high), Rating, Newest, Bestsellers
  - Search functionality across product names, descriptions, and categories
  - 12 sample organic food products with detailed information
- New product types and interfaces (types/product.ts)
- Product data file with 12 organic food items (data/products.ts)
- New components:
  - `components/product-card.tsx` - Amazon-style product card with ratings, badges, and CTAs
  - `components/product-filter-sidebar.tsx` - Collapsible filter sidebar with categories, price range, ratings
  - `components/product-sort-bar.tsx` - Search, sort, and view toggle bar
- **Animated E-Commerce Landing Page** with Framer Motion and GSAP
  - 3D Card effects for product displays (Aceternity UI style)
  - Animated marquee for trust badges (Magic UI style)
  - Scroll-based reveal animations with stagger effects
  - Parallax hero banner with smooth transitions
  - Floating element animations for feature icons
  - GSAP ScrollTrigger animations for features section
  - Animated gradient backgrounds
  - Hover effects with scale and rotation transforms
  - Smooth carousel transitions with motion animations
- New animated UI components:
  - `components/ui/3d-card.tsx` - 3D perspective card with mouse tracking
  - `components/ui/animated-marquee.tsx` - Infinite scrolling marquee
  - `components/ui/scroll-reveal.tsx` - Scroll-triggered fade-in animations
  - `components/ui/animated-gradient.tsx` - Animated gradient backgrounds
  - `components/ui/floating-element.tsx` - Floating animation wrapper
- Animation libraries:
  - Framer Motion 12.38.0 for React animations
  - GSAP 3.15.0 with ScrollTrigger for scroll-based animations
  - @gsap/react 2.1.2 for React integration
- Marketing pages layout with shared header and footer
- Landing page with hero carousel, featured categories, and top selling products
- About page with company information and commitments
- Products page with product catalog
- Contact page with contact form and information
- Authentication-based routing using Next.js 16 proxy.ts
- Dashboard route group for authenticated users
- Marketing route group for public pages
- Green primary color theme (#1B552A)
- Product images (honey, mango, yogurt, ghee, oil, dates, spices, nuts, beverage, rice)
- Favicon integration from public folder
- Logo integration in marketing layout header
- MarketingHeader component with user authentication UI
- Language switcher (English/Bangla, Bangla default)
- User dropdown menu with profile, orders, watchlist, and logout
- Watchlist and cart buttons with badge counters
- Mobile responsive navigation with Sheet component
- Role-based routing (admin to dashboard, user to marketing pages)

### Changed
- Transformed project from Quadra EDMS to Roshal Organic website
- Updated package name from "quadra" to "roshal-organic"
- Updated site configuration with Roshal Organic branding
- Updated metadata titles and descriptions for Roshal Organic
- Changed default theme from dark to light
- Removed DashboardLayout from root layout to support multiple layouts
- Created separate layouts for marketing and dashboard routes
- Updated root layout language to Bengali (bn)
- Updated primary color to green (#1B552A) using oklch color space
- Renamed middleware.ts to proxy.ts (Next.js 16 requirement)
- Updated marketing layout to use MarketingHeader component
- All UI components now use shadcn-ui theme colors

### Fixed
- Fixed TypeScript errors in lib/export.ts (type assertion for excludeColumns)
- Fixed missing @/db/utils import by implementing isEmpty helper function inline
- Fixed lib/fonts.ts to use JetBrains_Mono from next/font/google instead of Geist fonts
- Fixed TypeScript type errors in lib/filter-columns.ts for isEmpty function
- CSS linting warnings are expected for Tailwind CSS v4 (@custom-variant, @theme, @apply, @utility)

### Added
- Authentication system with better-auth
- Email/password authentication with Drizzle ORM and Turso database
- Role-based access control (RBAC) with 6 roles: user, admin, client, pmc, vendor, subcontractor
- Login page with video background and testimonial carousel
- User management data table with CRUD operations
- Theme switcher with dark mode as default
- Accounts table for better-auth compatibility
- Mobile responsive login page
- Database seeding with demo users for all roles
- Comprehensive documentation (CHANGELOG.md, TODO.md, AI_AGENT_RULES.md in AGENTS.md)
- File upload functionality with ImgBB (images) and Catbox (files)
- API routes for file uploads (/api/upload/imgbb, /api/upload/catbox)
- Files table to store unique file IDs (not full URLs)
- File upload UI with two inputs on home page
- File rendering with thumbnail preview for images
- Database schema test script (test-schema.ts)
- Authentication test script (test-auth.ts)
- @better-auth/utils package for proper password hashing
- Data grid utility functions (lib/data-grid.ts) for cell key management, popover detection, TSV parsing
- Data grid TypeScript types (types/data-grid.ts) for CellPosition, CellUpdate, NavigationDirection, etc.

### Changed
- Sidebar accordion now uses uncontrolled state with defaultOpen to prevent collapse on reload
- Sidebar accordion icons now rotate properly when expanded/collapsed
- ScrollArea component now has visible scrollbar track with high z-index (z-[9999])
- Renamed Error component to ErrorPage to avoid shadowing global Error
- All linting errors and warnings resolved across the codebase

### Fixed
- Fixed "Collapsible is changing from controlled to uncontrolled" warning by switching to uncontrolled components
- Fixed accordion state persistence across page reloads using localStorage with suppressHydrationWarning
- Fixed accordion flashing/collapsing on reload by reading localStorage synchronously in state initializer
- Fixed chevron icon rotation in nav-main and nav-secondary components
- Fixed accessibility issues in breadcrumb and input-otp components (added tabIndex and aria attributes)
- Fixed unused imports and variables across multiple components
- Fixed Node.js import protocol usage in migration scripts
- Fixed unreachable code in test-error-page component
- Fixed missing lang attribute in global-error.tsx
- Fixed hydration mismatch by using suppressHydrationWarning on SidebarMenuItem, CollapsibleContent, and SidebarMenuSub
- Fixed script tag error by using native script tag in head instead of Next.js Script component (required for blocking theme script)
- Fixed hydration mismatch in sidebar accordion by using useEffect to hydrate state from localStorage after mount
- Removed server-side cookie reading for sidebar state to prevent hydration errors
- Updated project structure (removed src folder)
- Updated biome.json configuration for linting overrides
- Migrated from ESLint to Biome for linting and formatting
- Updated accounts table field names (provider->providerId, provider_account_id->accountId)
- Updated sessions table to include token, ipAddress, and userAgent fields
- Updated users table to include emailVerified field
- Changed password hashing from SHA-256 to scrypt (better-auth standard)

### Fixed
- Fixed better-auth schema mapping for account model
- Fixed authentication errors with proper accounts table
- Fixed mobile responsiveness on login page
- Fixed "Credential account not found" error by adding password field to accounts table
- Fixed sessions table missing token column
- Fixed accounts table field names to match better-auth requirements
- Fixed password hashing to use scrypt algorithm
- Fixed users table to include emailVerified field
- Fixed sessions table to include ipAddress and userAgent fields

## [0.1.0] - 2026-04-22

### Added
- Initial project setup with Next.js 16.2.4
- Tailwind CSS 4.2.4 for styling
- shadcn-ui v4 components
- Drizzle ORM with Turso database
- Diceui data table components
- JetBrains Mono font
