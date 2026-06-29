import { NextRequest } from 'next/server';
import getDb from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = request.nextUrl;
    const q = searchParams.get('q') || '';
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const page = parseInt(searchParams.get('page') || '1');
    const offset = (page - 1) * limit;

    if (!q.trim()) {
      return Response.json({
        success: true,
        data: [],
        pagination: { page: 1, limit, total: 0, totalPages: 0 },
      });
    }

    const searchTerm = `%${q.trim()}%`;

    // Count
    const { total } = db.prepare(
      `SELECT COUNT(*) as total FROM products WHERE status = 'active' AND (name LIKE ? OR description LIKE ? OR brand LIKE ? OR tags LIKE ?)`
    ).get(searchTerm, searchTerm, searchTerm, searchTerm) as { total: number };

    // Search
    const products = db.prepare(
      `SELECT * FROM products WHERE status = 'active' AND (name LIKE ? OR description LIKE ? OR brand LIKE ? OR tags LIKE ?)
       ORDER BY sales_count DESC LIMIT ? OFFSET ?`
    ).all(searchTerm, searchTerm, searchTerm, searchTerm, limit, offset);

    return Response.json({
      success: true,
      data: products,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Search error:', error);
    return Response.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
