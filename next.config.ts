import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  output: "standalone",
  // Pin tracing root to this project so `standalone` output is flat
  // (avoids nesting caused by other lockfiles higher up the tree).
  outputFileTracingRoot: path.join(__dirname),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/kwesiblack/**",
      },
    ],
  },
};

export default nextConfig;
