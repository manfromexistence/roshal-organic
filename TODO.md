# Project Tasks

## In Progress
- [ ] 2026-04-29 23:40 Apply the first client-delivery punch-list across the storefront and dashboard: scroll-aware top bar, simplified footer/contact info, lighter homepage sections, compact checkout/delivery controls, richer signup, public track-order, and stronger category/subcategory dashboard controls.

## Completed
- [x] 2026-04-29 22:28 Restored the desktop storefront sub-header dropdown visibility by removing the clipping overflow and raising the non-viewport navigation-menu stacking context.
- [x] 2026-04-29 22:28 Restarted the local dev server and verified on the homepage that the `Oil & Ghee` submenu opens visibly above the category rail again.
- [x] 2026-04-29 22:02 Completed a browser-led dark-mode contrast audit across storefront, login, product catalog, and dashboard shells, then fixed the shared visibility regressions.
- [x] 2026-04-29 22:02 Strengthened dark-mode storefront/dashboard muted text, made catalog prices readable on dark cards, and fixed the logged-in account/avatar trigger contrast.
- [x] 2026-04-29 21:12 Added shared reveal/hover motion to the CMS-driven marketing/support pages and verified the About/Contact dark-mode presentation in a live browser pass.
- [x] 2026-04-29 21:12 Switched the storefront and dashboard brand text to the JetBrains Mono logo-style font treatment and verified both live.
- [x] 2026-04-29 21:12 Forced the desktop marketing sub-header back to a single row by moving overflow categories into a `More` navigation bucket.
- [x] 2026-04-29 20:36 Installed the local Playwright Chromium bundle under `F:\DevCaches\ms-playwright` and restored browser-based verification for the Roshal storefront/admin without changing the Codex app install.
- [x] 2026-04-29 20:36 Enriched the CMS-managed marketing/support pages (`about`, `contact`, `support-center`, `payment`, `shipping`, `privacy-policy`, `terms-and-conditions`, `faq`) with richer default sections and dashboard editing guidance.
- [x] 2026-04-29 20:36 Verified the upgraded public marketing pages, dashboard page editors, and storefront checkout proof-upload flow in a live browser pass.
- [x] 2026-04-29 18:48 Added a dedicated storefront wordmark font utility and applied it to the marketing header brand text for a more logo-like presentation.
- [x] 2026-04-29 18:48 Completed a live delivery audit covering public marketing routes, seeded auth role routing, admin CMS access, homepage CMS data wiring, and public ImgBB checkout uploads.
- [x] 2026-04-29 18:50 Fixed local checkout order creation by hardening the site-settings schema guard so duplicate `delivery_zones_json` migrations no longer break `/api/orders`.

## Audit Notes
- [ ] Homepage content is largely dashboard-driven, but the homepage layout is still component-structured in code. Admins can edit section copy, images, visibility, product sources, and some style keys, but they cannot fully redesign the homepage composition from the dashboard alone.
- [ ] Public route protection, admin redirects, seeded role access, checkout proof upload, live `/api/orders` creation, customer order pages, and admin order-detail routes are working in the local delivery audit.
- [ ] The richer marketing/support pages are now CMS-backed and editable from `/dashboard/pages/[id]`, but they still follow curated section templates rather than a totally freeform page builder.

## Archived Context
- [ ] Analyze ghorebazar.com layout and features
- [ ] Implement ghorebazar.com style Header & Footer (marketing pages)
- [ ] Redesign Home Page layout to match ghorebazar.com (Hero, Categories, Products)
- [ ] Implement Product Listing Page (Grid, Filters)
- [ ] Implement Product Details Page (Gallery, Description, Add to Cart)
- [ ] Implement Cart & Checkout Flow (Payment options, Order tracking)
- [ ] Implement User Profile & Order History
- [ ] Enhance Admin Dashboard (Add shadcn-ui charts, detailed cards, metrics)
