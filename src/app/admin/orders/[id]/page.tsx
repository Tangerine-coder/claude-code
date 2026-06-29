'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import { formatPrice } from '@/lib/utils';

type OrderStatus = 'pending_payment' | 'paid' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
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
  user_id: string | null;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  status: OrderStatus;
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
  updated_at: string;
  items?: OrderItem[];
}

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

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  const fetchOrder = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${id}`);
      const json = await res.json();
      if (json.success) {
        setOrder(json.data);
      }
    } catch (err) {
      console.error('Failed to fetch order:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleStatusUpdate = async (newStatus: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        setOrder(json.data);
      } else {
        alert(json.message || '更新订单失败');
      }
    } catch (err) {
      console.error('Error updating order:', err);
      alert('更新订单失败');
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = async () => {
    setCancelLoading(true);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' }),
      });
      const json = await res.json();
      if (json.success) {
        setOrder(json.data);
        setCancelOpen(false);
      } else {
        alert(json.message || '取消订单失败');
      }
    } catch (err) {
      console.error('Error cancelling order:', err);
      alert('取消订单失败');
    } finally {
      setCancelLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton variant="rect" width="300px" height="32px" />
        <div className="glass-surface rounded-xl shadow-sm p-6 space-y-4">
          <Skeleton variant="rect" height="24px" />
          <Skeleton variant="rect" height="24px" />
          <Skeleton variant="rect" height="200px" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6">
        <EmptyState
          title="订单未找到"
          description="您要查找的订单不存在。"
          actionLabel="返回订单列表"
          onAction={() => router.push('/admin/orders')}
        />
      </div>
    );
  }

  let shippingAddress: ShippingAddress | null = null;
  try {
    shippingAddress = JSON.parse(order.shipping_address || '{}');
  } catch {
    shippingAddress = null;
  }

  const canCancel = order.status !== 'cancelled' && order.status !== 'refunded';

  return (
    <div className="p-6 max-w-5xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[var(--color-text-light)] mb-6">
        <Link href="/admin/orders" className="hover:text-[var(--color-primary)] transition-colors">
          订单管理
        </Link>
        <span>/</span>
        <span className="text-[var(--color-text)] font-medium">{order.order_no}</span>
      </div>

      {/* Order Header */}
      <div className="glass-surface rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-[var(--color-text)]">订单 {order.order_no}</h1>
            <p className="text-sm text-[var(--color-text-light)] mt-1">
              下单时间：{new Date(order.created_at).toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={statusBadgeVariant[order.status] || 'default'} size="md">
              {statusLabels[order.status] || order.status}
            </Badge>
          </div>
        </div>

        {/* Status Action Buttons */}
        <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-[var(--color-border)]">
          {order.status === 'pending_payment' && (
            <Button onClick={() => handleStatusUpdate('paid')} loading={updating}>
              标记为已付款
            </Button>
          )}
          {order.status === 'paid' && (
            <Button onClick={() => handleStatusUpdate('shipped')} loading={updating}>
              标记为已发货
            </Button>
          )}
          {order.status === 'shipped' && (
            <Button onClick={() => handleStatusUpdate('delivered')} loading={updating}>
              标记为已完成
            </Button>
          )}
          {canCancel && (
            <Button variant="danger" onClick={() => setCancelOpen(true)} disabled={updating}>
              取消订单
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items & Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="glass-surface rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--color-border)]">
              <h2 className="font-bold text-[var(--color-text)]">商品清单</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left text-xs font-semibold text-[var(--color-text-light)] uppercase tracking-wider px-4 py-3">
                      商品
                    </th>
                    <th className="text-right text-xs font-semibold text-[var(--color-text-light)] uppercase tracking-wider px-4 py-3">
                      单价
                    </th>
                    <th className="text-right text-xs font-semibold text-[var(--color-text-light)] uppercase tracking-wider px-4 py-3">
                      数量
                    </th>
                    <th className="text-right text-xs font-semibold text-[var(--color-text-light)] uppercase tracking-wider px-4 py-3">
                      小计
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  {(order.items || []).map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {item.product_image && (
                            <img
                              src={item.product_image}
                              alt={item.product_name}
                              className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                            />
                          )}
                          <span className="text-sm font-medium">{item.product_name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-right">{formatPrice(item.price)}</td>
                      <td className="px-4 py-3 text-sm text-right">{item.quantity}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-right">
                        {formatPrice(item.subtotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar: Customer Info, Shipping Address & Totals */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="glass-surface rounded-xl shadow-sm p-6">
            <h2 className="font-bold text-[var(--color-text)] mb-3">客户信息</h2>
            {order.customer_name ? (
              <div className="text-sm text-[var(--color-text-light)] space-y-1">
                <p className="font-medium text-[var(--color-text)]">{order.customer_name}</p>
                <p>{order.customer_email || '无邮箱'}</p>
                {order.customer_phone && <p>{order.customer_phone}</p>}
              </div>
            ) : (
              <p className="text-sm text-[var(--color-text-light)]">游客订单</p>
            )}
          </div>

          {/* Shipping Address */}
          {shippingAddress && (
            <div className="glass-surface rounded-xl shadow-sm p-6">
              <h2 className="font-bold text-[var(--color-text)] mb-3">收货信息</h2>
              <div className="text-sm text-[var(--color-text-light)] space-y-1">
                <p className="font-medium text-[var(--color-text)]">{shippingAddress.receiver_name}</p>
                <p>{shippingAddress.phone}</p>
                <p>
                  {shippingAddress.province} {shippingAddress.city} {shippingAddress.district}
                </p>
                <p>{shippingAddress.detail}</p>
                {shippingAddress.zip_code && <p>{shippingAddress.zip_code}</p>}
              </div>
            </div>
          )}

          {/* Order Totals */}
          <div className="glass-surface rounded-xl shadow-sm p-6">
            <h2 className="font-bold text-[var(--color-text)] mb-3">费用明细</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-[var(--color-text-light)]">商品总额</dt>
                <dd className="font-medium">
                  {formatPrice(order.total_amount - order.shipping_fee + order.discount_amount)}
                </dd>
              </div>
              {order.discount_amount > 0 && (
                <div className="flex justify-between">
                  <dt className="text-green-600">优惠</dt>
                  <dd className="font-medium text-green-600">-{formatPrice(order.discount_amount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-[var(--color-text-light)]">运费</dt>
                <dd className="font-medium">
                  {order.shipping_fee === 0 ? '免运费' : formatPrice(order.shipping_fee)}
                </dd>
              </div>
              <div className="flex justify-between border-t border-[var(--color-border)] pt-2">
                <dt className="font-bold text-[var(--color-text)]">实付金额</dt>
                <dd className="font-bold text-[var(--color-text)] text-lg">
                  {formatPrice(order.total_amount)}
                </dd>
              </div>
            </dl>
          </div>

          {/* Payment Info */}
          <div className="glass-surface rounded-xl shadow-sm p-6">
            <h2 className="font-bold text-[var(--color-text)] mb-3">支付信息</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-[var(--color-text-light)]">支付方式</dt>
                <dd className="font-medium">{order.payment_method || '无'}</dd>
              </div>
              {order.paid_at && (
                <div className="flex justify-between">
                  <dt className="text-[var(--color-text-light)]">付款时间</dt>
                  <dd className="font-medium">{new Date(order.paid_at).toLocaleString()}</dd>
                </div>
              )}
              {order.shipped_at && (
                <div className="flex justify-between">
                  <dt className="text-[var(--color-text-light)]">发货时间</dt>
                  <dd className="font-medium">{new Date(order.shipped_at).toLocaleString()}</dd>
                </div>
              )}
              {order.delivered_at && (
                <div className="flex justify-between">
                  <dt className="text-[var(--color-text-light)]">完成时间</dt>
                  <dd className="font-medium">{new Date(order.delivered_at).toLocaleString()}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>

      {/* Cancel Confirm */}
      <ConfirmDialog
        isOpen={cancelOpen}
        onClose={() => setCancelOpen(false)}
        onConfirm={handleCancel}
        title="取消订单"
        message={`确定要取消订单 ${order.order_no} 吗？此操作不可撤销。`}
        confirmLabel="是的，取消订单"
        variant="danger"
        loading={cancelLoading}
      />
    </div>
  );
}
