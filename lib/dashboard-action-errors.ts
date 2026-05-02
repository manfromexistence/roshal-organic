export const dashboardActionErrorMessages: Record<string, string> = {
  "category-not-found": "The selected parent category could not be found.",
  "duplicate-category-key": "Another category is already using this key.",
  "duplicate-product-sku": "Another product is already using this SKU.",
  "duplicate-product-slug": "Another product is already using this slug.",
  "duplicate-section-key": "This page already has a section with that key.",
  "duplicate-slug": "Another marketing page is already using this slug.",
  "duplicate-subcategory-key": "Another subcategory is already using this key.",
  "form-save-failed":
    "The form could not be saved. Please review the required fields and try again.",
  "invalid-category-key":
    "Use only lowercase letters, numbers, and hyphens in category keys.",
  "invalid-product-inventory": "Product inventory cannot be negative.",
  "invalid-product-price": "Product price cannot be negative.",
  "invalid-product-sku": "Product SKU is required.",
  "invalid-product-slug":
    "Use only lowercase letters, numbers, and hyphens in product slugs.",
  "invalid-review": "The selected review could not be found.",
  "invalid-review-comment": "Write a short review before saving.",
  "invalid-review-rating": "Choose a rating between 1 and 5.",
  "invalid-reviewer": "Reviewer name is required.",
  "invalid-section-key":
    "Use only lowercase letters, numbers, and hyphens in section keys.",
  "invalid-section-items":
    "Section items data is invalid. Review the item rows.",
  "invalid-section-styles":
    "Section styles data is invalid. Review the style rows.",
  "invalid-slug":
    "Use only lowercase letters, numbers, and hyphens in page slugs.",
  "invalid-subcategory-key":
    "Use only lowercase letters, numbers, and hyphens in subcategory keys.",
  "missing-category-key": "Category key is required.",
  "missing-category-label": "Add at least one category label before saving.",
  "missing-delete-id": "Select an item before deleting.",
  "missing-order-id": "Select an order before saving status changes.",
  "missing-page-label": "Add at least one navigation label before saving.",
  "missing-page-slug": "Page slug is required.",
  "missing-page-title": "Add at least one page title before saving.",
  "missing-payment-account":
    "Enabled manual wallet providers need an account or merchant number.",
  "missing-payment-label": "Enabled payment providers need a visible label.",
  "missing-payment-options": "Add at least one payment provider before saving.",
  "missing-product-category": "Select a category before saving the product.",
  "missing-product-name": "Product name is required.",
  "missing-product-price": "Product price must be greater than 0.",
  "missing-product-sku": "Product SKU is required.",
  "missing-product-slug": "Product slug is required.",
  "missing-review-comment": "Review comment is required.",
  "missing-review-product": "Select a product before saving the review.",
  "missing-reviewer": "Reviewer name is required.",
  "missing-section-key": "Section key is required.",
  "missing-section-page": "Section page is missing. Reload the editor.",
  "missing-section-type": "Section type is required.",
  "missing-site-brand-name": "Brand name is required.",
  "missing-site-cta-label": "Primary CTA label is required.",
  "missing-subcategory-key": "Subcategory key is required.",
  "missing-subcategory-label":
    "Add at least one subcategory label before saving.",
  "missing-subcategory-parent": "Select a parent category before saving.",
  "missing-user-id": "Select a user before saving changes.",
  "missing-user-name": "Customer name is required.",
  "reserved-slug":
    "This slug conflicts with a system route. Choose a different slug.",
};

export function getDashboardActionErrorMessage(code: string | undefined) {
  if (!code) {
    return "";
  }

  return (
    dashboardActionErrorMessages[code] ||
    "The dashboard action could not be completed. Please review the form and try again."
  );
}
