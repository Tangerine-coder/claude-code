import { NextRequest } from 'next/server';
import getDb from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();

    // Try by ID first, then by slug
    let product = db.prepare('SELECT * FROM products WHERE id = ?').get(id) as any;
    if (!product) {
      product = db.prepare('SELECT * FROM products WHERE slug = ?').get(id) as any;
    }
    if (!product) {
      return Response.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    // Get SKUs
    const skus = db.prepare('SELECT * FROM product_skus WHERE product_id = ?').all(product.id);

    // Get reviews
    const reviews = db.prepare(
      `SELECT r.*, u.username, u.avatar FROM reviews r
       LEFT JOIN users u ON r.user_id = u.id
       WHERE r.product_id = ? AND r.is_approved = 1
       ORDER BY r.created_at DESC LIMIT 10`
    ).all(product.id);

    // Get review stats
    const stats = db.prepare(
      'SELECT COUNT(*) as count, AVG(rating) as avg_rating FROM reviews WHERE product_id = ? AND is_approved = 1'
    ).get(product.id) as any;

    // Get related products (same category)
    let related: any[] = [];
    if (product.category_id) {
      related = db.prepare(
        'SELECT * FROM products WHERE category_id = ? AND id != ? AND status = ? LIMIT 4'
      ).all(product.category_id, product.id, 'active');
    }

    return Response.json({
      success: true,
      data: {
        ...product,
        skus,
        reviews,
        review_count: stats.count,
        avg_rating: stats.avg_rating || 0,
        related,
      },
    });
  } catch (error) {
    console.error('Product detail error:', error);
    return Response.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireAdmin(request);
    const { id } = await params;
    const db = getDb();
    const body = await request.json();

    const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(id) as any;
    if (!existing) {
      return Response.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    db.prepare(
      `UPDATE products SET name=?, description=?, price=?, original_price=?, stock=?, category_id=?,
       brand=?, images=?, specs=?, tags=?, is_featured=?, is_new=?, is_recommended=?, status=?, updated_at=datetime('now')
       WHERE id=?`
    ).run(
      body.name || existing.name, body.description ?? existing.description,
      body.price ?? existing.price, body.original_price ?? existing.original_price,
      body.stock ?? existing.stock, body.category_id ?? existing.category_id,
      body.brand ?? existing.brand, JSON.stringify(body.images || JSON.parse(existing.images)),
      JSON.stringify(body.specs || JSON.parse(existing.specs)), body.tags ?? existing.tags,
      body.is_featured !== undefined ? (body.is_featured ? 1 : 0) : existing.is_featured,
      body.is_new !== undefined ? (body.is_new ? 1 : 0) : existing.is_new,
      body.is_recommended !== undefined ? (body.is_recommended ? 1 : 0) : existing.is_recommended,
      body.status || existing.status, id
    );

    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    return Response.json({ success: true, data: product });
  } catch (error: any) {
    if (error.status === 401 || error.status === 403) {
      return Response.json({ success: false, message: error.message }, { status: error.status });
    }
    console.error('Update product error:', error);
    return Response.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireAdmin(request);
    const { id } = await params;
    const db = getDb();

    const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(id) as any;
    if (!existing) {
      return Response.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    db.prepare('DELETE FROM products WHERE id = ?').run(id);
    return Response.json({ success: true, message: 'Product deleted' });
  } catch (error: any) {
    if (error.status === 401 || error.status === 403) {
      return Response.json({ success: false, message: error.message }, { status: error.status });
    }
    console.error('Delete product error:', error);
    return Response.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
