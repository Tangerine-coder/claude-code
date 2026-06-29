import { NextRequest } from 'next/server';
import getDb from '@/lib/db';
import { getAuthUser, requireAdmin } from '@/lib/auth';
import { v4 as uuid } from 'uuid';
import { generateOrderNo } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const auth = getAuthUser(request);
    const { searchParams } = request.nextUrl;

    // Admin: can view all orders
    if (auth?.role === 'admin') {
      const status = searchParams.get('status');
      const page = parseInt(searchParams.get('page') || '1');
      const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
      const offset = (page - 1) * limit;

      let sql = 'SELECT o.*, u.username as customer_name, u.email as customer_email FROM orders o LEFT JOIN users u ON o.user_id = u.id';
      let countSql = 'SELECT COUNT(*) as total FROM orders o';
      const bindings: any[] = [];
      const countBindings: any[] = [];

      if (status) {
        sql += ' WHERE o.status = ?';
        countSql += ' WHERE o.status = ?';
        bindings.push(status);
        countBindings.push(status);
      }

      sql += ' ORDER BY o.created_at DESC LIMIT ? OFFSET ?';
      bindings.push(limit, offset);

      const orders = db.prepare(sql).all(...bindings);
      const { total } = db.prepare(countSql).get(...countBindings) as { total: number };

      return Response.json({
        success: true,
        data: orders,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      });
    }

    // Customer: only their own orders
    if (!auth) {
      return Response.json({ success: false, message: 'Please login' }, { status: 401 });
    }

    const orders = db.prepare(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC'
    ).all(auth.userId);

    // Get items for each order
    const ordersWithItems = orders.map((order: any) => {
      const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);
      return { ...order, items };
    });

    return Response.json({ success: true, data: ordersWithItems });
  } catch (error) {
    console.error('Orders GET error:', error);
    return Response.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const auth = getAuthUser(request);
    const body = await request.json();

    if (!auth) {
      return Response.json({ success: false, message: 'Please login to place an order' }, { status: 401 });
    }

    const { address_id, payment_method, remark, cart_items } = body;

    // Get address
    const address = db.prepare('SELECT * FROM addresses WHERE id = ? AND user_id = ?').get(address_id, auth.userId) as any;
    if (!address) {
      return Response.json({ success: false, message: 'Invalid shipping address' }, { status: 400 });
    }

    // Get cart items
    let items;
    if (cart_items && cart_items.length > 0) {
      items = cart_items;
    } else {
      items = db.prepare(
        `SELECT ci.*, p.name, p.price, p.stock,
                (SELECT json_extract(images, '$[0]') FROM products WHERE id = ci.product_id) as image
         FROM cart_items ci JOIN products p ON ci.product_id = p.id WHERE ci.user_id = ?`
      ).all(auth.userId);
    }

    if (!items || items.length === 0) {
      return Response.json({ success: false, message: 'Cart is empty' }, { status: 400 });
    }

    // Calculate totals
    let totalAmount = 0;
    const orderItems: any[] = [];

    for (const item of items) {
      const price = item.price || 0;
      const qty = item.quantity || 0;
      const subtotal = price * qty;
      totalAmount += subtotal;

      orderItems.push({
        product_id: item.product_id,
        product_name: item.name || item.product_name,
        product_image: item.image || item.product_image || '',
        spec_info: item.spec_info || '{}',
        price,
        quantity: qty,
        subtotal,
      });

      // Update stock
      db.prepare('UPDATE products SET stock = MAX(0, stock - ?), sales_count = sales_count + ? WHERE id = ?').run(qty, qty, item.product_id);
    }

    // Shipping fee
    const shippingFee = totalAmount >= 50 ? 0 : 5.99;
    const orderId = uuid();
    const orderNo = generateOrderNo();

    const shippingAddress = JSON.stringify({
      receiver_name: address.receiver_name,
      phone: address.phone,
      province: address.province,
      city: address.city,
      district: address.district,
      detail: address.detail,
      zip_code: address.zip_code,
    });

    db.prepare(
      `INSERT INTO orders (id, order_no, user_id, status, total_amount, shipping_fee, payment_method, shipping_address, remark)
       VALUES (?, ?, ?, 'pending_payment', ?, ?, ?, ?, ?)`
    ).run(orderId, orderNo, auth.userId, totalAmount + shippingFee, shippingFee, payment_method || '', shippingAddress, remark || '');

    // Insert order items
    const insertItem = db.prepare(
      `INSERT INTO order_items (id, order_id, product_id, product_name, product_image, spec_info, price, quantity, subtotal)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );

    for (const oi of orderItems) {
      insertItem.run(uuid(), orderId, oi.product_id, oi.product_name, oi.product_image, oi.spec_info, oi.price, oi.quantity, oi.subtotal);
    }

    // Clear cart
    db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(auth.userId);

    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);

    return Response.json({ success: true, data: order }, { status: 201 });
  } catch (error) {
    console.error('Create order error:', error);
    return Response.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
