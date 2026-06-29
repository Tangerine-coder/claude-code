import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import getDb from '@/lib/db';
import { signToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json();
    if (!username || !email || !password) {
      return Response.json({ success: false, message: 'All fields are required' }, { status: 400 });
    }
    if (password.length < 6) {
      return Response.json({ success: false, message: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const db = getDb();

    const existing = db.prepare('SELECT id FROM users WHERE email = ? OR username = ?').get(email, username);
    if (existing) {
      return Response.json({ success: false, message: 'Email or username already exists' }, { status: 409 });
    }

    const id = uuid();
    const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

    db.prepare(
      `INSERT INTO users (id, username, email, password_hash, role, status) VALUES (?, ?, ?, ?, 'customer', 'active')`
    ).run(id, username, email, passwordHash);

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id) as any;
    const token = signToken({ userId: id, role: 'customer' });
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
    console.error('Register error:', error);
    return Response.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
