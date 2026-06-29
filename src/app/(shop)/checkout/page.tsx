'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Select, Textarea } from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import PriceDisplay from '@/components/ui/PriceDisplay';
import { formatPrice } from '@/lib/utils';
import { getRegionLabels } from '@/lib/regions';
import AddressSelector from '@/components/ui/AddressSelector';
import type { Address, ApiResponse } from '@/types';

function parseSpecInfo(specInfo: string): string {
  try {
    const parsed = JSON.parse(specInfo);
    if (typeof parsed === 'object' && parsed !== null) {
      return Object.values(parsed).join(' / ');
    }
    return '';
  } catch {
    return '';
  }
}

const emptyAddressForm = {
  receiver_name: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  detail: '',
  zip_code: '',
  is_default: false,
};

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { items, itemCount, subtotal, clearCart } = useCart();

  // Addresses
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');

  // New address modal
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressForm, setAddressForm] = useState(emptyAddressForm);
  const [addressFormSubmitting, setAddressFormSubmitting] = useState(false);
  const [addressFormError, setAddressFormError] = useState('');

  // Payment
  const [paymentMethod, setPaymentMethod] = useState('credit_card');

  // Order note
  const [remark, setRemark] = useState('');

  // Submit state
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const shipping = subtotal >= 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  // Fetch addresses
  const fetchAddresses = useCallback(async () => {
    try {
      setAddressesLoading(true);
      const res = await fetch('/api/addresses');
      const data: ApiResponse<Address[]> = await res.json();
      if (data.success && data.data) {
        setAddresses(data.data);
        const defaultAddr = data.data.find((a) => a.is_default === 1);
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr.id);
        } else if (data.data.length > 0) {
          setSelectedAddressId(data.data[0].id);
        }
      }
    } catch {
      // silently fail
    } finally {
      setAddressesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchAddresses();
    }
  }, [user, fetchAddresses]);

  // Handle new address submission
  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddressFormError('');

    if (!addressForm.receiver_name || !addressForm.phone || !addressForm.province || !addressForm.city || !addressForm.district || !addressForm.detail) {
      setAddressFormError('请填写所有必填字段');
      return;
    }

    try {
      setAddressFormSubmitting(true);
      const res = await fetch('/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addressForm),
      });
      const data: ApiResponse<Address> = await res.json();
      if (data.success && data.data) {
        setAddressForm(emptyAddressForm);
        setShowAddressModal(false);
        await fetchAddresses();
        setSelectedAddressId(data.data.id);
      } else {
        setAddressFormError(data.message || '保存地址失败');
      }
    } catch {
      setAddressFormError('网络错误，请重试');
    } finally {
      setAddressFormSubmitting(false);
    }
  };

  // Place order
  const handlePlaceOrder = async () => {
    setSubmitError('');

    if (!selectedAddressId) {
      setSubmitError('请选择收货地址');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address_id: selectedAddressId,
          payment_method: paymentMethod,
          remark,
        }),
      });
      const data: ApiResponse<{ id: string }> = await res.json();
      if (data.success && data.data) {
        await clearCart();
        router.push(`/checkout/success?orderId=${data.data.id}`);
      } else {
        setSubmitError(data.message || '订单提交失败，请重试');
      }
    } catch {
      setSubmitError('网络错误，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state while checking auth
  if (authLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-64 bg-gray-100 rounded-xl" />
              <div className="h-48 bg-gray-100 rounded-xl" />
            </div>
            <div className="h-64 bg-gray-100 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[var(--color-text)] mb-2">请先登录</h2>
          <p className="text-sm text-[var(--color-text-light)] mb-6">
            下单前请先登录
          </p>
          <Link href="/login">
            <Button variant="primary" size="lg">前往登录</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Empty cart
  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-[var(--color-text-lighter)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[var(--color-text)] mb-2">购物车是空的</h2>
          <p className="text-sm text-[var(--color-text-light)] mb-6">
            请先将商品加入购物车再结算
          </p>
          <Link href="/">
            <Button variant="primary">继续购物</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-[var(--color-text)] mb-8">确认订单</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section A: Shipping Address */}
          <section className="bg-white rounded-xl border border-[var(--color-border)] p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[var(--color-text)]">收货地址</h2>
              <button
                type="button"
                onClick={() => {
                  setAddressForm(emptyAddressForm);
                  setAddressFormError('');
                  setShowAddressModal(true);
                }}
                className="text-sm font-medium text-[var(--color-accent)] hover:text-[var(--color-accent-dark)] transition-colors"
              >
                + 新增地址
              </button>
            </div>

            {addressesLoading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="h-20 bg-gray-50 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : addresses.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-[var(--color-border)] rounded-xl">
                <p className="text-sm text-[var(--color-text-light)] mb-3">
                  暂无收货地址
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setAddressForm(emptyAddressForm);
                    setAddressFormError('');
                    setShowAddressModal(true);
                  }}
                  className="text-sm font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent-dark)] transition-colors"
                >
                  添加第一个地址
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <label
                    key={addr.id}
                    className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedAddressId === addr.id
                        ? 'border-[var(--color-accent)] bg-orange-50'
                        : 'border-[var(--color-border)] hover:border-[var(--color-text-lighter)]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="shipping_address"
                      value={addr.id}
                      checked={selectedAddressId === addr.id}
                      onChange={() => setSelectedAddressId(addr.id)}
                      className="mt-1 accent-[var(--color-accent)]"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[var(--color-text)] text-sm">
                          {addr.receiver_name}
                        </span>
                        <span className="text-sm text-[var(--color-text-light)]">
                          {addr.phone}
                        </span>
                        {addr.is_default === 1 && (
                          <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-medium">
                            默认
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[var(--color-text-light)] mt-1 truncate">
                        {(() => {
                          const labels = getRegionLabels(addr.province, addr.city, addr.district);
                          return labels
                            ? `${labels.provinceLabel} ${labels.cityLabel} ${labels.districtLabel} ${addr.detail}`
                            : `${addr.province} ${addr.city} ${addr.district} ${addr.detail}`;
                        })()}
                        {addr.zip_code ? `, ${addr.zip_code}` : ''}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </section>

          {/* Section B: Order Items */}
          <section className="bg-white rounded-xl border border-[var(--color-border)] p-5 sm:p-6">
            <h2 className="text-lg font-bold text-[var(--color-text)] mb-4">
              商品清单 ({itemCount})
            </h2>
            <div className="divide-y divide-[var(--color-border)]">
              {items.map((item) => {
                const specText = item.spec_info ? parseSpecInfo(item.spec_info) : '';
                const productSlug = (item as any).product_slug || '';

                return (
                  <div key={item.id} className="flex gap-3 py-4 first:pt-0 last:pb-0">
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={item.product_image || '/images/placeholder.svg'}
                        alt={item.product_name || 'Product'}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <Link
                          href={productSlug ? `/products/${productSlug}` : '#'}
                          className="text-sm font-medium text-[var(--color-text)] hover:text-[var(--color-accent)] line-clamp-1 transition-colors"
                        >
                          {item.product_name}
                        </Link>
                        {specText && (
                          <p className="text-xs text-[var(--color-text-light)] mt-0.5 line-clamp-1">
                            {specText}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-[var(--color-text-light)]">
                          数量：{item.quantity}
                        </span>
                        <span className="text-sm font-semibold text-[var(--color-text)]">
                          {formatPrice((item.price || 0) * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Section C: Payment Method */}
          <section className="bg-white rounded-xl border border-[var(--color-border)] p-5 sm:p-6">
            <h2 className="text-lg font-bold text-[var(--color-text)] mb-4">支付方式</h2>
            <div className="space-y-3">
              <label
                className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  paymentMethod === 'credit_card'
                    ? 'border-[var(--color-accent)] bg-orange-50'
                    : 'border-[var(--color-border)] hover:border-[var(--color-text-lighter)]'
                }`}
              >
                <input
                  type="radio"
                  name="payment_method"
                  value="credit_card"
                  checked={paymentMethod === 'credit_card'}
                  onChange={() => setPaymentMethod('credit_card')}
                  className="accent-[var(--color-accent)]"
                />
                <div>
                  <span className="font-semibold text-[var(--color-text)] text-sm">信用卡</span>
                  <p className="text-xs text-[var(--color-text-light)] mt-0.5">
                    使用信用卡或借记卡安全支付
                  </p>
                </div>
              </label>

              <label
                className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  paymentMethod === 'paypal'
                    ? 'border-[var(--color-accent)] bg-orange-50'
                    : 'border-[var(--color-border)] hover:border-[var(--color-text-lighter)]'
                }`}
              >
                <input
                  type="radio"
                  name="payment_method"
                  value="paypal"
                  checked={paymentMethod === 'paypal'}
                  onChange={() => setPaymentMethod('paypal')}
                  className="accent-[var(--color-accent)]"
                />
                <div>
                  <span className="font-semibold text-[var(--color-text)] text-sm">支付宝</span>
                  <p className="text-xs text-[var(--color-text-light)] mt-0.5">
                    使用支付宝账户付款
                  </p>
                </div>
              </label>
            </div>
          </section>
        </div>

        {/* Right: Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white rounded-xl border border-[var(--color-border)] p-5 sm:p-6 space-y-5">
            <h2 className="text-lg font-bold text-[var(--color-text)]">订单汇总</h2>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--color-text-light)]">商品总额</span>
                <span className="font-semibold text-[var(--color-text)]">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--color-text-light)]">运费</span>
                <span className="font-semibold">
                  {shipping === 0 ? (
                    <span className="text-green-600">FREE</span>
                  ) : (
                    <span className="text-[var(--color-text)]">{formatPrice(shipping)}</span>
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold pt-3 border-t border-[var(--color-border)]">
                <span className="text-[var(--color-text)]">订单总计</span>
                <span className="text-[var(--color-danger)]">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Order Note */}
            <div>
              <Textarea
                label="订单备注（选填）"
                placeholder="备注留言（选填）"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                rows={3}
              />
            </div>

            {/* Submit Error */}
            {submitError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
                {submitError}
              </div>
            )}

            {/* Place Order Button */}
            <Button
              variant="primary"
              size="lg"
              loading={submitting}
              disabled={submitting || !selectedAddressId}
              onClick={handlePlaceOrder}
              className="w-full bg-orange-500 hover:bg-orange-600 shadow-md shadow-orange-500/20"
            >
              提交订单
            </Button>

            <Link
              href="/cart"
              className="block text-center text-sm text-[var(--color-text-light)] hover:text-[var(--color-accent)] transition-colors"
            >
              返回购物车
            </Link>
          </div>
        </div>
      </div>

      {/* Add New Address Modal */}
      <Modal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        title="新增地址"
        size="lg"
      >
        <form onSubmit={handleCreateAddress} className="space-y-4">
          {addressFormError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
              {addressFormError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="收货人 *"
              placeholder="张三"
              value={addressForm.receiver_name}
              onChange={(e) => setAddressForm({ ...addressForm, receiver_name: e.target.value })}
            />
            <Input
              label="电话 *"
              placeholder="13800138000"
              value={addressForm.phone}
              onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
            />
          </div>

          <AddressSelector
            province={addressForm.province}
            city={addressForm.city}
            district={addressForm.district}
            onChange={(field, value, label) =>
              setAddressForm(prev => ({ ...prev, [field]: value }))
            }
          />

          <Input
            label="详细地址 *"
            placeholder="中山路123号4栋5楼"
            value={addressForm.detail}
            onChange={(e) => setAddressForm({ ...addressForm, detail: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="邮政编码"
              placeholder="510000"
              value={addressForm.zip_code}
              onChange={(e) => setAddressForm({ ...addressForm, zip_code: e.target.value })}
            />
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={addressForm.is_default}
                  onChange={(e) => setAddressForm({ ...addressForm, is_default: e.target.checked })}
                  className="w-4 h-4 rounded border-[var(--color-border)] accent-[var(--color-accent)]"
                />
                <span className="text-sm text-[var(--color-text)]">设为默认地址</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              variant="primary"
              loading={addressFormSubmitting}
              disabled={addressFormSubmitting}
              className="flex-1"
            >
              保存地址
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAddressModal(false)}
            >
              取消
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
