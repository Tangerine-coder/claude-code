import { NextRequest } from 'next/server';
import getDb from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { v4 as uuid } from 'uuid';
import { slugify } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const all = request.nextUrl.searchParams.get('all') === '1';

    const categories = db.prepare(
      all
        ? 'SELECT * FROM categories ORDER BY sort_order ASC'
        : 'SELECT * FROM categories WHERE is_active = 1 ORDER BY sort_order ASC'
    ).all() as any[];

    // Build tree
    const tree = buildTree(categories);
    return Response.json({ success: true, data: tree });
  } catch (error) {
    console.error('Categories error:', error);
    return Response.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    requireAdmin(request);
    const db = getDb();
    const body = await request.json();

    const id = uuid();
    const slug = slugify(body.name);

    db.prepare(
      `INSERT INTO categories (id, name, slug, parent_id, description, image, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).run(id, body.name, slug, body.parent_id || null, body.description || '', body.image || '', body.sort_order || 0);

    const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
    return Response.json({ success: true, data: category }, { status: 201 });
  } catch (error: any) {
    if (error.status === 401 || error.status === 403) {
      return Response.json({ success: false, message: error.message }, { status: error.status });
    }
    console.error('Create category error:', error);
    return Response.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

function buildTree(categories: any[]): any[] {
  const map = new Map<string, any>();
  const roots: any[] = [];

  categories.forEach((cat) => {
    map.set(cat.id, { ...cat, children: [] });
  });

  categories.forEach((cat) => {
    const node = map.get(cat.id);
    if (cat.parent_id && map.has(cat.parent_id)) {
      map.get(cat.parent_id).children.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
}
