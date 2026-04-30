# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Changed
- Simplified the storefront checkout flow so customers can place orders without payment-proof upload, using a cleaner delivery-type and payment selection layout.
- Tightened the homepage merchandising surfaces, product cards, testimonial cards, footer spacing, and floating WhatsApp placement for the client delivery pass.
- Updated the public order-tracking flow to use order number lookup only.
- Upgraded the login and signup surface with real Bangladesh district and thana data, an 11-digit mobile flow, and the requested customer registration fields.

### Fixed
- Restored `cash_on_delivery` into live checkout payment settings for older dashboard payment rows by merging stored `optionsJson` with the current default method set instead of trusting stale DB arrays as complete.
- Preserved dashboard-managed payment labels, numbers, modes, and enabled states while still backfilling newly added payment methods in canonical order.
