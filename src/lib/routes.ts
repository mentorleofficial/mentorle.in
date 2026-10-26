// Routes that have a page. Add a route here when its page is built; links to anything else
// skip Next's prefetch, which would otherwise log a 404 in the console for every visible link.
export const BUILT_ROUTES = new Set(["/", "/mentors", "/pricing", "/speaker-hub", "/become-a-mentor", "/events", "/enterprise", "/community", "/login", "/signup", "/forgot-password", "/reset-password", "/onboarding", "/privacy", "/terms", "/sessions", "/account", "/payments/status", "/live"]);

// Dynamic routes whose pages exist for every slug (/events/<slug>, /mentors/<slug>).
const BUILT_PREFIXES = ["/events/", "/mentors/"];

export const isBuiltRoute = (href: string) => {
  if (!href.startsWith("/")) return true;
  const path = href.split(/[?#]/)[0] || "/";
  return BUILT_ROUTES.has(path) || BUILT_PREFIXES.some((prefix) => path.startsWith(prefix));
};

export const prefetchFor = (href: string) => (isBuiltRoute(href) ? undefined : false);
