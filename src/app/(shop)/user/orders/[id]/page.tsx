'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import { formatPrice } from '@/lib/utils';
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

interface ShippingAddress {
  receiver_name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  detail: string;
  zip_code: string;
}

interface Order {
  id: string;
  order_no: string;
  status: string;
  total_amount: number;
  discount_amount: number;
  shipping_fee: number;
  payment_method: string;
  shipping_address: string;
  remark: string;
  paid_at: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  created_at: string;
  items: OrderItem[];
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

const statusSteps = [
  { key: 'paid', label: '已付款', icon: '💳' },
  { key: 'shipped', label: '已发货', icon: '📦' },
  { key: 'delivered', label: '已完成', icon: '✅' },
];

function parseSpec(specInfo: string): string {
  try {
    const spec = JSON.parse(specInfo);
    if (typeof spec === 'object' && spec !== null) {
      return Object.values(spec).join(' / ') || '无';
    }
    return specInfo || '无';
  } catch {
    return specInfo || '无';
  }
}

function parseShippingAddress(addrStr: string): ShippingAddress | null {
  try {
    return JSON.parse(addrStr);
  } catch {
    return null;
  }
}

function getTimelineStepIndex(order: Order): number {
  if (order.status === 'delivered') return 3;
  if (order.status === 'shipped') return 2;
  if (order.status === 'paid') return 1;
  return 0;
}

export default function OrderDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${id}`);
        const data = await res.json();
        if (data.success) {
          setOrder(data.data);
        } else {
          setError(data.message || 'Order not found');
        }
      } catch (err) {
        setError('Failed to load order');
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton variant="text" width="200px" />
          <Skeleton variant="rect" width="100px" height="28px" />
        </div>
        <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
          <Skeleton variant="text" width="150px" />
          <div className="mt-4 flex gap-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} variant="rect" width="60px" height="60px" />
            ))}
          </div>
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-[var(--color-border)] p-5 flex gap-4">
            <Skeleton variant="rect" width="80px" height="80px" />
            <div className="flex-1 space-y-2">
              <Skeleton variant="text" width="70%" />
              <Skeleton variant="text" width="40%" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error || !order) {
    return (
      <EmptyState
        icon={<FiPackage className="w-12 h-12" />}
        title="订单未找到"
        description={error || '您要查找的订单不存在'}
        actionLabel="返回订单列表"
        actionHref="/user/orders"
      />
    );
  }

  const shipping = parseShippingAddress(order.shipping_address);
  const timelineIndex = getTimelineStepIndex(order);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">订单详情</h1>
          <p className="text-sm text-[var(--color-text-light)] mt-1">
            {order.order_no} &middot; {new Date(order.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        <Badge variant={statusVariant[order.status] || 'default'}>
          {statusLabel[order.status] || order.status}
        </Badge>
      </div>

      {/* Status Timeline */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
        <h3 className="font-semibold text-[var(--color-text)] mb-4">订单状态</h3>
        <div className="flex items-center gap-0">
          {/* Pending step */}
          <div className="flex flex-col items-center flex-1">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold bg-[var(--color-accent)] text-white">
              1
            </div>
            <span className="text-xs font-medium text-[var(--color-text)] mt-2">待付款</span>
          </div>
          <div className="flex-1 h-0.5 -mt-6 bg-gray-200">
            <div className="h-full bg-[var(--color-accent)]" style={{ width: timelineIndex >= 1 ? '100%' : '0%' }} />
          </div>
          {/* Paid step */}
          <div className="flex flex-col items-center flex-1">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
              timelineIndex >= 1 ? 'bg-[var(--color-accent)] text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              2
            </div>
            <span className="text-xs font-medium text-[var(--color-text)] mt-2">已付款</span>
            {order.paid_at && <span className="text-[10px] text-[var(--color-text-lighter)]">{new Date(order.paid_at).toLocaleDateString()}</span>}
          </div>
          <div className="flex-1 h-0.5 -mt-6 bg-gray-200">
            <div className="h-full bg-[var(--color-accent)]" style={{ width: timelineIndex >= 2 ? '100%' : '0%' }} />
          </div>
          {/* Shipped step */}
          <div className="flex flex-col items-center flex-1">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
              timelineIndex >= 2 ? 'bg-[var(--color-accent)] text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              3
            </div>
            <span className="text-xs font-medium text-[var(--color-text)] mt-2">已发货</span>
            {order.shipped_at && <span className="text-[10px] text-[var(--color-text-lighter)]">{new Date(order.shipped_at).toLocaleDateString()}</span>}
          </div>
          <div className="flex-1 h-0.5 -mt-6 bg-gray-200">
            <div className="h-full bg-[var(--color-accent)]" style={{ width: timelineIndex >= 3 ? '100%' : '0%' }} />
          </div>
          {/* Delivered step */}
          <div className="flex flex-col items-center flex-1">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
              timelineIndex >= 3 ? 'bg-[var(--color-accent)] text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              4
            </div>
            <span className="text-xs font-medium text-[var(--color-text)] mt-2">已完成</span>
            {order.delivered_at && <span className="text-[10px] text-[var(--color-text-lighter)]">{new Date(order.delivered_at).toLocaleDateString()}</span>}
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--color-border)]">
          <h3 className="font-semibold text-[var(--color-text)]">商品信息（共{order.items.length}件）</h3>
        </div>
        <div className="divide-y divide-[var(--color-border)]">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-4 px-6 py-4">
              <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                <ImageWithFallback
                  src={item.product_image || '/images/placeholder.svg'}
                  alt={item.product_name}
                  className="w-full h-full object-cover"
                  wrapperClassName="w-full h-full"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-[var(--color-text)] line-clamp-2">{item.product_name}</h4>
                <p className="text-xs text-[var(--color-text-light)] mt-1">{parseSpec(item.spec_info)}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-[var(--color-text)]">
                    {formatPrice(item.price)} x {item.quantity}
                  </span>
                  <span className="text-sm font-semibold text-[var(--color-text)]">
                    {formatPrice(item.subtotal)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping Address */}
        <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
          <h3 className="font-semibold text-[var(--color-text)] mb-3">收货地址</h3>
          {shipping ? (
            <div className="text-sm text-[var(--color-text-light)] space-y-1">
              <p className="font-medium text-[var(--color-text)]">{shipping.receiver_name} - {shipping.phone}</p>
              <p>{shipping.province} {shipping.city} {shipping.district}</p>
              <p>{shipping.detail}</p>
              {shipping.zip_code && <p>邮编: {shipping.zip_code}</p>}
            </div>
          ) : (
            <p className="text-sm text-[var(--color-text-lighter)]">暂无收货地址</p>
          )}
        </div>

        {/* Payment Info */}
        <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
          <h3 className="font-semibold text-[var(--color-text)] mb-3">支付方式</h3>
          <div className="text-sm text-[var(--color-text-light)] space-y-2">
            <div className="flex justify-between">
              <span>支付方式</span>
              <span className="font-medium text-[var(--color-text)] capitalize">{order.payment_method || '无'}</span>
            </div>
            {order.remark && (
              <div className="flex justify-between">
                <span>备注</span>
                <span className="font-medium text-[var(--color-text)]">{order.remark}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Totals */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
        <h3 className="font-semibold text-[var(--color-text)] mb-3">费用明细</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between text-[var(--color-text-light)]">
            <span>商品总额</span>
            <span>{formatPrice(order.total_amount - order.shipping_fee + order.discount_amount)}</span>
          </div>
          {order.discount_amount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>优惠</span>
              <span>-{formatPrice(order.discount_amount)}</span>
            </div>
          )}
          <div className="flex justify-between text-[var(--color-text-light)]">
            <span>运费</span>
            <span>{order.shipping_fee > 0 ? formatPrice(order.shipping_fee) : '免运费'}</span>
          </div>
          <div className="flex justify-between font-bold text-[var(--color-text)] text-base border-t border-[var(--color-border)] pt-3">
            <span>实付金额</span>
            <span>{formatPrice(order.total_amount)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
