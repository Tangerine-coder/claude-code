import { NextRequest } from 'next/server';
import getDb from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { v4 as uuid } from 'uuid';

export async function GET() {
  try {
    const db = getDb();
    const settings = db.prepare('SELECT * FROM site_settings').all();
    const map: Record<string, string> = {};
    (settings as any[]).forEach((s) => { map[s.key] = s.value; });
    return Response.json({ success: true, data: map });
  } catch (error) {
    return Response.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    requireAdmin(request);
    const db = getDb();
    const body = await request.json();

    const upsert = db.prepare(
      `INSERT INTO site_settings (id, key, value) VALUES (?, ?, ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = datetime('now')`
    );

    for (const [key, value] of Object.entries(body)) {
      upsert.run(uuid(), key, String(value));
    }

    return Response.json({ success: true, message: 'Settings updated' });
  } catch (error: any) {
    if (error.status === 401 || error.status === 403) {
      return Response.json({ success: false, message: error.message }, { status: error.status });
    }
    return Response.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
