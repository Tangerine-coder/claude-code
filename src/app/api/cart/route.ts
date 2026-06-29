import { NextRequest } from 'next/server';
import getDb from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { v4 as uuid } from 'uuid';

// GET cart
export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const auth = getAuthUser(request);
    const sessionId = request.nextUrl.searchParams.get('session_id') || '';

    let items: any[];

    if (auth) {
      // Logged in: get user's cart
      items = db.prepare(
        `SELECT ci.*, p.name as product_name, p.slug as product_slug, p.price, p.original_price, p.stock,
                (SELECT json_extract(images, '$[0]') FROM products WHERE id = ci.product_id) as product_image
         FROM cart_items ci
         JOIN products p ON ci.product_id = p.id
         WHERE ci.user_id = ?
         ORDER BY ci.created_at DESC`
      ).all(auth.userId);
    } else if (sessionId) {
      items = db.prepare(
        `SELECT ci.*, p.name as product_name, p.slug as product_slug, p.price, p.original_price, p.stock,
                (SELECT json_extract(images, '$[0]') FROM products WHERE id = ci.product_id) as product_image
         FROM cart_items ci
         JOIN products p ON ci.product_id = p.id
         WHERE ci.session_id = ?
         ORDER BY ci.created_at DESC`
      ).all(sessionId);
    } else {
      items = [];
    }

    return Response.json({ success: true, data: items });
  } catch (error) {
    console.error('Cart GET error:', error);
    return Response.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

// POST add item
export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const auth = getAuthUser(request);
    const body = await request.json();

    const { session_id, product_id, sku_id, spec_info, quantity } = body;

    const userId = auth?.userId || null;

    if (!product_id) {
      return Response.json({ success: false, message: 'Product ID is required' }, { status: 400 });
    }

    // Check product exists
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(product_id) as any;
    if (!product) {
      return Response.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    // Check if already in cart
    const existing = db.prepare(
      `SELECT * FROM cart_items WHERE product_id = ? AND sku_id IS ? AND ((user_id = ? AND user_id IS NOT NULL) OR (session_id = ? AND session_id IS NOT NULL))`
    ).get(product_id, sku_id || null, userId, userId ? null : session_id || '');

    if (existing) {
      // Update quantity
      db.prepare('UPDATE cart_items SET quantity = quantity + ? WHERE id = ?').run(quantity || 1, (existing as any).id);
    } else {
      const id = uuid();
      db.prepare(
        `INSERT INTO cart_items (id, user_id, session_id, product_id, sku_id, spec_info, quantity) VALUES (?, ?, ?, ?, ?, ?, ?)`
      ).run(id, userId, session_id || null, product_id, sku_id || null, spec_info || '{}', quantity || 1);
    }

    return Response.json({ success: true, message: 'Added to cart' });
  } catch (error) {
    console.error('Cart POST error:', error);
    return Response.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

// PUT update quantity
export async function PUT(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();
    const { cart_item_id, quantity } = body;

    db.prepare('UPDATE cart_items SET quantity = ? WHERE id = ?').run(Math.max(1, quantity), cart_item_id);
    return Response.json({ success: true, message: 'Updated' });
  } catch (error) {
    console.error('Cart PUT error:', error);
    return Response.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

// DELETE remove item or clear cart
export async function DELETE(request: NextRequest) {
  try {
    const db = getDb();
    const auth = getAuthUser(request);
    const { searchParams } = request.nextUrl;
    const cartItemId = searchParams.get('cart_item_id');
    const clearAll = searchParams.get('clear_all');
    const sessionId = searchParams.get('session_id') || '';

    if (clearAll) {
      if (auth) {
        db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(auth.userId);
      } else {
        db.prepare('DELETE FROM cart_items WHERE session_id = ?').run(sessionId);
      }
    } else if (cartItemId) {
      db.prepare('DELETE FROM cart_items WHERE id = ?').run(cartItemId);
    }

    return Response.json({ success: true, message: 'Removed' });
  } catch (error) {
    console.error('Cart DELETE error:', error);
    return Response.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
