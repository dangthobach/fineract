/** @type {import('next').NextConfig} */
const nextConfig = {
  // API proxy for Fineract backend
  async rewrites() {
    return [
      {
        source: '/api/fineract/:path*',
        destination: process.env.FINERACT_API_URL + '/:path*',
      },
    ];
  },
  // Environment variables
  env: {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    FINERACT_API_URL: process.env.FINERACT_API_URL,
  },
};

module.exports = nextConfig;
