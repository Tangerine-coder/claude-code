import { NextRequest } from 'next/server';
import getDb from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireAdmin(request);
    const { id } = await params;
    const db = getDb();
    const body = await request.json();

    const existing = db.prepare('SELECT * FROM announcements WHERE id = ?').get(id) as any;
    if (!existing) {
      return Response.json({ success: false, message: 'Announcement not found' }, { status: 404 });
    }

    db.prepare(
      `UPDATE announcements SET content = ?, link_url = ?, is_active = ?, created_at = datetime('now') WHERE id = ?`
    ).run(
      body.content ?? existing.content,
      body.link_url ?? existing.link_url,
      body.is_active !== undefined ? (body.is_active ? 1 : 0) : existing.is_active,
      id
    );

    const announcement = db.prepare('SELECT * FROM announcements WHERE id = ?').get(id);
    return Response.json({ success: true, data: announcement });
  } catch (error: any) {
    if (error.status === 401 || error.status === 403) {
      return Response.json({ success: false, message: error.message }, { status: error.status });
    }
    console.error('Update announcement error:', error);
    return Response.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireAdmin(request);
    const { id } = await params;
    const db = getDb();
    db.prepare('DELETE FROM announcements WHERE id = ?').run(id);
    return Response.json({ success: true, message: 'Announcement deleted' });
  } catch (error: any) {
    if (error.status === 401 || error.status === 403) {
      return Response.json({ success: false, message: error.message }, { status: error.status });
    }
    console.error('Delete announcement error:', error);
    return Response.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
