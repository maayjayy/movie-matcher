import type { NextConfig } from "next";

const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "10.0.0.43:3000"],
    },
  },
  allowedDevOrigins: ["10.0.0.43:3000"],
};

export default nextConfig;