import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import getDb from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { clientIp, rateLimit, tooManyRequests } from '@/lib/ratelimit';

/** 修改当前登录用户的密码 */
export async function PUT(request: NextRequest) {
  try {
    const limited = rateLimit(`password:${clientIp(request)}`, 6, 10 * 60 * 1000);
    if (!limited.ok) return tooManyRequests(limited.retryAfter, '尝试过于频繁，请稍后再试');

    const auth = requireAuth(request);
    const body = await request.json();
    const currentPassword = String(body.currentPassword ?? body.current_password ?? '');
    const newPassword = String(body.newPassword ?? body.new_password ?? '');

    if (!currentPassword || !newPassword) {
      return Response.json({ success: false, message: '请填写当前密码和新密码' }, { status: 400 });
    }
    if (newPassword.length < 6) {
      return Response.json({ success: false, message: '新密码至少需要 6 个字符' }, { status: 400 });
    }
    if (currentPassword === newPassword) {
      return Response.json({ success: false, message: '新密码不能与当前密码相同' }, { status: 400 });
    }

    const db = getDb();
    const user = (await db
      .prepare('SELECT id, password_hash FROM users WHERE id = ?')
      .get(auth.userId)) as { id: string; password_hash: string } | undefined;

    if (!user) {
      return Response.json({ success: false, message: '用户不存在' }, { status: 404 });
    }

    if (!bcrypt.compareSync(currentPassword, user.password_hash)) {
      return Response.json({ success: false, message: '当前密码不正确' }, { status: 400 });
    }

    await db.prepare("UPDATE users SET password_hash = ?, updated_at = datetime('now') WHERE id = ?")
      .run(bcrypt.hashSync(newPassword, 10), user.id);

    return Response.json({ success: true, message: '密码已更新' });
  } catch (error: any) {
    if (error?.status === 401 || error?.status === 403) {
      return Response.json({ success: false, message: '请先登录' }, { status: error.status });
    }
    console.error('[user/password]', error);
    return Response.json({ success: false, message: '修改密码失败' }, { status: 500 });
  }
}
