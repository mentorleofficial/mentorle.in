import type { MetadataRoute } from "next";
import { SITE_URL } from "@/data/site";
import { PRIVATE_ROUTES } from "@/lib/seo/routes";

// Search engines index the public pages; signed-in pages, checkout returns, the event-mode live page, the Huptle
// handoff and the API are kept out (src/lib/seo/routes.ts, shared with the sitemap).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: PRIVATE_ROUTES },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
