import { localizedValue } from "./locale";
import type { LocalizedValue } from "./types";

export interface RoshalHomeSectionGuide {
  sectionKey: string;
  label: LocalizedValue;
  summary: LocalizedValue;
  contentHint: LocalizedValue;
  stylesHint: LocalizedValue;
  recommendedTypes: string[];
  styleKeys: string[];
}

export const roshalHomeSectionGuides: RoshalHomeSectionGuide[] = [
  {
    sectionKey: "hero",
    label: localizedValue("Hero banner", "Hero banner"),
    summary: localizedValue(
      "Controls the rotating landing banners without changing the storefront layout.",
      "Controls the rotating landing banners without changing the storefront layout.",
    ),
    contentHint: localizedValue(
      "Use items with title, body, label, href, and imageUrl for each slide.",
      "Use items with title, body, label, href, and imageUrl for each slide.",
    ),
    stylesHint: localizedValue(
      "Keep CTA routing in the page or site settings. This block is primarily content-driven.",
      "Keep CTA routing in the page or site settings. This block is primarily content-driven.",
    ),
    recommendedTypes: ["hero"],
    styleKeys: [],
  },
  {
    sectionKey: "landing-categories",
    label: localizedValue("Category shortcuts", "Category shortcuts"),
    summary: localizedValue(
      "Feeds the home category cards shown under the hero area.",
      "Feeds the home category cards shown under the hero area.",
    ),
    contentHint: localizedValue(
      "Use items with title, href, and imageUrl for each category card.",
      "Use items with title, href, and imageUrl for each category card.",
    ),
    stylesHint: localizedValue(
      "No special style keys are required. Item order controls the storefront order.",
      "No special style keys are required. Item order controls the storefront order.",
    ),
    recommendedTypes: ["feature-grid"],
    styleKeys: [],
  },
  {
    sectionKey: "featured-products",
    label: localizedValue("Featured products", "Featured products"),
    summary: localizedValue(
      "Controls the first product rail on the homepage.",
      "Controls the first product rail on the homepage.",
    ),
    contentHint: localizedValue(
      "This block usually reads from products instead of items. Use page title/body/CTA fields for copy.",
      "This block usually reads from products instead of items. Use page title/body/CTA fields for copy.",
    ),
    stylesHint: localizedValue(
      'Use stylesJson with source, limit, and offset. Example: {"source":"featured","limit":"8"}.',
      'Use stylesJson with source, limit, and offset. Example: {"source":"featured","limit":"8"}.',
    ),
    recommendedTypes: ["featured-products"],
    styleKeys: ["source", "limit", "offset"],
  },
  {
    sectionKey: "landing-top-sellers",
    label: localizedValue("Top sellers", "Top sellers"),
    summary: localizedValue(
      "Usually points to featured or priority products that should sell first.",
      "Usually points to featured or priority products that should sell first.",
    ),
    contentHint: localizedValue(
      "Leave items empty unless you are converting the block to a manual card list.",
      "Leave items empty unless you are converting the block to a manual card list.",
    ),
    stylesHint: localizedValue(
      "Use source=featured for featured catalog items or source=all for the full catalog.",
      "Use source=featured for featured catalog items or source=all for the full catalog.",
    ),
    recommendedTypes: ["featured-products"],
    styleKeys: ["source", "limit", "offset"],
  },
  {
    sectionKey: "landing-new-arrivals",
    label: localizedValue("New arrivals", "New arrivals"),
    summary: localizedValue(
      "Usually surfaces the newest or reverse-sorted products.",
      "Usually surfaces the newest or reverse-sorted products.",
    ),
    contentHint: localizedValue(
      "Use title/body/CTA fields for copy. Product cards are pulled from the catalog.",
      "Use title/body/CTA fields for copy. Product cards are pulled from the catalog.",
    ),
    stylesHint: localizedValue(
      "Use source=reverse plus optional limit and offset to change the slice.",
      "Use source=reverse plus optional limit and offset to change the slice.",
    ),
    recommendedTypes: ["featured-products"],
    styleKeys: ["source", "limit", "offset"],
  },
  {
    sectionKey: "landing-special-offers",
    label: localizedValue("Special offers", "Special offers"),
    summary: localizedValue(
      "Controls the deal cards between the catalog sections.",
      "Controls the deal cards between the catalog sections.",
    ),
    contentHint: localizedValue(
      "Use items with title, body, label, href, imageUrl, and value for the offer badge.",
      "Use items with title, body, label, href, imageUrl, and value for the offer badge.",
    ),
    stylesHint: localizedValue(
      "No required style keys. The items array drives the cards directly.",
      "No required style keys. The items array drives the cards directly.",
    ),
    recommendedTypes: ["feature-grid"],
    styleKeys: [],
  },
  {
    sectionKey: "landing-fresh-picks",
    label: localizedValue("Fresh picks", "Fresh picks"),
    summary: localizedValue(
      "Feeds the first large product grid farther down the homepage.",
      "Feeds the first large product grid farther down the homepage.",
    ),
    contentHint: localizedValue(
      "Use copy fields for heading text. Product rows are sourced from the catalog.",
      "Use copy fields for heading text. Product rows are sourced from the catalog.",
    ),
    stylesHint: localizedValue(
      "Use source=all unless you need a specific featured or reverse slice.",
      "Use source=all unless you need a specific featured or reverse slice.",
    ),
    recommendedTypes: ["featured-products"],
    styleKeys: ["source", "limit", "offset"],
  },
  {
    sectionKey: "landing-organic-picks",
    label: localizedValue("Organic picks", "Organic picks"),
    summary: localizedValue(
      "Feeds the second large product grid and usually highlights featured organic products.",
      "Feeds the second large product grid and usually highlights featured organic products.",
    ),
    contentHint: localizedValue(
      "Use the heading/body fields for section copy and keep items empty for catalog mode.",
      "Use the heading/body fields for section copy and keep items empty for catalog mode.",
    ),
    stylesHint: localizedValue(
      "Use source=featured for curated items. Limit and offset still apply.",
      "Use source=featured for curated items. Limit and offset still apply.",
    ),
    recommendedTypes: ["featured-products"],
    styleKeys: ["source", "limit", "offset"],
  },
  {
    sectionKey: "landing-seasonal-picks",
    label: localizedValue("Seasonal picks", "Seasonal picks"),
    summary: localizedValue(
      "Feeds the last large product grid, usually using reverse or offset catalog slices.",
      "Feeds the last large product grid, usually using reverse or offset catalog slices.",
    ),
    contentHint: localizedValue(
      "Keep content in the heading/body fields. The storefront assigns the visual season labels automatically.",
      "Keep content in the heading/body fields. The storefront assigns the visual season labels automatically.",
    ),
    stylesHint: localizedValue(
      "Use source=reverse with limit and offset to rotate the visible set.",
      "Use source=reverse with limit and offset to rotate the visible set.",
    ),
    recommendedTypes: ["featured-products"],
    styleKeys: ["source", "limit", "offset"],
  },
  {
    sectionKey: "landing-stats",
    label: localizedValue("Trust stats", "Trust stats"),
    summary: localizedValue(
      "Controls the compact trust metrics shown near the bottom of the landing page.",
      "Controls the compact trust metrics shown near the bottom of the landing page.",
    ),
    contentHint: localizedValue(
      "Use items with label/title plus value for each stat tile.",
      "Use items with label/title plus value for each stat tile.",
    ),
    stylesHint: localizedValue(
      "No special style keys are required for this block.",
      "No special style keys are required for this block.",
    ),
    recommendedTypes: ["feature-grid"],
    styleKeys: [],
  },
];

export function getRoshalHomeSectionGuide(sectionKey: string) {
  return (
    roshalHomeSectionGuides.find((guide) => guide.sectionKey === sectionKey) ||
    null
  );
}
