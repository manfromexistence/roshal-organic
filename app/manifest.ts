import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Roshal Organic",
    short_name: "Roshal",
    description:
      "Roshal Organic storefront for pure honey, ghee, jaggery, seasonal fruits, and natural foods.",
    start_url: "/",
    display: "standalone",
    background_color: "#f8f7f2",
    theme_color: "#1f3d2d",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
