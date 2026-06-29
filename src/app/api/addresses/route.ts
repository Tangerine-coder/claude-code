import { NextRequest } from 'next/server';
import getDb from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { v4 as uuid } from 'uuid';

export async function GET(request: NextRequest) {
  try {
    const auth = getAuthUser(request);
    if (!auth) {
      return Response.json({ success: false, message: 'Please login' }, { status: 401 });
    }

    const db = getDb();
    const addresses = db.prepare(
      'SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC'
    ).all(auth.userId);

    return Response.json({ success: true, data: addresses });
  } catch (error) {
    console.error('Addresses GET error:', error);
    return Response.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = getAuthUser(request);
    if (!auth) {
      return Response.json({ success: false, message: 'Please login' }, { status: 401 });
    }

    const db = getDb();
    const body = await request.json();
    const id = uuid();

    // If this is default, unset other defaults
    if (body.is_default) {
      db.prepare('UPDATE addresses SET is_default = 0 WHERE user_id = ?').run(auth.userId);
    }

    db.prepare(
      `INSERT INTO addresses (id, user_id, receiver_name, phone, province, city, district, detail, zip_code, is_default)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(id, auth.userId, body.receiver_name, body.phone, body.province, body.city, body.district, body.detail, body.zip_code || '', body.is_default ? 1 : 0);

    const address = db.prepare('SELECT * FROM addresses WHERE id = ?').get(id);
    return Response.json({ success: true, data: address }, { status: 201 });
  } catch (error) {
    console.error('Create address error:', error);
    return Response.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
