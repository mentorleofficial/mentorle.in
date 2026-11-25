import type { MetadataRoute } from "next";
import { SITE_URL } from "@/data/site";
import { getEventSitemapEntries } from "@/lib/events/queries";
import { getMentorSlugs } from "@/lib/mentors/queries";
import { APP_ROUTES } from "@/lib/seo/app-routes.generated";
import { DEFAULT_RANK, EVENT_RANK, MENTOR_RANK, ROUTE_RANK, isPrivateRoute } from "@/lib/seo/routes";

// Generated, nothing to keep up to date by hand:
// - pages: every static page in src/app (scripts/generate-routes.mjs lists them before each dev/build), minus the
//   private ones in src/lib/seo/routes.ts;
// - mentors and events: live from the platform's database, cached for minutes like the pages, so a new mentor or
//   event appears here within minutes without a deploy.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [mentors, events] = await Promise.all([getMentorSlugs().catch(() => []), getEventSitemapEntries().catch(() => [])]);
  const pages = APP_ROUTES.filter((path) => !isPrivateRoute(path)).map((path) => ({
    url: `${SITE_URL}${path === "/" ? "" : path}`,
    ...(ROUTE_RANK[path] ?? DEFAULT_RANK),
  }));
  return [
    ...pages.sort((a, b) => b.priority - a.priority),
    ...mentors.map((slug) => ({ url: `${SITE_URL}/mentors/${encodeURIComponent(slug)}`, ...MENTOR_RANK })),
    ...events.map(({ slug, updatedAt }) => ({
      url: `${SITE_URL}/events/${encodeURIComponent(slug)}`,
      ...(updatedAt ? { lastModified: new Date(updatedAt) } : {}),
      ...EVENT_RANK,
    })),
  ];
}
