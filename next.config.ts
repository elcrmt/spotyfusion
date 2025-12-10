/**
 * SpotyFusion - Next.js Configuration
 *
 * @see https://nextjs.org/docs/app/api-reference/next-config-js
 */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Enable React Compiler for better performance
   */
  reactCompiler: true,

  /**
   * Image domains for next/image
   * Add Spotify CDN domains for album art, artist images, etc.
   */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.scdn.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "mosaic.scdn.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "thisis-images.scdn.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "wrapped-images.spotifycdn.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
        pathname: "/**",
      },
    ],
  },

  /**
   * Environment variables validation (optional)
   * Uncomment to enforce required env vars at build time
   */
  // env: {
  //   NEXT_PUBLIC_SPOTIFY_CLIENT_ID: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
  // },
};

export default nextConfig;
