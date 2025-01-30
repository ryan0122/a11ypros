import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/:slug",
        destination: "/pages/:slug", // Maps clean URLs to the dynamic `[slug]` route
      },
    ];
  },
};

export default nextConfig;
