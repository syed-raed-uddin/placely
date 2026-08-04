/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/dashboard.html',
        destination: '/dashboard',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
