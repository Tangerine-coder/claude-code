import { NextRequest } from 'next/server';
import getDb from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);
    const db = getDb();

    const today = new Date().toISOString().split('T')[0];

    // Today's stats
    const todayOrders = db.prepare(
      "SELECT COUNT(*) as count, COALESCE(SUM(total_amount), 0) as revenue FROM orders WHERE date(created_at) = ?"
    ).get(today) as any;

    // Total stats
    const totalProducts = db.prepare("SELECT COUNT(*) as count FROM products WHERE status = 'active'").get() as any;
    const totalUsers = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'customer'").get() as any;
    const totalOrders = db.prepare("SELECT COUNT(*) as count FROM orders").get() as any;
    const totalRevenue = db.prepare("SELECT COALESCE(SUM(total_amount), 0) as total FROM orders WHERE status NOT IN ('cancelled', 'refunded')").get() as any;

    // Recent orders
    const recentOrders = db.prepare(
      `SELECT o.*, u.username as customer_name, u.email as customer_email
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       ORDER BY o.created_at DESC LIMIT 5`
    ).all();

    // Top products
    const topProducts = db.prepare(
      "SELECT name, sales_count, price FROM products WHERE status = 'active' ORDER BY sales_count DESC LIMIT 5"
    ).all();

    // Low stock
    const lowStock = db.prepare(
      "SELECT name, stock FROM products WHERE status = 'active' AND stock <= 10 ORDER BY stock ASC LIMIT 5"
    ).all();

    return Response.json({
      success: true,
      data: {
        today_orders: todayOrders.count,
        today_revenue: todayOrders.revenue || 0,
        total_products: totalProducts.count,
        total_users: totalUsers.count,
        total_orders: totalOrders.count,
        total_revenue: totalRevenue.total || 0,
        recent_orders: recentOrders,
        top_products: topProducts,
        low_stock: lowStock,
      },
    });
  } catch (error: any) {
    if (error.status === 401 || error.status === 403) {
      return Response.json({ success: false, message: error.message }, { status: error.status });
    }
    return Response.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
