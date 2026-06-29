import { NextRequest } from 'next/server';
import getDb from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { v4 as uuid } from 'uuid';

export async function GET(request: NextRequest) {
  try {
    const auth = getAuthUser(request);
    if (!auth) return Response.json({ success: false, message: 'Please login' }, { status: 401 });

    const db = getDb();
    const favorites = db.prepare(
      `SELECT f.*, p.name, p.slug, p.price, p.original_price, p.stock, p.sales_count,
              (SELECT json_extract(images, '$[0]') FROM products WHERE id = f.product_id) as image
       FROM favorites f JOIN products p ON f.product_id = p.id
       WHERE f.user_id = ? ORDER BY f.created_at DESC`
    ).all(auth.userId);

    return Response.json({ success: true, data: favorites });
  } catch (error) {
    return Response.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = getAuthUser(request);
    if (!auth) return Response.json({ success: false, message: 'Please login' }, { status: 401 });

    const db = getDb();
    const body = await request.json();
    const id = uuid();

    try {
      db.prepare('INSERT INTO favorites (id, user_id, product_id) VALUES (?, ?, ?)').run(id, auth.userId, body.product_id);
    } catch {
      return Response.json({ success: false, message: 'Already in favorites' }, { status: 409 });
    }

    return Response.json({ success: true, message: 'Added to favorites' }, { status: 201 });
  } catch (error) {
    return Response.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = getAuthUser(request);
    if (!auth) return Response.json({ success: false, message: 'Please login' }, { status: 401 });

    const db = getDb();
    const productId = request.nextUrl.searchParams.get('product_id');
    db.prepare('DELETE FROM favorites WHERE user_id = ? AND product_id = ?').run(auth.userId, productId);
    return Response.json({ success: true, message: 'Removed from favorites' });
  } catch (error) {
    return Response.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
