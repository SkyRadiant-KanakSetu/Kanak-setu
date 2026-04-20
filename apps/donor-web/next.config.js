/** @type {import('next').NextConfig} */
const apiUpstream = (process.env.API_UPSTREAM || 'http://127.0.0.1:4000').replace(/\/$/, '');
const nextConfig = {
  async rewrites() {
    return [{ source: '/api/:path*', destination: `${apiUpstream}/api/:path*` }];
  },
};
module.exports = nextConfig;
