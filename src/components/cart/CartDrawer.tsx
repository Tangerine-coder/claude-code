'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import QuantityInput from '@/components/ui/QuantityInput';
import EmptyState from '@/components/ui/EmptyState';
import { formatPrice } from '@/lib/utils';
import { FiX, FiTrash2 } from 'react-icons/fi';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, itemCount, subtotal, updateQuantity, removeItem } = useCart();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const shipping = subtotal === 0 ? 0 : (subtotal >= 50 ? 0 : 5.99);
  const total = subtotal + shipping;

  return (
    <div className="fixed inset-0 z-[9999]">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md glass shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
          <h2 className="text-lg font-bold text-[var(--color-text)]">
            购物车 ({itemCount})
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <EmptyState
              title="购物车是空的"
              description="快去挑选心仪的商品吧！"
              actionLabel="去逛逛"
              onAction={onClose}
            />
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 pb-4 border-b border-[var(--color-border)]">
                  <Link href={`/products/${(item as any).product_slug || ''}`} onClick={onClose} className="flex-shrink-0">
                    <img
                      src={item.product_image || '/images/placeholder.svg'}
                      alt={item.product_name || ''}
                      className="w-20 h-20 rounded-lg object-cover bg-gray-100"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${(item as any).product_slug || ''}`} onClick={onClose} className="text-sm font-medium text-[var(--color-text)] hover:text-[var(--color-accent)] line-clamp-2">
                      {item.product_name}
                    </Link>
                    {item.spec_info && item.spec_info !== '{}' && (
                      <p className="text-xs text-[var(--color-text-light)] mt-0.5">
                        {Object.values(JSON.parse(item.spec_info)).join(' / ')}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <QuantityInput
                        value={item.quantity}
                        onChange={(q) => updateQuantity(item.id, q)}
                        size="sm"
                        max={item.stock || 99}
                      />
                      <div className="text-right">
                        <p className="text-sm font-bold text-[var(--color-text)]">
                          {formatPrice((item.price || 0) * item.quantity)}
                        </p>
                        {item.price && (
                          <p className="text-xs text-[var(--color-text-light)]">
                            {formatPrice(item.price)}/件
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="flex-shrink-0 p-1 text-[var(--color-text-lighter)] hover:text-[var(--color-danger)] transition-colors"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[var(--color-border)] p-5 space-y-3 bg-gray-50">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--color-text-light)]">小计</span>
              <span className="font-semibold">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--color-text-light)]">运费</span>
              <span className="font-semibold">{shipping === 0 ? <span className="text-green-600">免运费</span> : formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between text-base font-bold pt-2 border-t border-[var(--color-border)]">
              <span>合计</span>
              <span className="text-[var(--color-danger)]">{total === 0 ? <span className="text-green-600">免费</span> : formatPrice(total)}</span>
            </div>
            <Link
              href="/cart"
              onClick={onClose}
              className="block w-full py-3 text-center text-sm font-bold bg-[var(--color-accent)] text-white rounded-xl hover:bg-[var(--color-accent-dark)] transition-colors"
            >
              查看购物车并结算
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
