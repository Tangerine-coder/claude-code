import { NextRequest } from 'next/server';
import getDb from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { slugify } from '@/lib/utils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();
    const category = db.prepare('SELECT * FROM categories WHERE id = ? OR slug = ?').get(id, id) as any;
    if (!category) {
      return Response.json({ success: false, message: 'Category not found' }, { status: 404 });
    }

    // Get children
    const children = db.prepare('SELECT * FROM categories WHERE parent_id = ? AND is_active = 1 ORDER BY sort_order ASC').all(category.id);

    return Response.json({ success: true, data: { ...category, children } });
  } catch (error) {
    console.error('Category detail error:', error);
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

    const existing = db.prepare('SELECT * FROM categories WHERE id = ?').get(id) as any;
    if (!existing) {
      return Response.json({ success: false, message: 'Category not found' }, { status: 404 });
    }

    const newSlug = body.name ? slugify(body.name) : existing.slug;

    db.prepare(
      `UPDATE categories SET name=?, slug=?, parent_id=?, description=?, image=?, sort_order=?, is_active=?, updated_at=datetime('now') WHERE id=?`
    ).run(
      body.name || existing.name, newSlug, body.parent_id !== undefined ? body.parent_id : existing.parent_id,
      body.description ?? existing.description, body.image ?? existing.image,
      body.sort_order ?? existing.sort_order,
      body.is_active !== undefined ? (body.is_active ? 1 : 0) : existing.is_active, id
    );

    const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
    return Response.json({ success: true, data: category });
  } catch (error: any) {
    if (error.status === 401 || error.status === 403) {
      return Response.json({ success: false, message: error.message }, { status: error.status });
    }
    console.error('Update category error:', error);
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

    // Move children to parent
    const existing = db.prepare('SELECT * FROM categories WHERE id = ?').get(id) as any;
    if (!existing) {
      return Response.json({ success: false, message: 'Category not found' }, { status: 404 });
    }

    db.prepare('UPDATE categories SET parent_id = ? WHERE parent_id = ?').run(existing.parent_id, id);
    db.prepare('DELETE FROM categories WHERE id = ?').run(id);

    return Response.json({ success: true, message: 'Category deleted' });
  } catch (error: any) {
    if (error.status === 401 || error.status === 403) {
      return Response.json({ success: false, message: error.message }, { status: error.status });
    }
    console.error('Delete category error:', error);
    return Response.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
