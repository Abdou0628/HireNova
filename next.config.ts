import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Allow Caddy reverse proxy (port 81 → 3000) to serve _next resources
  allowedDevOrigins: ["*"],
};

export default nextConfig;
