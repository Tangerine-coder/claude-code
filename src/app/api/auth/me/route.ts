import { NextRequest } from 'next/server';
import getDb from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const auth = getAuthUser(request);
    if (!auth) {
      return Response.json({ success: true, data: null });
    }

    const db = getDb();
    const user = db.prepare('SELECT id, username, email, phone, avatar, role, status, last_login, created_at, updated_at FROM users WHERE id = ?').get(auth.userId) as any;
    if (!user) {
      return Response.json({ success: true, data: null });
    }

    return Response.json({ success: true, data: user });
  } catch {
    return Response.json({ success: true, data: null });
  }
}
