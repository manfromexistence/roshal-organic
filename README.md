# Roshal Organic

Roshal Organic is a bilingual Bangla/English ecommerce CMS built on Next.js 16, Bun, Drizzle, Turso, Better Auth, and shadcn/ui. The public site is storefront-first, while `/dashboard` is the admin control panel for products, orders, users, marketing pages, theme settings, and payment-guide management.

## Current Surface

- Storefront routes: `/`, `/about`, `/contact`, `/products`, `/products/[slug]`, `/cart`, `/checkout`, `/orders`, `/orders/[id]`, `/profile`
- Default CMS marketing/support routes: `/company-information`, `/support-center`, `/how-to-order`, `/faq`, `/payment`, `/shipping`, `/happy-return`, `/refund-policy`, `/cancellation`, `/roshal-stories`, `/terms-and-conditions`, `/privacy-policy`, `/careers`, `/pre-order`
- The live storefront shell at `/` now uses the transplanted landing/header/footer treatment from the former root-level `marketting` app
- Custom CMS marketing routes: `/(marketing)/[slug]` for additional published pages created from the dashboard
- Admin routes: `/dashboard`, `/dashboard/products`, `/dashboard/categories`, `/dashboard/orders`, `/dashboard/payments`, `/dashboard/users`, `/dashboard/pages`, `/dashboard/theme`
- Auth roles: `admin`, `user`
- Languages: Bangla and English
- Payment options: dashboard-configured providers, seeded by default with `cash_on_delivery`, `card`, `bkash`, and `nagad`
- Wallet reference flow: enabled manual providers with a payment number can collect transaction ID plus sender number; no screenshot proof is required
- Checkout enforcement: pricing, delivery fee, enabled payment methods, wallet-reference requirements, and inventory are validated on the server before an order is created
- Payment-review workflow now follows each payment option's dashboard-configured mode, so manual/gateway changes affect order intake correctly
- Gateway-mode checkout now makes the template limitation explicit: until a real processor is wired, `card` orders fall back to admin follow-up instead of pretending a live gateway exists
- Inventory movement: confirmed order creation reserves stock in the database, and cancelled orders restore stock through the admin order workflow
- Cart and checkout now reconcile persisted cart items against the live published catalog, reducing stale-quantity checkout failures for returning users
- Storefront product discovery: URL-synced search, sticky category/price sidebar filters, mobile filter sheet, and sort controls on `/products`
- Shared scroll chrome: the storefront shell, horizontal category/footer rails, and reusable data tables now use the project `ScrollArea` scrollbar treatment instead of raw native overflow
- Storefront responsiveness: the shared marketing shell, homepage carousels/shelves, and product-details layout are width-constrained for mobile and tablet storefront browsing instead of leaking horizontal overflow
- Customer order history now includes search, status filtering, and summary metrics on `/orders`
- Account UX: `/profile` now includes order metrics, recent orders, quick links back to cart/order history/admin, and a working storefront logout control
- Customer order pages now show itemized line items, delivery details, payment reference details, payment verification timestamps, and admin/tracking notes instead of only top-level status badges
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
- Storefront taxonomy from `/dashboard/categories`, including category and subcategory creation that now drives header navigation, homepage category rails, footer "Shop By" links, and `/products` filters
- Homepage landing composition through a dedicated control center that maps live section keys, supported `stylesJson` rules, and section visibility to the current storefront landing page
- Creation of new marketing pages and new sections directly from the dashboard, including media uploads and live storefront links for published pages
- Built-in support/information/policy pages such as Support Center, How to Order, FAQ, Payment, Shipping, Return/Refund, Stories, Terms, Privacy, Careers, and Pre-Order, all editable from the same dashboard page editor
- Generic marketing-page sections now honor dashboard `stylesJson` product sourcing (`featured`, `all`, `reverse`, `limit`, `offset`) instead of falling back to a fixed featured-product slice
- Safe fallback merging for the built-in home/about/contact CMS pages and sections, so partial dashboard edits do not wipe out the rest of the default storefront composition
- Storefront brand settings such as CTA labels, hero layout, card style, spacing, and contact information
- Payment provider add/remove controls, enablement, instructions, merchant/account details, and wallet reference guidance
- New-order email notifications to `roshalorganic@gmail.com` through Resend or SMTP/Nodemailer configuration

## Environment Variables

Set these in `.env`, `.env.local`, and `.env.production` as needed:

