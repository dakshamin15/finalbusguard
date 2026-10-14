import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BusGuard",
    short_name: "BusGuard",
    description: "Real-time school bus stop-arm violation detection.",
    start_url: "/",
    display: "standalone",
    background_color: "#f3eee6",
    theme_color: "#f3eee6",
    icons: [
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
