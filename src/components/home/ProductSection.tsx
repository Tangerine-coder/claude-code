'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/product/ProductCard';
import ScrollReveal from '@/components/ui/ScrollReveal';

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

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  viewAllHref?: string;
  apiParams: string;
  badge?: 'new' | 'hot' | 'sale' | 'bestseller' | null;
}

export default function ProductSection({ title, subtitle, viewAllHref, apiParams, badge }: ProductSectionProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchProducts = () => {
    setLoading(true);
    setError(false);
    fetch(`/api/products?${apiParams}&limit=8`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setProducts(d.data);
        else setError(true);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, [apiParams]);

  return (
    <section className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      {/* Header */}
      <div className="flex items-end justify-between mb-6 md:mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-5 bg-[var(--color-accent)] rounded-full" />
            <h2 className="text-xl md:text-2xl font-bold text-[var(--color-text)] tracking-tight">{title}</h2>
          </div>
          {subtitle && <p className="text-sm text-[var(--color-text-light)] ml-4">{subtitle}</p>}
        </div>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent-dark)] transition-colors group"
          >
            查看全部
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="glass-surface rounded-xl overflow-hidden shadow-sm animate-pulse">
              <div className="aspect-square bg-gray-200" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-6 bg-gray-200 rounded w-1/3 mt-2" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-[var(--color-text-light)] mb-3">加载失败，请重试</p>
          <button
            type="button"
            onClick={fetchProducts}
            className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition"
          >
            重新加载
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {products.map((product, i) => (
            <ScrollReveal key={product.id} delay={i * 0.05}>
              <ProductCard product={product} badge={badge} />
            </ScrollReveal>
          ))}
        </div>
      )}

      {/* Mobile View All */}
      {viewAllHref && (
        <div className="sm:hidden mt-6 text-center">
          <Link href={viewAllHref} className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-accent)]">
            查看全部 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </Link>
        </div>
      )}
    </section>
  );
}
