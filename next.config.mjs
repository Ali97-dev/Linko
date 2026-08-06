/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow Replit's proxied preview domain
  async headers() {
    return [];
  },
};

export default nextConfig;
