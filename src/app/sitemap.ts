import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Public, indexable marketing/entry routes only. The app itself lives behind
// auth and is disallowed in robots.ts.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/connect`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/signup`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    { url: `${SITE_URL}/login`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
  ];
}
