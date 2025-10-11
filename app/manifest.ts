import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CleanCart - Smart Shopping Solutions",
    short_name: "CleanCart",
    description: "Kenya's premier online marketplace for quality products and supplies",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#22c55e",
    orientation: "portrait",
    categories: ["shopping", "business", "lifestyle"],
    lang: "en",
    dir: "ltr",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  }
}