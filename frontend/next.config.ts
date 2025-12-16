import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nfinlwbvbsoonbxqflvh.supabase.co',
      },
    ],
  },
};

export default nextConfig;