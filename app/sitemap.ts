import type { MetadataRoute } from "next";
import { site } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/problem", "/technology", "/recognition", "/about", "/contact"];
  return routes.map((r) => ({
    url: `${site.url}${r}`,
    lastModified: new Date("2026-10-14"),
    changeFrequency: "monthly",
    priority: r === "" ? 1 : 0.7,
  }));
}
