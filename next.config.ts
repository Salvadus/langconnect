import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@module-federation/runtime",
    "@module-federation/runtime-core",
    "@module-federation/sdk",
    "@module-federation/error-codes",
  ],
};

export default nextConfig;
