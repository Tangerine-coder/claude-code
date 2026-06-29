'use client';

import React from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import BorderGlow from '@/components/ui/BorderGlow';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import PriceDisplay from '@/components/ui/PriceDisplay';
import Badge from '@/components/ui/Badge';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  original_price: number | null;
  images: string;
  sales_count: number;
  is_new: number;
  is_featured: number;
  is_recommended: number;
  stock: number;
}

interface ProductCardProps {
  product: Product;
  badge?: 'new' | 'hot' | 'sale' | 'bestseller' | null;
  variant?: 'default' | 'featured';
}

export default function ProductCard({ product, badge, variant = 'default' }: ProductCardProps) {
  const { addItem } = useCart();
  const { addToast } = useToast();

  const imageUrl = (() => {
    try {
      const imgs = JSON.parse(product.images);
      return imgs[0] || '/images/placeholder.svg';
    } catch {
      return '/images/placeholder.svg';
    }
  })();

  const getBadge = () => {
    if (badge) return badge;
    if (product.is_new) return 'new';
    if (product.original_price && product.original_price > product.price) return 'sale';
    if (product.sales_count > 1000) return 'bestseller';
    return null;
  };

  const displayBadge = getBadge();
  const badgeLabels: Record<string, string> = {
    new: '新品',
    hot: '热销',
    sale: '促销',
    bestseller: '畅销',
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addItem(product.id, product.name, imageUrl, product.price);
      addToast('已加入购物车！', 'success');
    } catch {
      addToast('加入购物车失败', 'error');
    }
  };

  const isFeatured = variant === 'featured';

  return (
    <BorderGlow
      backgroundColor="#FFFFFF"
      borderRadius={20}
      glowColor="18 100 60"
      colors={['#0A2647', '#FF6B35', '#144272']}
      edgeSensitivity={28}
      glowIntensity={1.8}
      glowRadius={36}
      className={isFeatured ? 'md:col-span-2' : ''}
    >
      <Link
        href={`/products/${product.slug}`}
        className="group block h-full"
      >
        <div className={clsx('relative overflow-hidden bg-gray-100', isFeatured ? 'aspect-[16/9]' : 'aspect-square')}>
          <ImageWithFallback
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-[var(--ease-out-expo)]"
            wrapperClassName="w-full h-full"
          />
          {/* Hover gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          {displayBadge && (
            <div className="absolute top-3 left-3">
              <Badge variant={displayBadge}>{badgeLabels[displayBadge]}</Badge>
            </div>
          )}
          {/* Quick add button - glass morphism */}
          <button
            type="button"
            onClick={handleAddToCart}
            className="absolute bottom-3 right-3 w-10 h-10 glass rounded-full flex items-center justify-center
                       scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100
                       transition-all duration-300 ease-[var(--ease-out-back)]
                       hover:bg-[var(--color-accent)] hover:text-white hover:border-[var(--color-accent)]
                       active:scale-90 shadow-lg"
            aria-label="加入购物车"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>
        <div className={clsx('p-4', isFeatured && 'md:p-6')}>
          <h3 className={clsx(
            'font-medium text-[var(--color-text)] line-clamp-2 mb-2 group-hover:text-[var(--color-accent)] transition-colors',
            isFeatured ? 'text-lg md:text-xl min-h-[3.5rem]' : 'text-sm md:text-base min-h-[2.5rem]'
          )}>
            {product.name}
          </h3>
          <PriceDisplay
            price={product.price}
            originalPrice={product.original_price}
            size={isFeatured ? 'md' : 'sm'}
          />
          <p className="text-xs text-[var(--color-text-light)] mt-2">
            {product.sales_count.toLocaleString()} 已售
          </p>
        </div>
      </Link>
    </BorderGlow>
  );
}
