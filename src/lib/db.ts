import { createClient, type Client } from '@libsql/client';
import path from 'path';
import fs from 'fs';
import { seedDatabase } from './seed';

/**
 * 数据层：统一封装 libSQL（Turso）客户端。
 *
 * - 配置了 TURSO_DATABASE_URL → 连 Turso 云端库（Render 重启不丢数据）
 * - 没配置 → 退回本地 SQLite 文件（开发环境，或挂了持久磁盘时）
 *
 * 对外保持 `db.prepare(sql).get()/all()/run()` 的写法，只是都变成 Promise，
 * 调用处需要 await。
 */

const DB_PATH = process.env.DB_PATH || path.join(process.cwd(), 'data', 'ecommerce.db');
const TURSO_URL = process.env.TURSO_DATABASE_URL;
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN;

/** 是否连接远端 Turso 库 */
export const IS_REMOTE = Boolean(TURSO_URL);
/** 本地 SQLite 文件路径（远端模式下由备份接口改用 SQL 导出） */
export const DB_FILE = DB_PATH;

console.log(`[DB] ${IS_REMOTE ? 'Turso: ' + TURSO_URL : 'SQLite file: ' + DB_PATH}`);

// 用 globalThis 缓存，避免 Next.js 把模块打进多个 chunk 时出现多份连接
const g = globalThis as unknown as { __novaClient?: Client; __novaDb?: Db };
const client: Client =
  g.__novaClient ??
  (g.__novaClient = TURSO_URL
    ? createClient({ url: TURSO_URL, authToken: TURSO_TOKEN })
    : createClient({ url: `file:${DB_PATH}` }));

export interface DbStatement {
  get<T = Record<string, unknown>>(...args: unknown[]): Promise<T | undefined>;
  all<T = Record<string, unknown>>(...args: unknown[]): Promise<T[]>;
  run(...args: unknown[]): Promise<{ changes: number; lastInsertRowid: unknown }>;
}

export interface Db {
  prepare(sql: string): DbStatement;
  exec(sql: string): Promise<void>;
  pragma(sql: string): Promise<unknown[]>;
  ready(): Promise<void>;
  client: Client;
}

// libSQL 不接受 undefined，统一转成 null
const normalize = (args: unknown[]) =>
  args.map((v) => (v === undefined ? null : v)) as (string | number | bigint | null)[];

/** @param gated 是否等待初始化完成（种子数据写入时需要关闭，否则会自己等自己） */
function createFacade(c: Client, gated = true): Db {
  let readyPromise: Promise<void> | null = null;

  async function init() {
    if (!IS_REMOTE) {
      const dir = path.dirname(DB_PATH);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    }

    const tableCheck = await c.execute(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='users'"
    );
    if (tableCheck.rows.length > 0) return;

    const schemaPath = path.join(process.cwd(), 'db', 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      await c.executeMultiple(fs.readFileSync(schemaPath, 'utf-8'));
      console.log('[DB] Schema applied');
    }

    const count = await c.execute('SELECT COUNT(*) as c FROM products');
    if (Number(count.rows[0]?.c ?? 0) === 0) {
      console.log('[DB] Seeding database...');
      await seedDatabase(createFacade(c, false));
      console.log('[DB] Database seeded successfully!');
    }
  }

  const facade: Db = {
    prepare(sql: string): DbStatement {
      return {
        async get(...args: unknown[]) {
          if (gated) await facade.ready();
          const r = await c.execute({ sql, args: normalize(args) });
          return r.rows[0] as never;
        },
        async all(...args: unknown[]) {
          if (gated) await facade.ready();
          const r = await c.execute({ sql, args: normalize(args) });
          return r.rows as never;
        },
        async run(...args: unknown[]) {
          if (gated) await facade.ready();
          const r = await c.execute({ sql, args: normalize(args) });
          return { changes: Number(r.rowsAffected ?? 0), lastInsertRowid: r.lastInsertRowid };
        },
      };
    },
    async exec(sql: string) {
      await facade.ready();
      await c.executeMultiple(sql);
    },
    async pragma() {
      // 远端 Turso 不需要 WAL 之类的本地 pragma，保留接口即可
      return [];
    },
    ready() {
      readyPromise ??= init();
      return readyPromise;
    },
    client: c,
  };

  return facade;
}

function getDb(): Db {
  if (!g.__novaDb) {
    g.__novaDb = createFacade(client);
    // 提前触发初始化；内部所有查询会 await 同一个 Promise
    void g.__novaDb.ready();
  }
  return g.__novaDb;
}

export { getDb };
export default getDb;
