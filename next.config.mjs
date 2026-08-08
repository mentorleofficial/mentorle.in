// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   eslint: {
//     // Warning: This allows production builds to successfully complete even if
//     // your project has ESLint errors.
//     ignoreDuringBuilds: true,
//   },
// };

// export default nextConfig;

import withBundleAnalyzer from "@next/bundle-analyzer";

const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        source: "/login",
        destination: "https://platform.mentorle.in",
        permanent: true,
      },
      {
        source: "/signup",
        destination: "https://platform.mentorle.in",
        permanent: true,
      },
      {
        source: "/forgot-password",
        destination: "https://platform.mentorle.in",
        permanent: true,
      },
      {
        source: "/reset-password",
        destination: "https://platform.mentorle.in",
        permanent: true,
      },
      {
        source: "/become-mentor",
        destination: "https://platform.mentorle.in/become-a-mentor",
        permanent: true,
      },
      {
        source: "/apply-mentor",
        destination: "https://platform.mentorle.in/become-a-mentor",
        permanent: true,
      },
      {
        source: "/dashboard",
        destination: "https://platform.mentorle.in",
        permanent: true,
      },
      {
        source: "/dashboard/:path*",
        destination: "https://platform.mentorle.in",
        permanent: true,
      },
      {
        source: "/subscribe/:path*",
        destination: "https://platform.mentorle.in",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "thumbs.dreamstime.com",
      },
      {
        protocol: "https",
        hostname: "media.licdn.com",
      },
      {
        protocol: "https",
        hostname: "zzocepwobcnmflkewzss.supabase.co",
      },
      {
        protocol: "https",
        hostname: "xykindgwltvgcrcuwmik.supabase.co",
      },
      {
        protocol: "https",
        hostname: "media2.dev.to",
      },
      {
        protocol: "https",
        hostname: "media.dev.to",
      },
      {
        protocol: "https",
        hostname: "dev-to-uploads.s3.amazonaws.com",
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Enable compression
  compress: true,
  // Optimize production builds
  swcMinify: true,
  // Enable static optimization
  output: 'standalone',
  // Optimize fonts
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
};

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})(nextConfig);
