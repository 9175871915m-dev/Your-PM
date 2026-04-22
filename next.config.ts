import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  experimental: {},
  serverExternalPackages: [],
  turbopack: {
    root: path.resolve(__dirname),
  },
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/index.html",
      },
    ];
  },
};

export default nextConfig;
