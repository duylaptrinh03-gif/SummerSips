import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      // Backend dev server chạy localhost
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/**",
      },
      // Backend production (HTTPS)
      // TODO: Thay "**" bằng hostname cụ thể của production backend để an toàn hơn
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
