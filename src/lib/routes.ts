// Routes that have a page. Add a route here when its page is built; links to anything else
// skip Next's prefetch, which would otherwise log a 404 in the console for every visible link.
export const BUILT_ROUTES = new Set(["/", "/mentors", "/pricing", "/speaker-hub"]);

export const isBuiltRoute = (href: string) => {
  if (!href.startsWith("/")) return true;
  const path = href.split(/[?#]/)[0] || "/";
  return BUILT_ROUTES.has(path);
};

export const prefetchFor = (href: string) => (isBuiltRoute(href) ? undefined : false);
