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
    const existing = db.prepare('SELECT * FROM banners WHERE id = ?').get(id) as any;
    if (!existing) {
      return Response.json({ success: false, message: 'Banner not found' }, { status: 404 });
    }

    db.prepare(
      `UPDATE banners SET title=?, subtitle=?, image_url=?, link_url=?, sort_order=?, is_active=?, updated_at=datetime('now') WHERE id=?`
    ).run(
      body.title || existing.title, body.subtitle ?? existing.subtitle,
      body.image_url || existing.image_url, body.link_url ?? existing.link_url,
      body.sort_order ?? existing.sort_order,
      body.is_active !== undefined ? (body.is_active ? 1 : 0) : existing.is_active, id
    );

    const banner = db.prepare('SELECT * FROM banners WHERE id = ?').get(id);
    return Response.json({ success: true, data: banner });
  } catch (error: any) {
    if (error.status === 401 || error.status === 403) {
      return Response.json({ success: false, message: error.message }, { status: error.status });
    }
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
    db.prepare('DELETE FROM banners WHERE id = ?').run(id);
    return Response.json({ success: true, message: 'Banner deleted' });
  } catch (error: any) {
    if (error.status === 401 || error.status === 403) {
      return Response.json({ success: false, message: error.message }, { status: error.status });
    }
    return Response.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
