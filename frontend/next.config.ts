import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    forceSwcTransforms: true, // Forces Next.js to use SWC even if Babel is present
  },
};

export default nextConfig;

