// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true, // optional if you want to bypass lint during build
  },
};

export default nextConfig; // <-- use export default
