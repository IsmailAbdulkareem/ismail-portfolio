import type { MetadataRoute } from "next";
import { SITE_URL } from "@/data/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // AI crawlers are welcome too: the site publishes /llms.txt for them.
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
