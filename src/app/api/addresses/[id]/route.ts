import { NextRequest } from 'next/server';
import getDb from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = getAuthUser(request);
    if (!auth) return Response.json({ success: false, message: 'Please login' }, { status: 401 });

    const { id } = await params;
    const db = getDb();
    const body = await request.json();
    const existing = db.prepare('SELECT * FROM addresses WHERE id = ? AND user_id = ?').get(id, auth.userId) as any;
    if (!existing) return Response.json({ success: false, message: 'Address not found' }, { status: 404 });

    if (body.is_default) {
      db.prepare('UPDATE addresses SET is_default = 0 WHERE user_id = ?').run(auth.userId);
    }

    db.prepare(
      `UPDATE addresses SET receiver_name=?, phone=?, province=?, city=?, district=?, detail=?, zip_code=?, is_default=?, updated_at=datetime('now') WHERE id=?`
    ).run(
      body.receiver_name || existing.receiver_name, body.phone || existing.phone,
      body.province || existing.province, body.city || existing.city,
      body.district || existing.district, body.detail || existing.detail,
      body.zip_code ?? existing.zip_code, body.is_default !== undefined ? (body.is_default ? 1 : 0) : existing.is_default, id
    );

    const address = db.prepare('SELECT * FROM addresses WHERE id = ?').get(id);
    return Response.json({ success: true, data: address });
  } catch (error) {
    console.error('Update address error:', error);
    return Response.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = getAuthUser(request);
    if (!auth) return Response.json({ success: false, message: 'Please login' }, { status: 401 });

    const { id } = await params;
    const db = getDb();
    db.prepare('DELETE FROM addresses WHERE id = ? AND user_id = ?').run(id, auth.userId);
    return Response.json({ success: true, message: 'Address deleted' });
  } catch (error) {
    return Response.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
