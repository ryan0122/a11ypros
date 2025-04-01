import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cms.a11ypros.com",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
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
