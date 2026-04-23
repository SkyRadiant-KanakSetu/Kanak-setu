import type { MetadataRoute } from 'next';

const BASE_URL = 'https://kanaksetu.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/auth', '/profile', '/history', '/receipt/'],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
