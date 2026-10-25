/**
 * 重建数据库（会清空现有表）：
 *   npm run seed
 *
 * 目标库由环境变量决定：
 *   TURSO_DATABASE_URL / TURSO_AUTH_TOKEN（远端）
 *   DB_PATH（本地文件，默认 ./data/ecommerce.db）
 */
import { createClient } from '@libsql/client';
import path from 'path';
import fs from 'fs';
import { seedDatabase } from '../src/lib/seed';
import type { Db } from '../src/lib/db';

async function main() {
  const DB_PATH = process.env.DB_PATH || path.join(process.cwd(), 'data', 'ecommerce.db');

  const url = process.env.TURSO_DATABASE_URL || `file:${DB_PATH}`;
  if (!process.env.TURSO_DATABASE_URL) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  }

  const client = createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN });
  console.log('[reseed] target:', url);

  const schema = fs.readFileSync(path.join(process.cwd(), 'db', 'schema.sql'), 'utf-8');

  for (const table of [
    'cart_items', 'browse_history', 'favorites', 'reviews', 'order_items', 'orders',
    'product_skus', 'products', 'addresses', 'announcements', 'banners', 'site_settings',
    'categories', 'users',
  ]) {
    await client.execute(`DROP TABLE IF EXISTS ${table}`);
  }
  await client.executeMultiple(schema);

  const raw: Db = {
    prepare(sql: string) {
      return {
        async get(...args: unknown[]) {
          const r = await client.execute({ sql, args: args as never[] });
          return r.rows[0] as never;
        },
        async all(...args: unknown[]) {
          const r = await client.execute({ sql, args: args as never[] });
          return r.rows as never;
        },
        async run(...args: unknown[]) {
          const r = await client.execute({ sql, args: args as never[] });
          return { changes: Number(r.rowsAffected ?? 0), lastInsertRowid: r.lastInsertRowid };
        },
      };
    },
    async exec(sql: string) {
      await client.executeMultiple(sql);
    },
    async pragma() {
      return [];
    },
    async ready() {},
  };

  await seedDatabase(raw);
  console.log('[reseed] done');
}

main().then(
  () => process.exit(0),
  (err) => {
    console.error('[reseed] failed:', err);
    process.exit(1);
  }
);
