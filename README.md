# Roshal Organic

Roshal Organic is a bilingual Bangla/English ecommerce CMS built on Next.js 16, Bun, Drizzle, Turso, Better Auth, and shadcn/ui. The public site is storefront-first, while `/dashboard` is the admin control panel for products, orders, users, marketing pages, theme settings, and payment-guide management.

## Current Surface

- Storefront routes: `/`, `/about`, `/contact`, `/products`, `/products/[slug]`, `/cart`, `/checkout`, `/orders`, `/orders/[id]`, `/profile`
- The live storefront shell at `/` now uses the transplanted landing/header/footer treatment from the former root-level `marketting` app
- Custom CMS marketing routes: `/(marketing)/[slug]` for additional published pages created from the dashboard
- Admin routes: `/dashboard`, `/dashboard/products`, `/dashboard/orders`, `/dashboard/payments`, `/dashboard/users`, `/dashboard/pages`, `/dashboard/theme`
- Auth roles: `admin`, `user`
- Languages: Bangla and English
- Payment options: `card`, `bkash`, `nagad`, `rocket`, `upay`
- Manual wallet verification flow: customers can submit transaction ID, sender number, and screenshot; admins can review and mark orders paid
- Checkout enforcement: pricing, delivery fee, enabled payment methods, payment-proof requirements, and inventory are validated on the server before an order is created
- Payment-review workflow now follows each payment option's dashboard-configured mode and proof requirements, so manual/gateway changes affect order intake correctly
- Gateway-mode checkout now makes the template limitation explicit: until a real processor is wired, `card` orders fall back to admin follow-up instead of pretending a live gateway exists
- Inventory movement: confirmed order creation reserves stock in the database, and cancelled orders restore stock through the admin order workflow
- Cart and checkout now reconcile persisted cart items against the live published catalog, reducing stale-quantity checkout failures for returning users
- Storefront product discovery: search, category filter, and sort controls on `/products`
- Customer order history now includes search, status filtering, and summary metrics on `/orders`
- Account UX: `/profile` now includes order metrics, recent orders, quick links back to cart/order history/admin, and a working storefront logout control
- Customer order pages now show itemized line items, delivery details, proof screenshots, payment verification timestamps, and admin/tracking notes instead of only top-level status badges
- Shared app feedback is now mounted globally with the Roshal toaster, and checkout/login flows now show in-page errors instead of relying on raw browser alerts
- Dashboard marketing control center: `/dashboard/pages` now includes a React Query + Zustand workspace for the live homepage, with DB-backed section visibility toggles and direct links into the full page editor
- Login UX: `/login` now behaves like a storefront customer-account entry point with checkout/order-tracking messaging instead of a generic admin-style auth form
- Dashboard command search now searches the active Roshal admin workspace for products, orders, users, and marketing pages instead of the legacy EDMS entities
- SEO surface: dynamic metadata for home, products, and CMS pages plus Roshal-branded sitemap, robots, manifest, and OG image output

## What The Dashboard Controls

- Product catalog, pricing, inventory, featured status, gallery, and localized descriptions
- Low-stock and out-of-stock visibility in the admin dashboard and product management table
- Order review, payment verification, status updates, and order-tracking notes
- Storefront order tracking with a dedicated processing stage between confirmation and shipment
- User profile data and role assignment
- Admin safety rails that prevent self-demotion/deactivation and protect the last active admin account from being removed accidentally
- Marketing page content, sections, layouts, copy, images, and section JSON/style settings
- Homepage landing composition through a dedicated control center that maps live section keys, supported `stylesJson` rules, and section visibility to the current storefront landing page
- Creation of new marketing pages and new sections directly from the dashboard, including media uploads and live storefront links for published pages
- Generic marketing-page sections now honor dashboard `stylesJson` product sourcing (`featured`, `all`, `reverse`, `limit`, `offset`) instead of falling back to a fixed featured-product slice
- Safe fallback merging for the built-in home/about/contact CMS pages and sections, so partial dashboard edits do not wipe out the rest of the default storefront composition
- Storefront brand settings such as CTA labels, hero layout, card style, spacing, and contact information
- Payment method enablement, instructions, merchant/account details, and checkout guide screenshots

## Environment Variables

Set these in `.env`, `.env.local`, and `.env.production` as needed:

