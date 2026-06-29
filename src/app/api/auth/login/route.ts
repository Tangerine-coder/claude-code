import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import getDb from '@/lib/db';
import { signToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return Response.json({ success: false, message: 'Email and password are required' }, { status: 400 });
    }

    const db = getDb();
    let user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
    if (!user) {
      user = db.prepare('SELECT * FROM users WHERE username = ?').get(email) as any;
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

    db.prepare("UPDATE users SET last_login = datetime('now') WHERE id = ?").run(user.id);

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
