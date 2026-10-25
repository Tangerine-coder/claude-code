import path from 'path';
import fs from 'fs';
import { seedDatabase } from './seed';

/**
 * 数据层。
 *
 * 两种驱动，同一套异步接口：
 *   1. 配了 TURSO_DATABASE_URL → libSQL / Turso（纯 JS 的 HTTP 协议，Render 重启不丢数据）
 *   2. 没配 → better-sqlite3 读写本地文件（开发环境，或挂了持久磁盘时）
 *
 * 之所以不用 @libsql/client 自带的 file: 模式：它依赖 libsql 的平台二进制包（可选依赖），
 * 构建机/运行环境装不到时会直接报 `Cannot find package 'libsql'`，
 * 导致所有接口 500。better-sqlite3 在这里更稳。
 *
 * 对外保持 `db.prepare(sql).get()/all()/run()` 的写法，只是都变成 Promise，调用处需要 await。
 */

const DB_PATH = process.env.DB_PATH || path.join(process.cwd(), 'data', 'ecommerce.db');
const TURSO_URL = process.env.TURSO_DATABASE_URL;
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN;

/** 是否连接远端 Turso 库 */
export const IS_REMOTE = Boolean(TURSO_URL);
/** 本地 SQLite 文件路径（远端模式下由备份接口改用 SQL 导出） */
export const DB_FILE = DB_PATH;

type Row = Record<string, unknown>;

interface Driver {
  kind: 'turso' | 'sqlite';
  get(sql: string, args: unknown[]): Promise<Row | undefined>;
  all(sql: string, args: unknown[]): Promise<Row[]>;
  run(sql: string, args: unknown[]): Promise<{ changes: number; lastInsertRowid: unknown }>;
  exec(sql: string): Promise<void>;
}

// libSQL 不接受 undefined，统一转成 null
const normalize = (args: unknown[]) =>
  args.map((v) => (v === undefined ? null : v)) as (string | number | bigint | null)[];

// ---------------------------------------------------------------------------
// 远端：Turso / libSQL
// ---------------------------------------------------------------------------
async function createTursoDriver(): Promise<Driver> {
  const { createClient } = await import('@libsql/client');
  const client = createClient({ url: TURSO_URL as string, authToken: TURSO_TOKEN });

  return {
    kind: 'turso',
    async get(sql, args) {
      const r = await client.execute({ sql, args: normalize(args) });
      return r.rows[0] as Row | undefined;
    },
    async all(sql, args) {
      const r = await client.execute({ sql, args: normalize(args) });
      return r.rows as unknown as Row[];
    },
    async run(sql, args) {
      const r = await client.execute({ sql, args: normalize(args) });
      return { changes: Number(r.rowsAffected ?? 0), lastInsertRowid: r.lastInsertRowid };
    },
    async exec(sql) {
      await client.executeMultiple(sql);
    },
  };
}

// ---------------------------------------------------------------------------
// 本地：better-sqlite3
// ---------------------------------------------------------------------------
async function createSqliteDriver(): Promise<Driver> {
  const { default: Database } = await import('better-sqlite3');
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  return {
    kind: 'sqlite',
    async get(sql, args) {
      return db.prepare(sql).get(...normalize(args)) as Row | undefined;
    },
    async all(sql, args) {
      return db.prepare(sql).all(...normalize(args)) as Row[];
    },
    async run(sql, args) {
      const info = db.prepare(sql).run(...normalize(args));
      return { changes: info.changes, lastInsertRowid: info.lastInsertRowid };
    },
    async exec(sql) {
      db.exec(sql);
    },
  };
}

// ---------------------------------------------------------------------------
// 门面
// ---------------------------------------------------------------------------
export interface DbStatement {
  get<T = Row>(...args: unknown[]): Promise<T | undefined>;
  all<T = Row>(...args: unknown[]): Promise<T[]>;
  run(...args: unknown[]): Promise<{ changes: number; lastInsertRowid: unknown }>;
}

export interface Db {
  prepare(sql: string): DbStatement;
  exec(sql: string): Promise<void>;
  pragma(sql: string): Promise<unknown[]>;
  ready(): Promise<void>;
}

// 用 globalThis 缓存，避免 Next.js 把模块打进多个 chunk 时出现多份连接
const g = globalThis as unknown as { __novaDriver?: Promise<Driver>; __novaDb?: Db };

function getDriver(): Promise<Driver> {
  if (!g.__novaDriver) {
    console.log(`[DB] ${IS_REMOTE ? 'Turso: ' + TURSO_URL : 'SQLite file: ' + DB_PATH}`);
    g.__novaDriver = IS_REMOTE ? createTursoDriver() : createSqliteDriver();
  }
  return g.__novaDriver;
}

/** @param gated 是否等待初始化完成（种子数据写入时需要关闭，否则会自己等自己） */
function createFacade(gated = true): Db {
  let readyPromise: Promise<void> | null = null;

  async function init() {
    const driver = await getDriver();

    const tableCheck = await driver.all(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='users'",
      []
    );
    if (tableCheck.length > 0) return;

    const schemaPath = path.join(process.cwd(), 'db', 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      await driver.exec(fs.readFileSync(schemaPath, 'utf-8'));
      console.log('[DB] Schema applied');
    }

    const count = await driver.get('SELECT COUNT(*) as c FROM products', []);
    if (Number(count?.c ?? 0) === 0) {
      console.log('[DB] Seeding database...');
      await seedDatabase(createFacade(false));
      console.log('[DB] Database seeded successfully!');
    }
  }

  const facade: Db = {
    prepare(sql: string): DbStatement {
      return {
        async get<T = Row>(...args: unknown[]) {
          if (gated) await facade.ready();
          const driver = await getDriver();
          return (await driver.get(sql, args)) as T | undefined;
        },
        async all<T = Row>(...args: unknown[]) {
          if (gated) await facade.ready();
          const driver = await getDriver();
          return (await driver.all(sql, args)) as T[];
        },
        async run(...args: unknown[]) {
          if (gated) await facade.ready();
          const driver = await getDriver();
          return driver.run(sql, args);
        },
      };
    },
    async exec(sql: string) {
      await facade.ready();
      const driver = await getDriver();
      await driver.exec(sql);
    },
    async pragma() {
      // WAL 之类的本地 pragma 已由驱动内部处理，这里保留接口
      return [];
    },
    ready() {
      readyPromise ??= init();
      return readyPromise;
    },
  };

  return facade;
}

function getDb(): Db {
  if (!g.__novaDb) {
    g.__novaDb = createFacade();
    // 提前触发初始化；内部所有查询会 await 同一个 Promise
    void g.__novaDb.ready();
  }
  return g.__novaDb;
}

export { getDb };
export default getDb;
