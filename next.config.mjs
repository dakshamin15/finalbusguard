/** @type {import('next').NextConfig} */
const nextConfig = {
  // Lets a production build run alongside the dev server: NEXT_DIST_DIR=.next-build npm run build
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [390, 640, 768, 1024, 1280, 1440, 1920, 2560],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async redirects() {
    return [{ source: "/impact", destination: "/recognition", permanent: true }];
  },
  poweredByHeader: false,
};

export default nextConfig;
