# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Changed
- Removed the marketing auth page OTP panel and tightened the login/sign-up page into a single padded credential/sign-up card.
- Reduced homepage featured-category card size and tightened vertical spacing across the marketing homepage sections.
- Restyled the existing working dashboard shell with the client-preferred mockup cues: stronger sidebar branding, clearer active navigation states, larger sidebar hit areas, and softer hoverable dashboard card/table surfaces.
- Added hover motion plus deterministic chart-token right-edge accents to the dashboard overview metric cards so the admin landing page feels more interactive without changing the current layout.
- Added a reusable shadcn-styled Bangladesh `phone input-2` wrapper and switched the active signup, checkout, profile, and dashboard phone fields over to it.
- Replaced the old storefront phone field package with a ReUI-style `react-phone-number-input` implementation and removed the legacy `react-phone-input-2` dependency.
- Limited the visible payment methods across checkout and dashboard settings to Cash on Delivery, Card, bKash, and Nagad.
- Added compact bKash and Nagad logos to the checkout payment selector and a visible border to the floating WhatsApp chat bubble.
- Simplified the storefront checkout flow so customers can place orders without payment-proof upload, using a cleaner delivery-type and payment selection layout.
- Tightened the homepage merchandising surfaces, product cards, testimonial cards, footer spacing, and floating WhatsApp placement for the client delivery pass.
- Updated the public order-tracking flow to use order number lookup only.
- Upgraded the login and signup surface with real Bangladesh district and thana data, an 11-digit mobile flow, and the requested customer registration fields.
- Restored the non-header marketing homepage sections to the previous committed composition while keeping the current header, sub-header, landing hero, and footer in place.
- Reworked the fixed storefront sub-header to fit categories by viewport width and move overflowed categories into `More` instead of relying on horizontal scrolling.
- Switched the current homepage top-seller section back to a two-column layout on smaller screens and converted the sub-header `More` overflow into category accordions with nested subcategory links.
- Added the seeded `landing-new-arrivals` and `landing-fresh-picks` shelves back onto the homepage so more storefront cards stay driven by the dashboard home-page CMS sections.
- Moved the storefront footer onto the primary brand surface, shifted the dashboard sidebar onto the same primary-led palette, and tightened storefront product-card heights without changing the current layouts.
- Reintroduced compact wallet verification inputs for `bKash`, `Nagad`, and `Rocket` while keeping `Cash on delivery` first and visible in the current checkout flow.
- Replaced the storefront-wide marketing `ScrollArea` shell with native page scrolling and browser scrollbars.
- Ensured every storefront top-level category keeps a dropdown by backfilling one or two fallback submenu items when dashboard subcategories are missing.
- Raised the desktop sub-header and `More` overflow dropdown stacking order so the category popovers stay above the rest of the storefront.
- Swapped the checkout `bKash` and `Nagad` wallet badges over to the real assets from `public/logos`.
- Rebuilt the single product page into a Ghore-Bazar-style gallery, pricing, CTA, details, reviews, and related-products layout that adapts cleanly down to smaller screens.
- Kept the single product page dashboard-driven by sourcing gallery images, pricing, description, highlights, contact actions, and related products from product and site-settings data instead of hardcoded product-page copy.
- Reworked the storefront login and sign-up page into the requested two-panel auth layout while preserving the existing signup fields, redirects, and credential flow.

### Fixed
- Excluded the separate `roshal-organic-dashboard-ui` reference app from the production app lint/typecheck scope so root checks validate the real Roshal app instead of the mockup.
- Removed the dashboard theme-page `500` by stopping the server component from passing a formatter function into the client-side chart card.
- Verified the admin CMS stack end-to-end: every marketing page editor route now responds successfully in the live app, and the shared ImgBB upload endpoint accepted a real image upload used by the dashboard editors.
- Replaced the single product page's dummy review surface with live database-backed ratings, persisted review comments, and a real review submission API for published products.
- Patched checkout validation so missing default catalog rows are backfilled into `roshalProducts` during order creation, preventing valid storefront cart items from failing with `product-unavailable`.
- Filtered legacy Rocket and Upay payment settings out of the live storefront/admin payment configuration so older stored rows no longer make removed methods reappear.
- Restored `cash_on_delivery` into live checkout payment settings for older dashboard payment rows by merging stored `optionsJson` with the current default method set instead of trusting stale DB arrays as complete.
- Preserved dashboard-managed payment labels, numbers, modes, and enabled states while still backfilling newly added payment methods in canonical order.
- Updated the fixed storefront header so the top bar hides on scroll-down while the sub-header remains visible, then both surfaces return on scroll-up.
- Removed duplicated category accordions from the mobile sheet because the fixed sub-header now carries storefront category navigation on mobile as well.
- Replaced homepage placeholder and mojibake copy in the hero, headings, testimonial fallbacks, and top-seller actions so the storefront now shows only real Bangla or English text.
- Unified the storefront taxonomy rail so the same fixed sub-header serves both mobile and desktop instead of maintaining a separate mobile-only category strip.
- Re-applied the Bangla top-seller CTA labels after the homepage section revert so the restored cards do not show mojibake text.
- Removed the checkout customer-comments section, dropped its dead homepage-testimonial data plumbing, and fixed the remaining broken Bangla helper/location labels inside the checkout delivery card.
- Switched the shared image-upload control to a more reliable file-picker trigger so dashboard editors and frontend payment-proof uploads can hit the working ImgBB route again.
- Increased the shared navigation-menu no-viewport popover z-index and the storefront `More` item stack so overflow dropdown content can render above the fixed sub-header instead of underneath it.
- Lowered the fixed storefront sub-header shell to `z-10` while keeping its open dropdown layers above the rest of the page chrome.
