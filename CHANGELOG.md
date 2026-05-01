# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Changed
- Compared the live dashboard UI against the `roshal-organic-dashboard-ui` reference and normalized page padding, card shells, category-card sizing, and create/settings form cards to better match the client-preferred dashboard mockup.
- Tightened shared dashboard table cards to use borderless shadow shells with flush desktop table content and padded mobile fallback cards.
- Added a functional dashboard system-settings page for brand/contact fields, storefront defaults, and delivery-zone fee controls using the existing site-settings save action.
- Added a dashboard marketing control center that links the live storefront, homepage editor, CMS sections, and marketing pages through real dashboard routes.
- Added dedicated dashboard create pages for categories and subcategories that use the real taxonomy mutation actions and image-upload control.
- Wired the new settings, marketing, category, and subcategory dashboard pages into the sidebar navigation and dashboard search index.
- Updated dashboard metric and insight cards with emoji badges, stronger hover states, right-edge accent borders, and richer supporting text.
- Added compact mobile product cards to the dashboard all-products page while keeping the full data table for larger screens.
- Improved the shared data-table container so dashboard tables keep their content inside a horizontally scrollable surface on smaller screens.
- Reworked the dashboard overview into a cleaner reference-style admin landing page with live store metrics, recent orders, and featured products instead of chart panels.
- Replaced dashboard chart panels across products, orders, categories, users, pages, payments, and storefront settings with non-chart insight cards.
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
- Added horizontal scrollbar support to the dashboard sidebar inset so wide admin tables and editors remain reachable on smaller screens.
- Removed bottom padding from the new-product dashboard editor while preserving top spacing and normal edit-page padding.
- Added the reference-dashboard category management layer with top `New Category` / `New Subcategory` actions, compact category cards, per-category action menus, subcategory chips, and an add-category tile while keeping the existing functional create/edit/delete forms.
- Added reference-style visible action buttons to the dashboard products and marketing pages screens using their existing real create targets.
- Wrapped the dashboard product, order, user, and marketing-page tables in compact reference-style card shells with mobile fallback cards and row action menus.
- Reworked the dashboard product editor into a split reference-style layout with product information, media, content, pricing, organization, and publishing cards while preserving the real save action.
- Restyled the dashboard payment method editor cards with compact status/mode badges around the existing Cash on Delivery, Card, bKash, and Nagad settings.

### Fixed
- Hardened dashboard and checkout image uploads so invalid ImgBB keys and Catbox provider rejection no longer break uploads; small images now fall back to inline data URLs.
- Removed remaining mojibake from order/payment labels, homepage fallback section labels, and storefront contact-card matching so live customer copy stays readable in Bangla and English.
- Fixed dashboard sidebar accordion triggers so clicking a parent section only expands or collapses it instead of navigating to the first child page.
- Reused the real Roshal logo image in the dashboard sidebar organization footer and dropdown so the sidebar header/footer branding matches.
- Fixed the admin sidebar hydration flash where theme state could reset the light-mode sidebar from primary green back to white, and stabilized dashboard accordion menu cursor behavior.
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
- Tightened dashboard category, order detail, marketing page editor, payment settings, user detail, and product editor wrappers so long content wraps instead of overflowing the sidebar inset.
- Replaced the stale `/dashboard/settings/payment` mock page with the real dashboard payment settings page so removed Rocket/file-upload placeholders cannot be reached from that subroute.
