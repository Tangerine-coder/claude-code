'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';
import Pagination from '@/components/ui/Pagination';
import EmptyState from '@/components/ui/EmptyState';
import { formatPrice } from '@/lib/utils';

type OrderStatus = 'pending_payment' | 'paid' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

interface Order {
  id: string;
  order_no: string;
  user_id: string | null;
  customer_name: string | null;
  customer_email: string | null;
  status: OrderStatus;
  total_amount: number;
  shipping_fee: number;
  created_at: string;
  updated_at: string;
}

const TABS: { label: string; value: OrderStatus | '' }[] = [
  { label: '全部', value: '' },
  { label: '待付款', value: 'pending_payment' },
  { label: '已付款', value: 'paid' },
  { label: '已发货', value: 'shipped' },
  { label: '已完成', value: 'delivered' },
  { label: '已取消', value: 'cancelled' },
];

const statusBadgeVariant: Record<string, 'new' | 'default' | 'hot' | 'sale'> = {
  pending_payment: 'default',
  paid: 'new',
  shipped: 'sale',
  delivered: 'hot',
  cancelled: 'default',
  refunded: 'default',
};

const statusLabels: Record<string, string> = {
  pending_payment: '待付款',
  paid: '已付款',
  shipped: '已发货',
  delivered: '已完成',
  cancelled: '已取消',
  refunded: '已退款',
};

function AdminOrdersPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('user_id') || '';
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<OrderStatus | ''>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('limit', '100');
      if (activeTab) params.set('status', activeTab);
      if (userId) params.set('user_id', userId);
      params.set('page', String(page));

      const res = await fetch(`/api/orders?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setOrders(json.data || []);
        if (json.pagination) {
          setTotalPages(json.pagination.totalPages);
        }
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, page, userId]);

  useEffect(() => {
    setPage(1);
  }, [activeTab]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-[var(--color-text)]">订单管理</h1>
          {userId && (
            <Link
              href="/admin/users"
              className="inline-flex items-center gap-1 text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] hover:underline transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              返回用户列表
            </Link>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 flex-wrap glass-surface rounded-lg p-1 shadow-sm border border-[var(--color-border)]">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === tab.value
                ? 'bg-[var(--color-primary)] text-white shadow-sm'
                : 'text-[var(--color-text-light)] hover:text-[var(--color-text)] hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="glass-surface rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 space-y-3">
            {Array.from({ length: 8 }, (_, i) => (
              <Skeleton key={i} variant="rect" height="56px" />
            ))}
          </div>
        </div>
      ) : orders.length === 0 ? (
        <EmptyState title="未找到订单" description="没有匹配此筛选条件的订单。" />
      ) : (
        <>
          <div className="glass-surface rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left text-xs font-semibold text-[var(--color-text-light)] uppercase tracking-wider px-4 py-3">
                      订单号
                    </th>
                    <th className="text-left text-xs font-semibold text-[var(--color-text-light)] uppercase tracking-wider px-4 py-3">
                      客户
                    </th>
                    <th className="text-left text-xs font-semibold text-[var(--color-text-light)] uppercase tracking-wider px-4 py-3">
                      日期
                    </th>
                    <th className="text-left text-xs font-semibold text-[var(--color-text-light)] uppercase tracking-wider px-4 py-3">
                      状态
                    </th>
                    <th className="text-right text-xs font-semibold text-[var(--color-text-light)] uppercase tracking-wider px-4 py-3">
                      金额
                    </th>
                    <th className="text-right text-xs font-semibold text-[var(--color-text-light)] uppercase tracking-wider px-4 py-3">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => router.push(`/admin/orders/${order.id}`)}
                    >
                      <td className="px-4 py-3 font-mono text-sm font-medium">
                        {order.order_no}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {order.customer_name || '游客'}
                      </td>
                      <td className="px-4 py-3 text-sm text-[var(--color-text-light)]">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={statusBadgeVariant[order.status] || 'default'}>
                          {statusLabels[order.status] || order.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-right">
                        {formatPrice(order.total_amount)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/admin/orders/${order.id}`);
                          }}
                        >
                          查看
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={<div className="p-6"><div className="animate-spin w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full" /></div>}>
      <AdminOrdersPageInner />
    </Suspense>
  );
}
