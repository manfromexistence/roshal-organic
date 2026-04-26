import type { MetadataRoute } from "next";
import { getRoshalAbsoluteUrl } from "@/lib/roshal/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/login", "/dashboard", "/checkout", "/orders", "/profile"],
      },
    ],
    sitemap: getRoshalAbsoluteUrl("/sitemap.xml"),
  };
}
