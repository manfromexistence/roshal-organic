import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Roshal Organic - খাঁটি স্বাদের আসল ঠিকানা",
    short_name: "Roshal Organic",
    description: "খাঁটি স্বাদের আসল ঠিকানা - ১০০% প্রাকৃতিক ও অর্গানিক খাদ্য ব্র্যান্ড",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#183720",
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
