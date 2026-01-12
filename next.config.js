/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true, // Temporarily ignore errors during migration
  },
  turbopack: {}, // Empty config to silence Turbopack warning in Next.js 16
};

module.exports = withPWA(nextConfig);
