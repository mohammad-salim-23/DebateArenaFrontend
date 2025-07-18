// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */

// };

// export default nextConfig;

// next.config.js

/** @type {import('next').NextConfig} */

const nextConfig: import('next').NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Allows all domains
      },
    ],
  },
};

export default nextConfig;
