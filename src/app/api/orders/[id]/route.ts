import { NextRequest } from 'next/server';
import getDb from '@/lib/db';
import { getAuthUser, requireAdmin } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();
    const auth = getAuthUser(request);

    const order = db.prepare(
      `SELECT o.*, u.username as customer_name, u.email as customer_email, u.phone as customer_phone
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       WHERE o.id = ? OR o.order_no = ?`
    ).get(id, id) as any;
    if (!order) {
      return Response.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    // Check access
    if (auth?.role !== 'admin' && order.user_id !== auth?.userId) {
      return Response.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);

    return Response.json({ success: true, data: { ...order, items } });
  } catch (error) {
    console.error('Order detail error:', error);
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

    const existing = db.prepare('SELECT * FROM orders WHERE id = ?').get(id) as any;
    if (!existing) {
      return Response.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    const now = new Date().toISOString();
    const updates: string[] = ['updated_at = datetime(\'now\')'];
    const bindings: any[] = [];

    if (body.status) {
      updates.push('status = ?');
      bindings.push(body.status);

      if (body.status === 'paid') {
        updates.push('paid_at = ?');
        bindings.push(now);
      } else if (body.status === 'shipped') {
        updates.push('shipped_at = ?');
        bindings.push(now);
      } else if (body.status === 'delivered') {
        updates.push('delivered_at = ?');
        bindings.push(now);
      }
    }

    if (body.remark !== undefined) {
      updates.push('remark = ?');
      bindings.push(body.remark);
    }

    bindings.push(id);
    db.prepare(`UPDATE orders SET ${updates.join(', ')} WHERE id = ?`).run(...bindings);

    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
    return Response.json({ success: true, data: order });
  } catch (error: any) {
    if (error.status === 401 || error.status === 403) {
      return Response.json({ success: false, message: error.message }, { status: error.status });
    }
    console.error('Update order error:', error);
    return Response.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
