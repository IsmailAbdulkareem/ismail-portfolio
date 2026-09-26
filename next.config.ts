import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

const nextConfig: NextConfig = {
  images: {
    // Project cover images uploaded to Supabase Storage.
    remotePatterns: supabaseUrl
      ? [new URL("/storage/v1/object/public/**", supabaseUrl)]
      : [],
  },
  experimental: {
    serverActions: { bodySizeLimit: "6mb" },
  },
};

export default nextConfig;
