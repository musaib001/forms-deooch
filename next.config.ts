import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hide the Next.js dev-tools indicator badge (the "N" overlay in dev).
  devIndicators: false,

  // Baseline security headers — HSTS already comes from the platform, these
  // three were missing. frame-ancestors via CSP rather than X-Frame-Options so
  // public /f/<slug> forms can be made embeddable later without swapping
  // mechanisms.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
        ],
      },
    ];
  },
};

export default nextConfig;
