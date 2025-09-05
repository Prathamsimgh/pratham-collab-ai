import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Explicitly set Turbopack root to avoid multi-lockfile workspace inference issues
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
