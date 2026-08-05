/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // Legacy PWA redirect — users who installed the old PWA
      {
        source: '/dashboard.html',
        destination: '/dashboard',
        permanent: true,
      },
      // Legacy full HTML dashboard redirect
      {
        source: '/legacy-dashboard.html',
        destination: '/dashboard',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
