import type { NextConfig } from "next";

// Mentor photos live in the Supabase project's public storage buckets.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // The legacy site's policy URLs (still linked from old emails and search results) point at the new pages.
  async redirects() {
    return [
      { source: "/privacy-policy", destination: "/privacy", permanent: true },
      { source: "/private-policy", destination: "/privacy", permanent: true },
      { source: "/dpdp-compliance", destination: "/privacy", permanent: true },
      { source: "/terms-of-service", destination: "/terms", permanent: true },
    ];
  },
  images: {
    remotePatterns: supabaseUrl ? [new URL("/storage/v1/object/public/**", supabaseUrl)] : [],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
