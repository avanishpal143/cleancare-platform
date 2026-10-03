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
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://cleancare-platform.onrender.com/api',
    NEXT_PUBLIC_CUSTOMER_URL: process.env.NEXT_PUBLIC_CUSTOMER_URL || 'https://cleancare-platform.vercel.app',
    NEXT_PUBLIC_DRIVER_URL: process.env.NEXT_PUBLIC_DRIVER_URL || 'https://cleancare-driver.vercel.app',
    NEXT_PUBLIC_ADMIN_URL: process.env.NEXT_PUBLIC_ADMIN_URL || 'https://cleancare-admin-six.vercel.app',
    NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
  },

};

module.exports = nextConfig;
