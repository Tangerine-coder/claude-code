'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { formatPrice } from '@/lib/utils';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import Badge from '@/components/ui/Badge';
import { FiPackage, FiHeart, FiMapPin, FiArrowRight } from 'react-icons/fi';

interface OrderSummary {
  id: string;
  order_no: string;
  status: string;
  total_amount: number;
  item_count: number;
  created_at: string;
}

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

export default function UserProfilePage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [addressesCount, setAddressesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [ordersRes, favRes, addrRes] = await Promise.all([
          fetch('/api/orders'),
          fetch('/api/favorites'),
          fetch('/api/addresses'),
        ]);

        const [ordersData, favData, addrData] = await Promise.all([
          ordersRes.json(),
          favRes.json(),
          addrRes.json(),
        ]);

        if (ordersData.success) {
          const orderItems = ordersData.data.map((order: any) => ({
            ...order,
            item_count: (order.items || []).length,
          }));
          setOrders(orderItems.slice(0, 3));
        }
        if (favData.success) setFavoritesCount(favData.data.length);
        if (addrData.success) setAddressesCount(addrData.data.length);
      } catch (err) {
        console.error('Failed to load profile data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton variant="text" width="200px" />
          <Skeleton variant="text" width="150px" className="mt-2" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-surface rounded-xl border border-[var(--color-border)] p-5">
              <Skeleton variant="rect" height="24px" width="80px" />
              <Skeleton variant="text" width="40px" className="mt-3" />
            </div>
          ))}
        </div>
        <div className="glass-surface rounded-xl border border-[var(--color-border)] p-6">
          <Skeleton variant="text" width="160px" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="mt-4 py-4 border-b border-[var(--color-border)]">
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="text" width="40%" className="mt-2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">
          欢迎回来，{user?.username || '尊敬的顾客'}
        </h1>
        <p className="text-sm text-[var(--color-text-light)] mt-1">欢迎访问您的个人中心</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-surface rounded-xl border border-[var(--color-border)] p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-text-light)]">总订单</p>
              <p className="text-2xl font-bold text-[var(--color-text)] mt-1">{orders.length}</p>
            </div>
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <FiPackage className="w-5 h-5 text-blue-500" />
            </div>
          </div>
        </div>
        <div className="glass-surface rounded-xl border border-[var(--color-border)] p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-text-light)]">收藏商品</p>
              <p className="text-2xl font-bold text-[var(--color-text)] mt-1">{favoritesCount}</p>
            </div>
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <FiHeart className="w-5 h-5 text-red-500" />
            </div>
          </div>
        </div>
        <div className="glass-surface rounded-xl border border-[var(--color-border)] p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-text-light)]">收货地址</p>
              <p className="text-2xl font-bold text-[var(--color-text)] mt-1">{addressesCount}</p>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <FiMapPin className="w-5 h-5 text-green-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="glass-surface rounded-xl border border-[var(--color-border)] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
          <h2 className="font-semibold text-[var(--color-text)]">最近订单</h2>
          <Link href="/user/orders" className="text-sm text-[var(--color-accent)] hover:underline flex items-center gap-1">
            查看全部 <FiArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="divide-y divide-[var(--color-border)]">
          {orders.length === 0 ? (
            <div className="py-8">
              <EmptyState
                title="暂无订单"
                description="快去购物吧，您的订单将在这里显示"
                actionLabel="去逛逛"
                actionHref="/products"
              />
            </div>
          ) : (
            orders.map((order) => (
              <Link
                key={order.id}
                href={`/user/orders/${order.id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-[var(--color-text)]">{order.order_no}</p>
                  <p className="text-xs text-[var(--color-text-light)] mt-0.5">
                    {new Date(order.created_at).toLocaleDateString()} &middot; {order.item_count} 件
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={statusVariant[order.status] || 'default'}>
                    {statusLabel[order.status] || order.status}
                  </Badge>
                  <span className="text-sm font-semibold text-[var(--color-text)]">
                    {formatPrice(order.total_amount)}
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
