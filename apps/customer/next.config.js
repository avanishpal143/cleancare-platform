/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@cleancare/types', '@cleancare/ui'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.cleancare.app' },
      { protocol: 'https', hostname: 's3.amazonaws.com' },
    ],
  },
  // These are baked in at build time — safe to expose
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
    NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
  },
};

module.exports = nextConfig;
