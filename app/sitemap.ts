import type { MetadataRoute } from "next";
import { getRoshalPages, getRoshalProducts } from "@/lib/roshal/content";
import { getRoshalAbsoluteUrl } from "@/lib/roshal/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pages, products] = await Promise.all([
    getRoshalPages(),
    getRoshalProducts(),
  ]);
  const lastModified = new Date();
  const resolveImageUrl = (value: string | null | undefined) => {
    if (!value) {
      return undefined;
    }

    return value.startsWith("http://") || value.startsWith("https://")
      ? value
      : getRoshalAbsoluteUrl(value);
  };
  const routes: MetadataRoute.Sitemap = [
    {
      url: getRoshalAbsoluteUrl("/"),
      lastModified,
      changeFrequency: "daily" as const,
      priority: 1,
      images: [getRoshalAbsoluteUrl("/logo.png")],
    },
    {
      url: getRoshalAbsoluteUrl("/products"),
      lastModified,
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    ...pages
      .filter((page) => page.status === "published" && page.slug !== "home")
      .map((page) => {
        const imageUrl = resolveImageUrl(page.heroImage);

        return {
          url: getRoshalAbsoluteUrl(`/${page.slug}`),
          lastModified,
          changeFrequency: "weekly" as const,
          priority: page.showInNavigation ? 0.8 : 0.6,
          images: imageUrl ? [imageUrl] : undefined,
        };
      }),
    ...products.map((product) => {
      const imageUrl = resolveImageUrl(product.heroImage);

      return {
        url: getRoshalAbsoluteUrl(`/products/${product.slug}`),
        lastModified,
        changeFrequency: "weekly" as const,
        priority: product.isFeatured ? 0.9 : 0.7,
        images: imageUrl ? [imageUrl] : undefined,
      };
    }),
  ];

  return routes;
}
