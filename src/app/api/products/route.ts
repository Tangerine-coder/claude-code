import { NextRequest } from 'next/server';
import getDb from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { v4 as uuid } from 'uuid';
import { slugify } from '@/lib/utils';
import type { ProductQueryParams } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = request.nextUrl;

    const params: ProductQueryParams = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: Math.min(parseInt(searchParams.get('limit') || '20'), 100),
      category: searchParams.get('category') || undefined,
      sort: (searchParams.get('sort') as ProductQueryParams['sort']) || undefined,
      min_price: searchParams.get('min_price') ? parseFloat(searchParams.get('min_price')!) : undefined,
      max_price: searchParams.get('max_price') ? parseFloat(searchParams.get('max_price')!) : undefined,
      featured: searchParams.get('featured') ? parseInt(searchParams.get('featured')!) : undefined,
      recommended: searchParams.get('recommended') ? parseInt(searchParams.get('recommended')!) : undefined,
      is_new: searchParams.get('is_new') ? parseInt(searchParams.get('is_new')!) : undefined,
      search: searchParams.get('search') || undefined,
      brand: searchParams.get('brand') || undefined,
      status: searchParams.get('status') || 'active',
    };

    let sql = 'SELECT * FROM products WHERE 1=1';
    const bindings: any[] = [];

    if (params.status) {
      sql += ' AND status = ?';
      bindings.push(params.status);
    }
    if (params.category) {
      sql += ` AND category_id IN (
        SELECT id FROM categories WHERE slug = ? OR parent_id IN (SELECT id FROM categories WHERE slug = ?)
      )`;
      bindings.push(params.category, params.category);
    }
    if (params.min_price !== undefined) {
      sql += ' AND price >= ?';
      bindings.push(params.min_price);
    }
    if (params.max_price !== undefined) {
      sql += ' AND price <= ?';
      bindings.push(params.max_price);
    }
    if (params.featured) { sql += ' AND is_featured = 1'; }
    if (params.recommended) { sql += ' AND is_recommended = 1'; }
    if (params.is_new) { sql += ' AND is_new = 1'; }
    if (params.brand) {
      sql += ' AND brand = ?';
      bindings.push(params.brand);
    }
    if (params.search) {
      sql += ' AND (name LIKE ? OR description LIKE ?)';
      bindings.push(`%${params.search}%`, `%${params.search}%`);
    }

    // Count
    const countSql = sql.replace('SELECT *', 'SELECT COUNT(*) as total');
    const { total } = db.prepare(countSql).get(...bindings) as { total: number };

    // Sort
    const sortMap: Record<string, string> = {
      price_asc: 'price ASC',
      price_desc: 'price DESC',
      newest: 'created_at DESC',
      popular: 'sales_count DESC',
      rating: 'sales_count DESC',
    };
    sql += ` ORDER BY ${sortMap[params.sort || ''] || 'created_at DESC'}`;

    // Pagination
    const limit = params.limit || 20;
    const offset = ((params.page || 1) - 1) * limit;
    sql += ' LIMIT ? OFFSET ?';
    bindings.push(limit, offset);

    const products = db.prepare(sql).all(...bindings);

    return Response.json({
      success: true,
      data: products,
      pagination: {
        page: params.page || 1,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Products error:', error);
    return Response.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    requireAdmin(request);
    const db = getDb();
    const body = await request.json();

    const id = uuid();
    const slug = slugify(body.name) + '-' + id.substring(0, 6);

    db.prepare(
      `INSERT INTO products (id, name, slug, description, price, original_price, stock, category_id, brand, images, specs, tags, is_featured, is_new, is_recommended)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      id, body.name, slug, body.description || '', body.price, body.original_price || null,
      body.stock || 0, body.category_id || null, body.brand || '',
      JSON.stringify(body.images || []), JSON.stringify(body.specs || []),
      body.tags || '', body.is_featured ? 1 : 0, body.is_new ? 1 : 0, body.is_recommended ? 1 : 0
    );

    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    return Response.json({ success: true, data: product }, { status: 201 });
  } catch (error: any) {
    if (error.status === 401 || error.status === 403) {
      return Response.json({ success: false, message: error.message }, { status: error.status });
    }
    console.error('Create product error:', error);
    return Response.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
