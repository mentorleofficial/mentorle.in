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
    // Mentor avatars are on Supabase (Cloudflare). On some local networks that host resolves to
    // NAT64 addresses (64:ff9b::…), which Next 16's SSRF guard treats as private and blocks.
    // remotePatterns already limits fetches to this project's public storage.
    dangerouslyAllowLocalIP: true,
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
