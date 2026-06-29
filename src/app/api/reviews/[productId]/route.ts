import { NextRequest } from 'next/server';
import getDb from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;
    const db = getDb();
    const { searchParams } = request.nextUrl;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50);
    const offset = (page - 1) * limit;

    const reviews = db.prepare(
      `SELECT r.*, u.username, u.avatar FROM reviews r
       LEFT JOIN users u ON r.user_id = u.id
       WHERE r.product_id = ? AND r.is_approved = 1
       ORDER BY r.created_at DESC LIMIT ? OFFSET ?`
    ).all(productId, limit, offset);

    const { total } = db.prepare(
      'SELECT COUNT(*) as total FROM reviews WHERE product_id = ? AND is_approved = 1'
    ).get(productId) as { total: number };

    return Response.json({
      success: true,
      data: reviews,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Reviews error:', error);
    return Response.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
