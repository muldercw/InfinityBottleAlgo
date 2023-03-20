import type { NextConfig } from "next";

const isStatic = process.env.NEXT_PUBLIC_STORAGE === "local";

const nextConfig: NextConfig = {
  output: isStatic ? "export" : "standalone",
  // Relative asset paths needed for file:// in Electron and Capacitor
  assetPrefix: isStatic ? "./" : undefined,
  typescript: isStatic ? { ignoreBuildErrors: true } : undefined,
};

export default nextConfig;
