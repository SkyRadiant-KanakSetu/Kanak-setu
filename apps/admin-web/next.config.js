/** @type {import('next').NextConfig} */
const path = require('path');
const apiUpstream = (process.env.API_UPSTREAM || 'http://127.0.0.1:4000').replace(/\/$/, '');
module.exports = {
  outputFileTracingRoot: path.join(__dirname, '../..'),
  async rewrites() {
    return [{ source: '/api/:path*', destination: `${apiUpstream}/api/:path*` }];
  },
};
