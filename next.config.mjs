// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // This tells Vercel/Next.js to skip ESLint checks during build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
