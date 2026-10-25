import { NextRequest } from 'next/server';
import getDb from '@/lib/db';
import { requireAuth } from '@/lib/auth';

/** 更新当前登录用户的资料（用户名 / 手机号） */
export async function PUT(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    const body = await request.json();
    const username = body.username != null ? String(body.username).trim() : undefined;
    const phone = body.phone != null ? String(body.phone).trim() : undefined;

    if (username !== undefined && (username.length < 2 || username.length > 20)) {
      return Response.json({ success: false, message: '用户名长度需在 2-20 个字符之间' }, { status: 400 });
    }
    if (phone !== undefined && phone !== '' && !/^1[3-9]\d{9}$/.test(phone)) {
      return Response.json({ success: false, message: '手机号格式不正确' }, { status: 400 });
    }

    const db = getDb();

    if (username !== undefined) {
      const taken = db
        .prepare('SELECT id FROM users WHERE username = ? AND id <> ?')
        .get(username, auth.userId) as { id: string } | undefined;
      if (taken) {
        return Response.json({ success: false, message: '该用户名已被占用' }, { status: 409 });
      }
    }

    const sets: string[] = [];
    const params: unknown[] = [];
    if (username !== undefined) { sets.push('username = ?'); params.push(username); }
    if (phone !== undefined) { sets.push('phone = ?'); params.push(phone); }

    if (sets.length === 0) {
      return Response.json({ success: false, message: '没有需要更新的内容' }, { status: 400 });
    }

    sets.push("updated_at = datetime('now')");
    params.push(auth.userId);
    db.prepare(`UPDATE users SET ${sets.join(', ')} WHERE id = ?`).run(...params);

    const user = db
      .prepare('SELECT id, username, email, phone, avatar, role, status FROM users WHERE id = ?')
      .get(auth.userId);

    return Response.json({ success: true, message: '资料已更新', data: user });
  } catch (error: any) {
    if (error?.status === 401 || error?.status === 403) {
      return Response.json({ success: false, message: '请先登录' }, { status: error.status });
    }
    console.error('[user/profile]', error);
    return Response.json({ success: false, message: '更新资料失败' }, { status: 500 });
  }
}
