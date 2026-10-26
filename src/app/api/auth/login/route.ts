import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import getDb from '@/lib/db';
import { signToken } from '@/lib/auth';
import { verifyCaptcha } from '@/lib/captcha';
import { clientIp, rateLimit, tooManyRequests } from '@/lib/ratelimit';

export async function POST(request: NextRequest) {
  try {
    // 防止暴力破解 / 批量试密码
    const ip = clientIp(request);
    const limited = rateLimit(`login:${ip}`, 10, 5 * 60 * 1000);
    if (!limited.ok) return tooManyRequests(limited.retryAfter, '登录尝试过于频繁，请稍后再试');

    const { email, password, captcha } = await request.json();
    // Verify captcha
    const captchaToken = request.cookies.get('captcha_token')?.value;
    if (!captcha || !captchaToken || !verifyCaptcha(captchaToken, captcha)) {
      return Response.json({ success: false, message: '验证码错误' }, { status: 400 });
    }
    if (!email || !password) {
      return Response.json({ success: false, message: 'Email and password are required' }, { status: 400 });
    }

    const db = getDb();
    let user = await db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
    if (!user) {
      user = await db.prepare('SELECT * FROM users WHERE username = ?').get(email) as any;
    }

    if (!user) {
      return Response.json({ success: false, message: '账号或密码错误' }, { status: 401 });
    }

    const valid = bcrypt.compareSync(password, user.password_hash);
    if (!valid) {
      return Response.json({ success: false, message: '账号或密码错误' }, { status: 401 });
    }

    if (user.status === 'disabled') {
      return Response.json({ success: false, message: 'Account is disabled' }, { status: 403 });
    }

    const token = signToken({ userId: user.id, role: user.role });

    await db.prepare("UPDATE users SET last_login = datetime('now') WHERE id = ?").run(user.id);

    const { password_hash, ...userPublic } = user;

    const cookieStore = await cookies();
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return Response.json({ success: true, data: userPublic });
  } catch (error) {
    console.error('Login error:', error);
    return Response.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
