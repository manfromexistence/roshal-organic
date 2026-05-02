# UI.md - Client Preference Playbook

Last updated: 2026-05-02

This file documents the UI taste this client has repeatedly approved or requested for the Roshal Organic project. It is not a universal "best UI" guide. When this client work conflicts with a modern Vercel/shadcn SaaS instinct, use this file as the source of truth so future pages start closer to what the client actually wants.

## Executive Summary

- Prefer familiar Bangladesh ecommerce patterns over abstract, premium, or editorial layouts.
- Use compact, information-dense sections. The client usually sees large whitespace as wasted space.
- Match the GhorerBazar-style mental model when the client says "good UI": compact cards, clear menus, visible categories, simple checkout.
- Keep storefront pages simple. Too many sections make the site feel complex to the client.
- Keep dashboard pages operational. Show the main metric cards, filters, tables, and forms; hide secondary insight panels behind accordions or remove them from the visible flow.
- Use real images, logos, icons, and data. The client dislikes blank placeholders and dummy-looking UI.
- Make mobile first in a practical way: no overlap, no duplicate controls, no hidden important category/menu actions, and no text squeezing.

## Client Taste Profile

The client is not asking for a "Vercel landing page" aesthetic. They prefer a local ecommerce interface that feels familiar to buyers and easy for store staff.

They usually like:

- Compact cards with clear product/category images.
- Light green or brand-green surfaces.
- Big, readable logo treatment.
- Visible category navigation.
- Direct labels instead of subtle UI.
- Forms that look short and finish inside one screen when possible.
- Tables and dashboard views that show the latest and most useful data first.
- Clear save/delete/export feedback.

They usually dislike:

- Large empty space.
- Oversized cards.
- Long line-height inside product cards.
- Too many homepage product sections.
- Hidden mobile category navigation.
- Duplicate cart/search controls on mobile.
- Large dashboard insight panels that are not needed for daily work.
- Abstract marketing copy that feels AI-generated.
- Blank image boxes and placeholder-looking sections.

## Storefront Rules

### Header And Navigation

- Keep language switching visible and readable. Use larger, bold `ENG` and `Bangla` labels.
- On desktop, the top bar may hide while scrolling down, but the category menu should remain visible.
- On scroll up, the top bar should return smoothly.
- On mobile, category navigation should stay directly reachable on screen. Do not bury important categories only under `More`.
- If the mobile bottom bar already has Cart, remove Cart from the mobile top header.
- Submenus should be simple list-style dropdowns. Avoid large card-based mega menus that break or feel heavy.

### Logo

- The logo must be visually clear, even if that means making it larger than a typical refined header logo.
- If a circular or shaped logo background makes the logo text unreadable, reduce that shape or use a cleaner logo version.
- Do not treat the logo as a tiny nav decoration. The client judges brand quality by logo readability.

### Search And Banners

- Desktop search is acceptable, but mobile top search can feel redundant and may need removal.
- Avoid showing two competing mobile banners.
- If there is a right-side banner on desktop, keep it stable/fixed in the layout instead of making every banner feel like a carousel.
- Banner content should be practical and product/store related, not abstract.

### Homepage Sections

- Fewer sections are better for this client.
- Avoid stacking many similar product sections such as Fresh Picks, Organic Picks, Today Best Picks, and Special Picks unless the client explicitly asks.
- Product cards should be short enough that a desktop viewport can show a full card comfortably.
- Reduce excess product-card line spacing.
- Product card images should not feel tiny.
- Remove rating/review clutter when it makes cards taller.
- Featured category cards should be centered, compact, and close to the GhorerBazar card style.
- Special-offer cards must stack or reflow before text starts covering images or other text.
- Brand cards should use less inner padding so the logo/image fills the container better.
- Testimonials should be small. Do not let customer-comment cards fill a whole screen.

### Footer

