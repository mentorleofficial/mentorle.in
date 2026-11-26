import type { MetadataRoute } from "next";

// What search engines may see. Shared by src/app/robots.ts (Disallow) and src/app/sitemap.ts (left out).
// A new page is public, and in the sitemap, unless it's listed here.

// Signed-in, mid-flow and one-off pages. Prefixes: "/payments/" covers /payments/status.
export const PRIVATE_ROUTES = ["/api/", "/account", "/sessions", "/onboarding", "/payments/", "/pay-return", "/reset-password", "/forgot-password", "/live", "/jobs/"];

export const isPrivateRoute = (path: string) =>
  PRIVATE_ROUTES.some((route) => (route.endsWith("/") ? path.startsWith(route) || `${path}/` === route : path === route || path.startsWith(`${route}/`)));

type Frequency = NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
type Rank = { priority: number; changeFrequency: Frequency };

// How important each page is. Pages not listed get DEFAULT_RANK.
export const ROUTE_RANK: Record<string, Rank> = {
  "/": { priority: 1, changeFrequency: "weekly" },
  "/mentors": { priority: 0.9, changeFrequency: "daily" },
  "/events": { priority: 0.9, changeFrequency: "daily" },
  "/pricing": { priority: 0.8, changeFrequency: "monthly" },
  "/offers": { priority: 0.8, changeFrequency: "weekly" },
  "/become-a-mentor": { priority: 0.7, changeFrequency: "monthly" },
  "/community": { priority: 0.7, changeFrequency: "monthly" },
  "/enterprise": { priority: 0.6, changeFrequency: "monthly" },
  "/speaker-hub": { priority: 0.6, changeFrequency: "monthly" },
  "/speaker-hub/request": { priority: 0.4, changeFrequency: "yearly" },
  "/signup": { priority: 0.4, changeFrequency: "yearly" },
  "/login": { priority: 0.3, changeFrequency: "yearly" },
  "/privacy": { priority: 0.2, changeFrequency: "yearly" },
  "/terms": { priority: 0.2, changeFrequency: "yearly" },
};

export const DEFAULT_RANK: Rank = { priority: 0.5, changeFrequency: "monthly" };
export const MENTOR_RANK: Rank = { priority: 0.7, changeFrequency: "weekly" };
export const EVENT_RANK: Rank = { priority: 0.6, changeFrequency: "weekly" };
