# Marketing Page Files and Resources

## Core Marketing Pages

### Layout & Main Page
- `app/(marketing)/layout.tsx` - Marketing layout with header, footer, bottom navigation
- `app/(marketing)/page.tsx` - Main landing page with hero carousel, categories, products
- `app/(marketing)/page-animated.tsx` - Animated version of landing page
- `app/(marketing)/page-backup.tsx` - Backup version of landing page

### Sub Pages
- `app/(marketing)/about/page.tsx` - About page with company information
- `app/(marketing)/checkout/page.tsx` - Checkout page with cart and payment
- `app/(marketing)/collections/page.tsx` - Collections page with filtering
- `app/(marketing)/contact/page.tsx` - Contact page with form
- `app/(marketing)/products/page.tsx` - Products listing page with filters
- `app/(marketing)/products/[id]/page.tsx` - Individual product detail page

## Marketing Components

### Layout Components
- `components/marketing-header.tsx` - Header with navigation, language switcher, theme toggle
- `components/marketing-footer.tsx` - Footer with links and payment partner logos
- `components/bottom-navigation.tsx` - Mobile bottom navigation bar

### Product Display Components
- `components/marketing/category-card.tsx` - Category card component
- `components/marketing/product-card.tsx` - Product card for marketing sections
- `components/marketing/deal-card.tsx` - Special deal card component
- `components/marketing/featured-products.tsx` - Featured products section
- `components/marketing/fresh-vegetables.tsx` - Fresh vegetables section (75 images)
- `components/marketing/new-arrivals.tsx` - New arrivals section
- `components/marketing/organic-products.tsx` - Organic products section
- `components/marketing/seasonal-products.tsx` - Seasonal products section
- `components/marketing/special-offers.tsx` - Special offers section
- `components/marketing/top-sellers.tsx` - Top sellers section

### Product Page Components
- `components/product-card.tsx` - Main product card component (grid/list view)
- `components/product-filter-sidebar.tsx` - Product filtering sidebar
- `components/product-sort-bar.tsx` - Product sorting and search bar

## UI Components (shadcn/ui)

### Core UI Components Used
- `components/ui/badge.tsx` - Badge component for labels
- `components/ui/button.tsx` - Button component
- `components/ui/card.tsx` - Card component with header, content, footer
- `components/ui/carousel.tsx` - Carousel component for hero banners
- `components/ui/scroll-reveal.tsx` - Scroll animation component
- `components/ui/checkbox.tsx` - Checkbox component
- `components/ui/input.tsx` - Input field component
- `components/ui/label.tsx` - Label component
- `components/ui/select.tsx` - Select dropdown component
- `components/ui/separator.tsx` - Separator line component
- `components/ui/sheet.tsx` - Sheet/drawer component for mobile
- `components/ui/tabs.tsx` - Tabs component
- `components/ui/textarea.tsx` - Textarea component
- `components/ui/slider.tsx` - Slider component for price range
- `components/ui/collapsible.tsx` - Collapsible component for filters
- `components/ui/dropdown-menu.tsx` - Dropdown menu component
- `components/ui/hover-card.tsx` - Hover card component
- `components/ui/avatar.tsx` - Avatar component
- `components/ui/radio-group.tsx` - Radio group component

### Animation Components
- `components/ui/3d-card.tsx` - 3D card animation (used in page-animated.tsx)
- `components/ui/animated-marquee.tsx` - Marquee animation (used in page-animated.tsx)
- `components/ui/floating-element.tsx` - Floating element animation (used in page-animated.tsx)

## Data & Types

### Data Files
- `data/products.ts` - Product data array (12 products)

### Type Definitions
- `types/product.ts` - Product, ProductFilters, SortOption, ViewMode types

## Image Resources

### Product Images
- `/honey-2.jpg` - Honey product image
- `/mango-2.jpg` - Mango product image
- `/yogurt-2.jpg` - Yogurt product image
- `/ghee-2.jpg` - Ghee product image
- `/dates-2.jpg` - Dates product image
- `/spices-2.jpg` - Spices product image
- `/nuts-2.jpg` - Nuts product image
- `/oil-2.jpg` - Oil product image
- `/rice-2.jpg` - Rice product image
- `/jaggery.jpg` - Jaggery product image
- `/green-tea.jpg` - Green tea product image
- `/fresh-fruit-basket.jpg` - Fruit basket image
- `/organic-vegetables.jpg` - Organic vegetables image

