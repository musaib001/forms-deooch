import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Private app surfaces and per-user form links: no SEO value, keep them
      // out of the index.
      disallow: ["/api/", "/dashboard", "/forms", "/settings", "/f/", "/authorize", "/token"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
