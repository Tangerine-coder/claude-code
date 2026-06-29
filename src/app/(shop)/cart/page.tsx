'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import QuantityInput from '@/components/ui/QuantityInput';
import EmptyState from '@/components/ui/EmptyState';
import { formatPrice } from '@/lib/utils';
import { FiTrash2, FiArrowLeft, FiTag } from 'react-icons/fi';

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

export default function CartPage() {
  const { items, itemCount, subtotal, updateQuantity, removeItem, clearCart, isLoading } = useCart();

  const shipping = subtotal >= 50 ? 0 : 5.99;
  const estimatedTotal = subtotal + shipping;

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-100 rounded-xl" />
              ))}
            </div>
            <div className="h-64 bg-gray-100 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <EmptyState
          title="购物车是空的"
          description="您还没有添加任何商品到购物车，快去逛逛吧！"
          actionLabel="继续购物"
          actionHref="/"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">
            购物车
            <span className="text-lg font-normal text-[var(--color-text-light)] ml-2">
              ({itemCount} 件)
            </span>
          </h1>
        </div>
        <button
          onClick={clearCart}
          className="text-sm text-[var(--color-text-light)] hover:text-[var(--color-danger)] transition-colors underline underline-offset-4"
        >
          清空购物车
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const specText = item.spec_info ? parseSpecInfo(item.spec_info) : '';
            const lineTotal = (item.price || 0) * item.quantity;
            const productSlug = (item as any).product_slug || '';

            return (
              <div
                key={item.id}
                className="flex gap-4 p-4 bg-white rounded-xl border border-[var(--color-border)] hover:shadow-sm transition-shadow"
              >
                {/* Product Image */}
                <Link
                  href={productSlug ? `/products/${productSlug}` : '#'}
                  className="flex-shrink-0 block"
                >
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={item.product_image || '/images/placeholder.svg'}
                      alt={item.product_name || 'Product'}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 96px, 112px"
                    />
                  </div>
                </Link>

                {/* Item Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <Link
                      href={productSlug ? `/products/${productSlug}` : '#'}
                      className="text-sm font-medium text-[var(--color-text)] hover:text-[var(--color-accent)] line-clamp-2 transition-colors"
                    >
                      {item.product_name}
                    </Link>
                    {specText && (
                      <p className="text-xs text-[var(--color-text-light)] mt-1">
                        {specText}
                      </p>
                    )}
                    <p className="text-sm font-semibold text-[var(--color-text)] mt-1">
                      {formatPrice(item.price || 0)}
                      <span className="text-xs font-normal text-[var(--color-text-light)] ml-1">/件</span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <QuantityInput
                      value={item.quantity}
                      onChange={(q) => updateQuantity(item.id, q)}
                      size="sm"
                      max={item.stock || 99}
                    />
                    <div className="flex items-center gap-4">
                      <p className="text-sm font-bold text-[var(--color-text)]">
                        {formatPrice(lineTotal)}
                      </p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1.5 text-[var(--color-text-lighter)] hover:text-[var(--color-danger)] hover:bg-red-50 rounded-lg transition-colors"
                        aria-label="Remove item"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Continue Shopping Link (below items on mobile) */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[var(--color-text-light)] hover:text-[var(--color-accent)] transition-colors lg:hidden mt-4"
          >
            <FiArrowLeft className="w-4 h-4" />
            继续购物
          </Link>
        </div>

        {/* Right: Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-5">
            {/* Cart Summary Card */}
            <div className="bg-white rounded-xl border border-[var(--color-border)] p-5 space-y-4">
              <h3 className="text-lg font-bold text-[var(--color-text)]">购物车汇总</h3>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-text-light)]">小计</span>
                  <span className="font-semibold text-[var(--color-text)]">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-text-light)]">运费</span>
                  <span className="font-semibold">
                    {shipping === 0 ? (
                      <span className="text-green-600">免运费</span>
                    ) : (
                      <span className="text-[var(--color-text)]">{formatPrice(shipping)}</span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold pt-3 border-t border-[var(--color-border)]">
                  <span className="text-[var(--color-text)]">预估合计</span>
                  <span className="text-[var(--color-danger)]">{formatPrice(estimatedTotal)}</span>
                </div>
              </div>

              {shipping > 0 && (
                <p className="text-xs text-[var(--color-text-lighter)] bg-amber-50 text-amber-700 px-3 py-2 rounded-lg">
                  再买 <strong>{formatPrice(50 - subtotal)}</strong> 元即可免运费！
                </p>
              )}
            </div>

            {/* Coupon Code (visual only) */}
            <div className="bg-white rounded-xl border border-[var(--color-border)] p-5">
              <div className="flex items-center gap-2 mb-3">
                <FiTag className="w-4 h-4 text-[var(--color-accent)]" />
                <h4 className="text-sm font-semibold text-[var(--color-text)]">优惠码</h4>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="输入优惠码"
                  className="flex-1 px-3 py-2 text-sm border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent bg-gray-50 text-[var(--color-text)] placeholder:text-[var(--color-text-lighter)]"
                />
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-semibold text-white bg-[var(--color-accent)] rounded-lg hover:bg-[var(--color-accent-dark)] transition-colors active:scale-[0.98]"
                >
                  应用
                </button>
              </div>
            </div>

            {/* Checkout Button */}
            <Link
              href="/checkout"
              className="block w-full py-3.5 text-center text-base font-bold text-white bg-orange-500 hover:bg-orange-600 active:scale-[0.99] rounded-xl transition-all duration-200 shadow-md shadow-orange-500/20"
            >
              结算
            </Link>

            {/* Continue Shopping */}
            <Link
              href="/"
              className="hidden lg:inline-flex items-center gap-2 text-sm text-[var(--color-text-light)] hover:text-[var(--color-accent)] transition-colors justify-center w-full"
            >
              <FiArrowLeft className="w-4 h-4" />
              继续购物
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