### Category Icons
- `/ghee.jpg` - Ghee category icon
- `/honey.jpg` - Honey category icon
- `/dates.jpg` - Dates category icon
- `/spices.jpg` - Spices category icon
- `/nuts.jpg` - Nuts category icon
- `/beverage.jpg` - Beverage category icon
- `/rice.jpg` - Rice category icon

### Vegetable Images (75 images)
- `/vegetables/vegetable-1.jpg` through `/vegetables/vegetable-75.jpg` - Fresh vegetable images

### Banner Images (7 images)
- `/vegetables/vegetable-1.jpg` through `/vegetables/vegetable-7.jpg` - Hero carousel banners

### Logo & Branding
- `/logo.png` - Roshal Organic logo

### Payment Partner Logos (21 logos)
- `/logos/bkash-com.png` - bKash logo
- `/logos/nagad-com-bd.png` - Nagad logo
- `/logos/bracbank-com.png` - BRAC Bank logo
- `/logos/sonali-bank-com.png` - Sonali Bank logo
- `/logos/janatabank-bd-com.png` - Janata Bank logo
- `/logos/bdpost-gov-bd.png` - BD Post logo
- `/logos/btrc-gov-bd.png` - BTRC logo
- `/logos/grameen-com.png` - Grameen logo
- `/logos/beximco-com.png` - Beximco logo
- `/logos/pran-rfl-com.png` - PRAN-RFL logo
- `/logos/partexstar-com.png` - Partex Star logo
- `/logos/mohammadi-group-com.png` - Mohammadi Group logo
- `/logos/bashundharagroup-com.png` - Bashundhara Group logo
- `/logos/navana-com.png` - Navana logo
- `/logos/ab-group-com.png` - AB Group logo
- `/logos/confidencegroup-com-bd.png` - Confidence Group logo
- `/logos/beximco-pharma-com.png` - Beximco Pharma logo
- `/logos/squarepharma-com-bd.png` - Square Pharma logo
- `/logos/lifeline-com-bd.png` - Lifeline logo
- `/logos/desco-org-bd.png` - DESCO logo
- `/logos/bpdb-gov-bd.png` - BPDB logo

## Styling & Configuration

### Global Styles
- `app/globals.css` - Global CSS with Tailwind v4 configuration

### Fonts
- JetBrains Mono (global font)
- Hind Siliguri (Bengali font)
- Noto Sans Bengali (Bengali font)

## External Dependencies

### NPM Packages
- `next` - Next.js framework
- `react` - React library
- `lucide-react` - Icon library
- `nuqs` - URL query state management
- `embla-carousel-react` - Carousel functionality
- `framer-motion` - Animation library (for scroll-reveal)
- `class-variance-authority` - CVA for component variants
- `radix-ui` - Radix UI primitives (used by shadcn/ui)

## Features & Functionality

### Language Support
- Bilingual support (Bengali/English)
- Language switcher in header
- LocalStorage persistence
- Custom event for language changes

### Theme Support
- Dark/Light mode toggle
- LocalStorage persistence
- Theme switcher in header

### Product Features
- Product filtering (category, price, rating)
- Product sorting (featured, price, rating, newest, bestseller)
- Product search
- Grid/List view toggle
- Quick view modal
- Add to cart functionality
- Wishlist functionality
- Product reviews and ratings

### Navigation
- Desktop navigation with categories
- Mobile bottom navigation
- Category hover cards with subcategories
- Breadcrumb navigation
- Responsive design

### Checkout Features
- Shipping information form
- Multiple payment methods (COD, bKash, Nagad, Card)
- Order summary
- Promo code input
- Terms and conditions checkbox

### Marketing Sections
- Hero carousel with 7 banners
- Featured categories (8 categories)
- Featured products
- Top sellers
- New arrivals
- Special offers/deals
- Fresh vegetables (75 products)
- Organic products (20 products)
- Seasonal products (15 products)
- Social proof statistics
- Related products

## Total File Count

### Pages: 7 files
### Components: 24 files
### UI Components: 20+ files
### Data/Types: 2 files
### Images: 100+ files (product images, logos, vegetables, banners)

## Notes

- All marketing pages use the marketing layout with header, footer, and bottom navigation
- All components follow shadcn/ui design system
- All pages are responsive (mobile-first design)
- All text content is bilingual (Bengali/English)
- All images are stored in the public directory
- All components use TypeScript for type safety
