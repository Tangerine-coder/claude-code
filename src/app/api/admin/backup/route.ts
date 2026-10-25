import fs from 'fs';
import { NextRequest } from 'next/server';
import getDb, { DB_FILE } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

/**
 * 导出当前数据库文件（仅管理员）。
 * 免费实例没有持久磁盘时，可以定期下载一份留底，重启后数据丢了还能手动恢复。
 */
export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);

    const db = getDb();
    // 把 WAL 里的改动写回主文件，避免备份少数据
    try {
      db.pragma('wal_checkpoint(TRUNCATE)');
    } catch {
      /* 忽略 checkpoint 失败，继续导出 */
    }

    if (!fs.existsSync(DB_FILE)) {
      return Response.json({ success: false, message: '数据库文件不存在' }, { status: 404 });
    }

    const file = fs.readFileSync(DB_FILE);
    const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');

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
