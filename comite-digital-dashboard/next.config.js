/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // El plan de acción (revistas-nexsteps) lee estas mismas APIs en vivo desde otro dominio.
  async headers() {
    return [{
      source: '/api/:path*',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: '*' },
        { key: 'Access-Control-Allow-Methods', value: 'GET, OPTIONS' },
      ],
    }];
  },
};

module.exports = nextConfig;
