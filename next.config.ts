import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "placehold.co" },
    ],
  },
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
