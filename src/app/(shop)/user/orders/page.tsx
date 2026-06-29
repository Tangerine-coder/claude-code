'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import { formatPrice } from '@/lib/utils';
import clsx from 'clsx';
import { FiPackage } from 'react-icons/fi';

interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  spec_info: string;
  price: number;
  quantity: number;
  subtotal: number;
}

interface Order {
  id: string;
  order_no: string;
  status: string;
  total_amount: number;
  created_at: string;
  items?: OrderItem[];
}

const tabs = [
  { key: 'all', label: '全部' },
  { key: 'pending_payment', label: '待付款' },
  { key: 'paid', label: '已付款' },
  { key: 'shipped', label: '已发货' },
  { key: 'delivered', label: '已完成' },
] as const;

const statusVariant: Record<string, 'new' | 'hot' | 'sale' | 'bestseller' | 'default'> = {
  pending_payment: 'default',
  paid: 'hot',
  shipped: 'sale',
  delivered: 'new',
  cancelled: 'default',
  refunded: 'default',
};

const statusLabel: Record<string, string> = {
  pending_payment: '待付款',
  paid: '已付款',
  shipped: '已发货',
  delivered: '已完成',
  cancelled: '已取消',
  refunded: '已退款',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('all');

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch('/api/orders');
        const data = await res.json();
        if (data.success) {
          setOrders(data.data);
        }
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const filteredOrders = activeTab === 'all'
    ? orders
    : orders.filter((o) => o.status === activeTab);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton variant="text" width="200px" />
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} variant="rect" width="100px" height="36px" />
          ))}
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-surface rounded-xl border border-[var(--color-border)] p-5">
            <div className="flex justify-between">
              <div>
                <Skeleton variant="text" width="160px" />
                <Skeleton variant="text" width="100px" className="mt-2" />
              </div>
              <Skeleton variant="rect" width="80px" height="24px" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--color-text)]">我的订单</h1>

      {/* Tab filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={clsx(
              'px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors',
              activeTab === tab.key
                ? 'bg-[var(--color-accent)] text-white'
                : 'bg-gray-100 text-[var(--color-text-light)] hover:bg-gray-200'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders list */}
      {filteredOrders.length === 0 ? (
        <EmptyState
          icon={<FiPackage className="w-12 h-12" />}
          title="没有找到订单"
          description={activeTab === 'all' ? '您还没有下过任何订单' : `没有状态为"${tabs.find(t => t.key === activeTab)?.label}"的订单`}
          actionLabel="去购物"
          actionHref="/products"
        />
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Link
              key={order.id}
              href={`/user/orders/${order.id}`}
              className="block glass-surface rounded-xl border border-[var(--color-border)] p-5 hover:shadow-md transition-all duration-200 hover:border-[var(--color-accent)]"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-[var(--color-text)]">{order.order_no}</p>
                  <p className="text-sm text-[var(--color-text-light)] mt-1">
                    {new Date(order.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <p className="text-xs text-[var(--color-text-lighter)] mt-1">
                    共{order.items?.length || 0}件
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant={statusVariant[order.status] || 'default'}>
                    {statusLabel[order.status] || order.status}
                  </Badge>
                  <p className="text-lg font-bold text-[var(--color-text)] mt-2">
                    {formatPrice(order.total_amount)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
