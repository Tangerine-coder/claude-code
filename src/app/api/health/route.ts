import { NextResponse } from 'next/server';
import getDb, { IS_REMOTE } from '@/lib/db';

/**
 * 健康检查：确认数据库连通性。
 * 浏览器直接打开 /api/health 即可，不需要登录，也不泄露任何凭据。
 */
export async function GET() {
  const started = Date.now();
  const mode = IS_REMOTE ? 'turso' : 'sqlite';

  try {
    const db = getDb();
    await db.ready();
    const row = await db.prepare('SELECT COUNT(*) as c FROM products').get<{ c: number }>();

    return NextResponse.json({
      ok: true,
      mode,
      products: Number(row?.c ?? 0),
      ms: Date.now() - started,
      time: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const e = error as { message?: string; code?: string };
    return NextResponse.json(
      {
        ok: false,
        mode,
        error: e?.message || String(error),
        code: e?.code,
        ms: Date.now() - started,
      },
      { status: 500 }
    );
  }
}