```env
DATABASE_URL=libsql://your-turso-db-url
DATABASE_AUTH_TOKEN=your-turso-auth-token
BETTER_AUTH_SECRET=your-better-auth-secret
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
ROSHAL_PAYMENT_GATEWAY_PROVIDER=aamarpay
ROSHAL_PAYMENT_GATEWAY_METHODS=card,bkash,nagad
AAMARPAY_SANDBOX=true
AAMARPAY_BASE_URL=https://sandbox.aamarpay.com
AAMARPAY_STORE_ID=your-aamarpay-store-id
AAMARPAY_SIGNATURE_KEY=your-aamarpay-signature-key
IMGBB=your-imgbb-api-key
IMGBB_API_KEY=your-imgbb-api-key
CATBOX_USERHASH=optional-catbox-userhash
RESEND_API_KEY=optional-resend-api-key
ROSHAL_ORDER_NOTIFICATION_EMAILS=roshalorganic@gmail.com
ROSHAL_ORDER_EMAIL_FROM="Roshal Organic <orders@your-domain.com>"
SMTP_SERVICE=gmail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-or-app-password
SMTP_FROM="Roshal Organic <your-smtp-user@gmail.com>"
```

`RESEND_API_KEY` is preferred when configured. Without Resend, the app uses
Nodemailer with `SMTP_URL`/`NODEMAILER_SMTP_URL` or the `SMTP_*` variables
above. Email volume is limited by the chosen SMTP provider.

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
- The live component tree is now reduced to the active app-facing groups: `components/dashboard`, `components/data-table`, `components/marketing`, `components/providers`, `components/shared`, `components/storefront`, and `components/ui`.
- The legacy Quadra EDMS route tree and namespaces have been removed from the live app surface; the current code now lives under generic shared locations such as `components/dashboard`, `components/storefront`, `components/shared`, `lib/store-*`, `actions/admin.ts`, and `/api/{cms,orders,payments,upload}`.
- The old root-level `marketting` source app has been removed after transplanting its landing page, header/footer shell, and mobile bottom navigation into the active storefront.
- Manual wallet reference review is in place for configured manual payment providers and can be managed from `/dashboard/payments` and `/dashboard/orders`.
- Inside/outside Dhaka delivery charges and the free-delivery threshold are dashboard-managed and are recomputed on the server during checkout.
- AamarPay is the active live gateway abstraction for `card`, `bkash`, and `nagad` when its merchant credentials are configured.
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
- The public catalog now merges dashboard-managed product overrides with the built-in Roshal defaults instead of treating the database as an all-or-nothing source, so the full fallback catalog remains visible until explicitly overridden or unpublished from the dashboard.
- The default runtime theme now boots into a Roshal-organic dark preset with the storefront green as the primary accent across both the public shop and the dashboard, instead of falling back to the older neutral template colors.
- The storefront shell and reusable data tables now route their scrolling through the shared `ScrollArea` component, and the dashboard user/organization avatars now render as letter fallbacks instead of template image placeholders.
- The theme mode and theme-state storage keys are now Roshal-specific, so older template-era blue theme preferences no longer win by default in returning browsers.
- Public storefront routes now bypass the auth proxy entirely, which removes unnecessary session lookups from `/`, `/about`, `/products`, and other public pages.
- Public metadata is now aligned to Roshal Organic instead of the old Quadra identity, including sitemap and robots output for live marketing/product routes.
- The transplanted marketing landing shell was visually smoke-checked locally at `http://localhost:3000/` in desktop and mobile-sized viewports after the copy/removal pass.
- The leftover static `/collections` template page has been retired from the client-facing surface and now routes customers to the real `/products` catalog instead.
- The Roshal dashboard now blocks reserved storefront slugs (`collections`, `payment-return`, etc.), duplicate marketing-page slugs, duplicate section keys, duplicate product slugs/SKUs, and negative inventory/pricing with clear inline errors instead of raw database failures.
- A new `.env.example` now documents the required Roshal auth, Turso, upload, and AamarPay gateway keys so the app can be configured for local or production deployment without guessing hidden env names.
- The login page now frames auth as a customer ecommerce account flow, with responsive trust/checkout messaging and clearer separation between customer sign-up and admin-assigned access.
- Admin login now uses the Better Auth client flow with a full redirect after success, so `/dashboard` and other protected admin routes see the fresh session cookie immediately after sign-in.
- Real production gateway credentials and the final production domain still need to be provisioned per environment before go-live.
