import fs from 'fs';
import { NextRequest } from 'next/server';
import getDb, { DB_FILE, IS_REMOTE } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

function sqlValue(v: unknown): string {
  if (v === null || v === undefined) return 'NULL';
  if (typeof v === 'number' || typeof v === 'bigint') return String(v);
  if (typeof v === 'boolean') return v ? '1' : '0';
  if (v instanceof Uint8Array) return `X'${Buffer.from(v).toString('hex')}'`;
  return `'${String(v).replace(/'/g, "''")}'`;
}

/**
 * 导出数据库（仅管理员）。
 * - 本地 SQLite：直接下发 .db 文件
 * - Turso 远端：生成一份等价的 .sql 文本（可重新导入）
 */
export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);
    const db = getDb();
    const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');

    if (IS_REMOTE) {
      const tables = await db
        .prepare(
          "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
        )
        .all<{ name: string }>();

      const out: string[] = [
        `-- Nova Mart 数据导出 ${new Date().toISOString()}`,
        'PRAGMA foreign_keys=OFF;',
        'BEGIN TRANSACTION;',
      ];

      for (const { name } of tables) {
        const schema = await db
          .prepare("SELECT sql FROM sqlite_master WHERE type='table' AND name = ?")
          .get<{ sql: string }>(name);

        out.push(`\n-- ---------- ${name} ----------`);
        out.push(`DROP TABLE IF EXISTS ${name};`);
        if (schema?.sql) out.push(`${schema.sql};`);

        const rows = await db.prepare(`SELECT * FROM ${name}`).all<Record<string, unknown>>();
        for (const row of rows) {
          const cols = Object.keys(row);
          out.push(
            `INSERT INTO ${name} (${cols.join(', ')}) VALUES (${cols
              .map((c) => sqlValue(row[c]))
              .join(', ')});`
          );
        }
      }

      out.push('COMMIT;');
      const text = out.join('\n');

      return new Response(text, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Content-Disposition': `attachment; filename="novamart-${stamp}.sql"`,
          'Cache-Control': 'no-store',
        },
      });
    }

    // 本地 SQLite：把 WAL 写回主文件后直接下发
    try {
      await db.pragma('wal_checkpoint(TRUNCATE)');
    } catch {
      /* 忽略 */
    }

    if (!fs.existsSync(DB_FILE)) {
      return Response.json({ success: false, message: '数据库文件不存在' }, { status: 404 });
    }

    const file = fs.readFileSync(DB_FILE);
    return new Response(file, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="novamart-${stamp}.db"`,
        'Content-Length': String(file.byteLength),
        'Cache-Control': 'no-store',
      },
    });
  } catch (error: any) {
    if (error?.status === 401 || error?.status === 403) {
      return Response.json({ success: false, message: '无权限' }, { status: error.status });
    }
    console.error('[admin/backup]', error);
    return Response.json({ success: false, message: '导出失败' }, { status: 500 });
  }
}
