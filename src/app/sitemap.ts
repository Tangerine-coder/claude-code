import type { MetadataRoute } from 'next';
import getDb from '@/lib/db';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://hai-nan-deng-xia-xue.onrender.com';

// 运行时生成，避免构建阶段连接数据库（构建机上没有 TURSO 变量时会卡住）
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE}/categories`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE}/search`, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${SITE}/help`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE}/legal/privacy`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE}/legal/terms`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE}/legal/returns`, changeFrequency: 'yearly', priority: 0.2 },
  ];

  try {
    const db = getDb();

    const categories = await db
      .prepare("SELECT slug FROM categories WHERE parent_id IS NULL ORDER BY sort_order")
      .all<{ slug: string }>();

    const products = await db
      .prepare("SELECT slug, created_at FROM products WHERE status = 'active' ORDER BY created_at DESC LIMIT 500")
      .all<{ slug: string; created_at: string }>();

    return [
      ...staticEntries,
      ...categories.map((c) => ({
        url: `${SITE}/categories/${c.slug}`,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      })),
      ...products.map((p) => ({
        url: `${SITE}/products/${p.slug}`,
        lastModified: p.created_at ? new Date(p.created_at) : undefined,
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      })),
    ];
  } catch (error) {
    console.error('[sitemap] 读取数据库失败，仅输出静态页面:', error);
    return staticEntries;
  }
}
