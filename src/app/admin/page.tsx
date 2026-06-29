'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Badge from '@/components/ui/Badge';
import { formatPrice } from '@/lib/utils';

interface DashboardData {
  today_orders: number;
  today_revenue: number;
  total_products: number;
  total_users: number;
  total_orders: number;
  total_revenue: number;
  recent_orders: Array<{
    id: string;
    order_no: string;
    customer_name: string | null;
    status: string;
    total_amount: number;
    created_at: string;
  }>;
  top_products: Array<{
    name: string;
    sales_count: number;
    price: number;
  }>;
  low_stock: Array<{
    name: string;
    stock: number;
  }>;
}

const statusBadge: Record<string, { label: string; variant: 'default' | 'new' | 'sale' | 'hot' }> = {
  pending_payment: { label: '待付款', variant: 'default' },
  paid: { label: '已付款', variant: 'new' },
  shipped: { label: '已发货', variant: 'sale' },
  delivered: { label: '已完成', variant: 'hot' },
  cancelled: { label: '已取消', variant: 'default' },
  refunded: { label: '已退款', variant: 'default' },
};

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl border border-[var(--color-border)] p-5 flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-sm text-[var(--color-text-light)]">{label}</p>
        <p className="text-xl font-bold text-[var(--color-text)]">{value}</p>
      </div>
    </div>
  );
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch('/api/dashboard', { credentials: 'include' });
        const json = await res.json();
        if (!json.success) throw new Error(json.message || '加载控制台数据失败');
        setData(json.data);
        setError('');
      } catch (err: any) {
        setError(err.message || '加载控制台数据失败');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchDashboard, 30000);
    return () => clearInterval(interval);
  }, []);

  // Count pending orders
  const pendingOrders = data?.recent_orders?.filter(o => o.status === 'pending_payment') || [];

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">控制台</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-[var(--color-border)] p-5 animate-pulse">
              <div className="w-12 h-12 rounded-xl bg-gray-200 mb-3" />
              <div className="h-3 bg-gray-200 rounded w-2/3 mb-2" />
              <div className="h-6 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">控制台</h1>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--color-text)]">控制台</h1>

      {/* Pending orders alert */}
      {pendingOrders.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center gap-3 animate-pulse">
          <span className="text-2xl">🔔</span>
          <div className="flex-1">
            <p className="font-bold text-orange-800">
              有 {pendingOrders.length} 笔新订单等待处理！
            </p>
            <p className="text-sm text-orange-600">
              {pendingOrders.slice(0, 3).map(o => o.order_no).join('、')}
              {pendingOrders.length > 3 && ` 等${pendingOrders.length}笔`} 待付款
            </p>
          </div>
          <button
            onClick={() => router.push('/admin/orders?status=pending_payment')}
            className="px-4 py-2 bg-[var(--color-accent)] text-white text-sm font-bold rounded-lg hover:bg-[var(--color-accent-dark)] transition-colors whitespace-nowrap"
          >
            立即处理 →
          </button>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>}
          label="今日订单"
          value={String(data.today_orders)}
        />
        <StatCard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          label="今日营收"
          value={formatPrice(data.today_revenue)}
        />
        <StatCard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>}
          label="商品总数"
          value={String(data.total_products)}
        />
        <StatCard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" /></svg>}
          label="用户总数"
          value={String(data.total_users)}
        />
      </div>

      {/* Content grids */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[var(--color-border)]">
          <div className="px-5 py-4 border-b border-[var(--color-border)]">
            <h2 className="font-semibold text-[var(--color-text)]">最近订单</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <th className="text-left px-5 py-3 font-medium text-[var(--color-text-light)]">订单</th>
                  <th className="text-left px-5 py-3 font-medium text-[var(--color-text-light)]">客户</th>
                  <th className="text-left px-5 py-3 font-medium text-[var(--color-text-light)]">状态</th>
                  <th className="text-right px-5 py-3 font-medium text-[var(--color-text-light)]">金额</th>
                  <th className="text-right px-5 py-3 font-medium text-[var(--color-text-light)]">日期</th>
                </tr>
              </thead>
              <tbody>
                {data.recent_orders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-[var(--color-text-light)]">暂无订单</td>
                  </tr>
                ) : (
                  data.recent_orders.map((order) => (
                    <tr key={order.id} className="border-b border-[var(--color-border)] hover:bg-gray-50 cursor-pointer" onClick={() => router.push(`/admin/orders/${order.id}`)}>
                      <td className="px-5 py-3 font-medium">{order.order_no}</td>
                      <td className="px-5 py-3">{order.customer_name || '游客'}</td>
                      <td className="px-5 py-3">
                        <Badge variant={statusBadge[order.status]?.variant || 'default'}>
                          {statusBadge[order.status]?.label || order.status}
                        </Badge>
                      </td>
                      <td className="px-5 py-3 text-right">{formatPrice(order.total_amount)}</td>
                      <td className="px-5 py-3 text-right text-[var(--color-text-light)]">{formatDate(order.created_at)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Side panels */}
        <div className="space-y-6">
          {/* Top Products */}
          <div className="bg-white rounded-xl border border-[var(--color-border)]">
            <div className="px-5 py-4 border-b border-[var(--color-border)]">
              <h2 className="font-semibold text-[var(--color-text)]">热销商品排行</h2>
            </div>
            <div className="p-5 space-y-3">
              {data.top_products.length === 0 ? (
                <p className="text-sm text-[var(--color-text-light)]">暂无数据</p>
              ) : (
                data.top_products.map((product, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--color-text)] truncate">{product.name}</p>
                      <p className="text-xs text-[var(--color-text-light)]">{product.sales_count} 已售</p>
                    </div>
                    <span className="text-sm font-semibold text-[var(--color-text)] ml-3">{formatPrice(product.price)}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Low Stock Alerts */}
          <div className="bg-white rounded-xl border border-[var(--color-border)]">
            <div className="px-5 py-4 border-b border-[var(--color-border)]">
              <h2 className="font-semibold text-[var(--color-text)]">库存预警</h2>
            </div>
            <div className="p-5 space-y-3">
              {data.low_stock.length === 0 ? (
                <p className="text-sm text-green-600">所有商品库存充足</p>
              ) : (
                data.low_stock.map((product, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm text-[var(--color-text)] truncate">{product.name}</span>
                    <Badge variant={product.stock === 0 ? 'hot' : 'discount'}>
                      {product.stock === 0 ? '缺货' : `剩余${product.stock}件`}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
