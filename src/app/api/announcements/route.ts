import { NextRequest } from 'next/server';
import getDb from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { v4 as uuid } from 'uuid';

export async function GET() {
  try {
    const db = getDb();
    const announcements = db.prepare('SELECT * FROM announcements WHERE is_active = 1 ORDER BY created_at DESC').all();
    return Response.json({ success: true, data: announcements });
  } catch (error) {
    return Response.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    requireAdmin(request);
    const db = getDb();
    const body = await request.json();
    const id = uuid();
    db.prepare('INSERT INTO announcements (id, content, link_url) VALUES (?, ?, ?)').run(id, body.content, body.link_url || '');
    const announcement = db.prepare('SELECT * FROM announcements WHERE id = ?').get(id);
    return Response.json({ success: true, data: announcement }, { status: 201 });
  } catch (error: any) {
    if (error.status === 401 || error.status === 403) {
      return Response.json({ success: false, message: error.message }, { status: error.status });
    }
    return Response.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
