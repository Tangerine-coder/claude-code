import { NextRequest } from 'next/server';
import getDb from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);
    const db = getDb();
    const users = db.prepare('SELECT u.id, u.username, u.email, u.phone, u.avatar, u.role, u.status, u.last_login, u.created_at, COUNT(o.id) as order_count FROM users u LEFT JOIN orders o ON o.user_id = u.id GROUP BY u.id ORDER BY u.created_at DESC').all();
    return Response.json({ success: true, data: users });
  } catch (error: any) {
    if (error.status === 401 || error.status === 403) {
      return Response.json({ success: false, message: error.message }, { status: error.status });
    }
    return Response.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    requireAdmin(request);
    const db = getDb();
    const body = await request.json();
    db.prepare("UPDATE users SET status = ?, updated_at = datetime('now') WHERE id = ?").run(body.status, body.id);
    return Response.json({ success: true, message: 'User updated' });
  } catch (error: any) {
    if (error.status === 401 || error.status === 403) {
      return Response.json({ success: false, message: error.message }, { status: error.status });
    }
    return Response.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
