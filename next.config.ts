/** @type {import('next').NextConfig} */
const nextConfig = {
  // We need to completely remove the output: 'export' setting
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Temporarily ignore TypeScript errors during build
    ignoreBuildErrors: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;