- Keep the footer small and simple.
- Remove Payment Methods if the client says it is unnecessary.
- Remove Company Info and category lists when they duplicate top navigation.
- Keep only useful contact, WhatsApp/Facebook, and policy links.
- Add enough bottom padding so the footer does not collide with mobile browser chrome or bottom navigation.

### About, Contact, And Policy Pages

- Use compact page sections with readable but not huge headings.
- Contact cards should be small enough to fit within one screen on desktop when possible.
- Use direct business facts instead of generic AI-style brand descriptions.
- Privacy Policy and Terms pages should keep useful cards only. Remove excess explanatory blocks.

## Auth And Form Rules

### Login

- Login should feel close to GhorerBazar, but without the left OTP login section.
- Use a compact centered card.
- Keep the full login/register area within one screen when possible.
- Use a Sign In / Sign Up tab system.
- Remove extra explanation text that pushes the form down.

### Sign Up

Use these fields:

- Full Name.
- Mobile.
- Email, optional.
- Address.
- District dropdown.
- Thana dropdown.
- Password, minimum 6 characters.

Behavior rules:

- Mobile number must be local Bangladesh format only: `017XXXXXXXX`.
- Do not include `+880` in the actual input value or placeholder.
- Validate mobile number inline beside the mobile field, not at the top of the form.
- District and Thana must be selectable dropdowns.
- District and Thana options should be sorted ascending.
- Do not auto-fill the wrong district, thana, or mobile number.
- On mobile, District and Thana should stay clean and not wrap awkwardly.

## Checkout Rules

- Checkout should be compact and familiar, close to the GhorerBazar flow.
- Remove unnecessary helper copy such as browser autofill/current location instructions.
- Remove postal code if the client does not need it.
- Remove address line 2.
- Require District and Thana.
- Use radio selection for Home Delivery vs Office Delivery.
- Office Delivery copy should clearly explain that the customer collects from the courier branch office.
- Payment method selection should not use large cards that consume too much space.
- Payment number copy should say `Send Money (personal)` where relevant.
- Screenshot proof upload is not needed.
- Stockout products must not be orderable.
- Phone and address should auto-fill from the user profile when available.
- Order completion errors must be visible and actionable.

## Dashboard Rules

The dashboard should feel like a store-management tool, not a marketing SaaS analytics product.

### Page Structure

- Keep only important visible content:
  - Top metric cards.
  - Primary filters.
  - Primary table.
  - Main create/edit form.
- Hide secondary sections inside accordions or comment them out if they overwhelm the client.
- Avoid showing many insight panels, charts, or guidance cards by default.
- Latest records should appear on top where that matches admin expectations.

### Dashboard Cards

- Top metric cards should use the compact dashboard overview size.
- Cards should be consistent across Orders, Products, Categories, Users, Marketing, Payments, and Settings.
- Avoid one full-width metric card per row when two compact cards can fit.
- Keep padding tight and text wrapping safe.
- Card contents must not overflow in Bangla or English.

### Dashboard Spacing

- Do not add broad page padding that reduces the usable dashboard height.
- Put top and side spacing on the actual content wrapper, not on a container that creates a fake bottom gap.
- Add only a small bottom buffer, such as `pb-4`, so the page does not feel cut off.
- On reload, spacing should remain stable.

### Sidebar

- The selected menu item must have a clear active background.
- Expanded sidebar state must not cut off the right side of the page.
- Keep the Marketing sidebar list short for handoff:
  - Home.
  - About.
  - Contact.
  - Terms & Conditions.
  - Privacy Policy.
- Hide or comment out extra marketing pages unless the client asks for them.

### Marketing CMS Dashboard

- CMS page sections should be accordions by default.
- Section maps and advanced controls can be hidden/commented out.
- Image previews should be small, but not blank.
- Existing preset images should show when no custom image is uploaded.
- Toggle buttons must persist and affect the live storefront.

## Admin Functionality Expectations

### Orders

