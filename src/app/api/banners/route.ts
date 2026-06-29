import { NextRequest } from 'next/server';
import getDb from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { v4 as uuid } from 'uuid';

export async function GET() {
  try {
    const db = getDb();
    const banners = db.prepare(
      'SELECT * FROM banners WHERE is_active = 1 ORDER BY sort_order ASC'
    ).all();
    return Response.json({ success: true, data: banners });
  } catch (error) {
    console.error('Banners error:', error);
    return Response.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    requireAdmin(request);
    const db = getDb();
    const body = await request.json();
    const id = uuid();

    db.prepare(
      `INSERT INTO banners (id, title, subtitle, image_url, link_url, sort_order) VALUES (?, ?, ?, ?, ?, ?)`
    ).run(id, body.title, body.subtitle || '', body.image_url, body.link_url || '', body.sort_order || 0);

    const banner = db.prepare('SELECT * FROM banners WHERE id = ?').get(id);
    return Response.json({ success: true, data: banner }, { status: 201 });
  } catch (error: any) {
    if (error.status === 401 || error.status === 403) {
      return Response.json({ success: false, message: error.message }, { status: error.status });
    }
    console.error('Create banner error:', error);
    return Response.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
