import type { MetadataRoute } from 'next';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://hai-nan-deng-xia-xue.onrender.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // 个人中心、后台、接口一律不允许抓取
        disallow: ['/admin', '/admin/', '/user', '/user/', '/api/', '/cart', '/checkout'],
      },
    ],
    host: SITE,
    sitemap: `${SITE}/sitemap.xml`,
  };
}