- Every important column needs real filtering, not only ascending/descending sorting.
- Search must work by order number and mobile number.
- Summary cards need paid and unpaid amount totals.
- Date range filters must include `All time`.
- Summary cards must update when the date range changes.
- Delivery type selected during checkout must appear in the order table.
- Order number format should be `RO-YYMMDD123`, for example `RO-260430123`.

### Overview

- Total revenue should count delivered order amounts only.
- Overview cards should link to their related detail pages.
- Cards should show live, valid data.

### Payments

- Admin must be able to add, remove, enable, disable, and reorder payment providers.
- Cash On Delivery must be supported.
- Delivery charges need two editable zones:
  - Inside Dhaka.
  - Outside Dhaka.
- If a user selects Dhaka district, checkout should use the Inside Dhaka charge.
- Any other district should use the Outside Dhaka charge.
- Save actions need clear confirmation messages.

### Users

- Show user data in proper columns.
- Search by mobile number.
- Add real filters such as District.
- Delete must actually delete or clearly anonymize/fallback-delete the user.
- Excel export must work.
- PDF export must work.

### Marketing Pages

- Section disable toggles must persist.
- Disabled sections must not show on the homepage.
- Only show the key handoff pages unless the client asks for more.

### New Order Email

- New orders should send an email notification to `roshalorganic@gmail.com`.
- Email copy should include order number, customer, phone, delivery type, payment method, items, and totals.

## Component And Style Defaults

- Use shadcn/ui components for forms, buttons, selects, accordions, dialogs, tabs, and date inputs.
- Use the project data-table for admin tables.
- Style shadcn components compactly for this client; do not use oversized default marketing cards.
- Prefer `rounded-md` and simple borders over very soft, oversized SaaS cards.
- Use theme tokens instead of hardcoded colors.
- Use brand green and light green surfaces where appropriate.
- Use Lucide icons in buttons and actions when an icon makes the control easier to scan.
- Use real assets and real database data whenever possible.

## Anti-Patterns For This Client

- Large Vercel-style hero sections with a lot of empty space.
- Editorial layouts that look beautiful but do not show many products/actions.
- One-note abstract gradients or decorative backgrounds.
- Big cards inside big cards.
- Too many homepage product shelves.
- Product cards where text spacing makes the card tall.
- Mobile UI with duplicate cart/search controls.
- Hidden category menus.
- Dashboard pages filled with secondary panels before the main table.
- Blank image placeholders.
- Dummy UI that is not wired to real behavior.
- Native raw inputs where shadcn inputs/selects/date pickers should be used.

## Practical Starting Templates

### Storefront Home

1. Compact header with clear logo, language switcher, search where useful, and visible categories.
2. Simple hero/banner area.
3. Featured categories with centered compact cards.
4. One or two main product shelves.
5. Special offers, responsive and compact.
6. Brand logos with low padding.
7. Optional small testimonials.
8. Compact footer with contact and policy links.

### Dashboard List Page

1. Title and one or two primary actions.
2. Compact metric cards.
3. Filters/search.
4. Main data table.
5. Advanced or secondary controls inside an accordion.

### Dashboard Create/Edit Page

1. Short primary fields first.
2. Category/subcategory selects before optional details.
3. Image upload with a small preview.
4. Optional SEO/advanced fields collapsed.
5. Clear save confirmation.

## Client Acceptance Checklist

Before showing the client:

- Check 360px, 390px, 430px, tablet, and desktop widths.
- Confirm there is no horizontal body overflow.
- Confirm no card text overlaps or escapes its container.
- Confirm product/category images are not too small.
- Confirm the logo is readable.
- Confirm the mobile header has no duplicate cart action if the bottom bar has Cart.
- Confirm category navigation is easy to find on mobile.
- Confirm dashboard metric cards are compact and consistent.
- Confirm dashboard pages show the main table/form without excessive panels first.
- Confirm all toggles and saves show feedback.
- Confirm no dummy UI, placeholder image boxes, or fake data are visible.

## Decision Rule

For this client, "good UI" means clear, familiar, compact, and functional before it means premium, spacious, or trendy. Start from that rule and the future revisions should be smaller.
