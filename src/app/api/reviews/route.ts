import { NextRequest } from 'next/server';
import getDb from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { v4 as uuid } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const auth = getAuthUser(request);
    if (!auth) {
      return Response.json({ success: false, message: 'Please login to review' }, { status: 401 });
    }

    const db = getDb();
    const body = await request.json();

    if (!body.product_id || !body.rating) {
      return Response.json({ success: false, message: 'Product and rating are required' }, { status: 400 });
    }

    const id = uuid();
    db.prepare(
      `INSERT INTO reviews (id, product_id, user_id, rating, content, images) VALUES (?, ?, ?, ?, ?, ?)`
    ).run(id, body.product_id, auth.userId, body.rating, body.content || '', JSON.stringify(body.images || []));

    const review = db.prepare(
      'SELECT r.*, u.username FROM reviews r LEFT JOIN users u ON r.user_id = u.id WHERE r.id = ?'
    ).get(id);

    return Response.json({ success: true, data: review }, { status: 201 });
  } catch (error) {
    console.error('Create review error:', error);
    return Response.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