```env
DATABASE_URL=libsql://your-turso-db-url
DATABASE_AUTH_TOKEN=your-turso-auth-token
BETTER_AUTH_SECRET=your-better-auth-secret
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
ROSHAL_PAYMENT_GATEWAY_PROVIDER=aamarpay
ROSHAL_PAYMENT_GATEWAY_METHODS=card,bkash,nagad,rocket,upay
AAMARPAY_SANDBOX=true
AAMARPAY_BASE_URL=https://sandbox.aamarpay.com
AAMARPAY_STORE_ID=your-aamarpay-store-id
AAMARPAY_SIGNATURE_KEY=your-aamarpay-signature-key
IMGBB=your-imgbb-api-key
IMGBB_API_KEY=your-imgbb-api-key
CATBOX_USERHASH=optional-catbox-userhash
```

## Local Setup

1. Install dependencies with `bun install`.
2. Provision or connect a Turso database.
3. Run migrations with `bun run scripts/migrate.ts`.
4. Seed Roshal users and storefront content with `bun run scripts/seed-users.ts`.
5. Start the app with `bun run dev`.

## Turso Setup

Run these inside WSL or any shell where the Turso CLI is authenticated:

```bash
turso auth login
turso db create roshal-organic
turso db show roshal-organic
turso db tokens create roshal-organic
```

Then place the returned database URL and auth token into the env files listed above.

## Demo Accounts

All seeded demo users use password `password`.

- `admin@gmail.com`
- `user@gmail.com`

## Available Scripts

```bash
bun run dev
bun run build
bun run start
bun run format
bun run lint
bun run scripts/migrate.ts
bun run scripts/seed-users.ts
```

## Delivery Notes

- The Roshal storefront and admin CMS flow are implemented in the root app.
- The old root-level `marketting` source app has been removed after transplanting its landing page, header/footer shell, and mobile bottom navigation into the active storefront.
- Temporary manual verification is in place for wallet payments and can be managed from `/dashboard/payments` and `/dashboard/orders`.
- AamarPay is the active live gateway abstraction for `card`, `bkash`, `nagad`, `rocket`, and `upay` when its merchant credentials are configured.
- Gateway-mode checkout currently falls back to manual admin follow-up for any payment option whose live gateway path is not configured yet.
- The local env files now point at the real `roshal-organic` Turso database instead of the old Quadra database.
- `.env.production` now expects your final live domain in `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL`; those should match the actual deployed Roshal storefront URL before go-live.
- Checkout is now server-authoritative: the client submits delivery/payment details plus product ids and quantities, while the server recomputes order items, subtotal, delivery, and total from live product/payment settings.
- Inventory is now transactionally updated with orders, so product stock is reserved at checkout time and restored if an order is later cancelled from the dashboard.
- Roshal admin pages now perform admin checks in the page layer as well as the shared dashboard layout, matching the safer Next.js authorization pattern for App Router pages.
- Global toast feedback is now mounted in the root app shell, so checkout, login, dashboard settings, and media-upload actions all surface visible status/error messages.
- `/dashboard/pages` now includes a higher-level homepage control center on top of the raw page/section editor, using React Query for live CMS reads and Zustand for operator workspace state.
- Homepage sections can now be enabled or disabled directly from the dashboard through a DB-backed API without changing the storefront code or opening raw JSON first.
- The homepage page editor now exposes a section map and inline guidance for the landing-page section keys that drive the copied marketing UI.
- Generic marketing pages now resolve their product sections from the live catalog using dashboard section settings, so custom/about/contact pages can reuse the same CMS product-block model instead of a hardcoded featured-only fallback.
- Public storefront routes now bypass the auth proxy entirely, which removes unnecessary session lookups from `/`, `/about`, `/products`, and other public pages.
- Public metadata is now aligned to Roshal Organic instead of the old Quadra identity, including sitemap and robots output for live marketing/product routes.
- The transplanted marketing landing shell was visually smoke-checked locally at `http://localhost:3000/` in desktop and mobile-sized viewports after the copy/removal pass.
- The leftover static `/collections` template page has been retired from the client-facing surface and now routes customers to the real `/products` catalog instead.
- The Roshal dashboard now blocks reserved storefront slugs (`collections`, `payment-return`, etc.), duplicate marketing-page slugs, duplicate section keys, duplicate product slugs/SKUs, and negative inventory/pricing with clear inline errors instead of raw database failures.
- A new `.env.example` now documents the required Roshal auth, Turso, upload, and AamarPay gateway keys so the app can be configured for local or production deployment without guessing hidden env names.
- The login page now frames auth as a customer ecommerce account flow, with responsive trust/checkout messaging and clearer separation between customer sign-up and admin-assigned access.
- Admin login now uses the Better Auth client flow with a full redirect after success, so `/dashboard` and other protected admin routes see the fresh session cookie immediately after sign-in.
- Real production gateway credentials and the final production domain still need to be provisioned per environment before go-live.
