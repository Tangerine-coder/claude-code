'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Skeleton from '@/components/ui/Skeleton';
import ScrollReveal from '@/components/ui/ScrollReveal';
import ImageWithFallback from '@/components/ui/ImageWithFallback';

interface CategoryNode {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  description: string;
  image: string;
  children: CategoryNode[];
}

export default function CategoriesPage() {
  const [cats, setCats] = useState<CategoryNode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setCats(d.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const topLevel = cats.filter((c) => !c.parent_id);

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Breadcrumb items={[{ label: '全部商品', href: '/categories' }, { label: '商品分类' }]} />

        <div className="mt-6 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text)] tracking-tight">商品分类</h1>
          <p className="text-sm text-[var(--color-text-light)] mt-1">浏览全部品类，找到心仪好物</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }, (_, i) => (
              <Skeleton key={i} variant="rect" className="h-36 rounded-2xl" />
            ))}
          </div>
        ) : topLevel.length === 0 ? (
          <div className="py-20 text-center text-[var(--color-text-light)]">暂无分类</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {topLevel.map((cat, i) => (
              <ScrollReveal key={cat.id} delay={i * 0.05}>
                <Link
                  href={`/categories/${cat.slug}`}
                  className="group block bg-white rounded-2xl overflow-hidden border border-[var(--color-border)]/60 hover:border-[var(--color-accent)]/50 hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    <ImageWithFallback
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      wrapperClassName="w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute bottom-3 left-4">
                      <h3 className="text-white font-bold text-lg drop-shadow-sm">{cat.name}</h3>
                    </div>
                  </div>
                  {cat.children && cat.children.length > 0 && (
                    <div className="p-3 flex flex-wrap gap-1.5">
                      {cat.children.slice(0, 4).map((child) => (
                        <span
                          key={child.id}
                          className="text-xs text-[var(--color-text-light)] bg-[var(--color-bg)] px-2.5 py-1 rounded-full group-hover:text-[var(--color-accent)] transition-colors"
                        >
                          {child.name}
                        </span>
                      ))}
                      {cat.children.length > 4 && (
                        <span className="text-xs text-[var(--color-text-lighter)] px-1 py-1">+{cat.children.length - 4}</span>
                      )}
                    </div>
                  )}
                </Link>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
