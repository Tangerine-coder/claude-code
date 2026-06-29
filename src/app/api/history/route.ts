import { NextRequest } from 'next/server';
import getDb from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const auth = getAuthUser(request);
    if (!auth) {
      return Response.json({ success: false, message: 'Please login' }, { status: 401 });
    }

    const db = getDb();
    const history = db.prepare(
      `SELECT bh.*, p.name, p.slug, p.price, p.original_price, p.stock, p.sales_count,
              (SELECT json_extract(images, '$[0]') FROM products WHERE id = bh.product_id) as image
       FROM browse_history bh JOIN products p ON bh.product_id = p.id
       WHERE bh.user_id = ? ORDER BY bh.created_at DESC`
    ).all(auth.userId);

    return Response.json({ success: true, data: history });
  } catch (error) {
    console.error('History GET error:', error);
    return Response.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = getAuthUser(request);
    if (!auth) {
      return Response.json({ success: false, message: 'Please login' }, { status: 401 });
    }

    const db = getDb();
    db.prepare('DELETE FROM browse_history WHERE user_id = ?').run(auth.userId);
    return Response.json({ success: true, message: 'History cleared' });
  } catch (error) {
    return Response.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
