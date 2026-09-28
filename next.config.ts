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
  async redirects() {
    // Old WordPress-era URLs served duplicates of canonical pages.
    return [
      { source: "/home", destination: "/", permanent: true },
      { source: "/pages/home", destination: "/", permanent: true },
      { source: "/pages", destination: "/", permanent: true },
      { source: "/pages/:path*", destination: "/:path*", permanent: true },
    ];
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
