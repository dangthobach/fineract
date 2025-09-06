/** @type {import('next').NextConfig} */
const nextConfig = {
  // API proxy for Fineract backend
  async rewrites() {
    const fineractApiUrl = process.env.FINERACT_API_URL || 'https://localhost:8443/fineract-provider/api/v1';
    
    return [
      {
        source: '/api/fineract/:path*',
        destination: `${fineractApiUrl}/:path*`,
      },
    ];
  },
  // Environment variables
  env: {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    FINERACT_API_URL: process.env.FINERACT_API_URL || 'https://localhost:8443/fineract-provider/api/v1',
    FINERACT_BASE_URL: process.env.FINERACT_BASE_URL || 'https://localhost:8443/fineract-provider',
    FINERACT_USERNAME: process.env.FINERACT_USERNAME || 'mifos',
    FINERACT_PASSWORD: process.env.FINERACT_PASSWORD || 'password',
    FINERACT_TENANT: process.env.FINERACT_TENANT || 'default',
  },
  // Disable strict mode for development
  reactStrictMode: false,
  // Handle HTTPS certificates for development
  experimental: {
    serverComponentsExternalPackages: ['axios'],
  },
};

module.exports = nextConfig;
