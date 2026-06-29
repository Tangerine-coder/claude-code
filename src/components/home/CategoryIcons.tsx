'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import BorderGlow from '@/components/ui/BorderGlow';

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  children?: Category[];
}

export default function CategoryIcons() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          const topLevel = (d.data as Category[]).filter((c) => c.children && c.children.length > 0);
          setCategories(topLevel);
        }
      })
      .catch(() => {});
  }, []);

  if (categories.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <div className="grid grid-cols-3 gap-3 md:gap-6 max-w-2xl mx-auto">
        {categories.slice(0, 3).map((cat) => (
          <BorderGlow
            key={cat.id}
            backgroundColor="#FFFFFF"
            borderRadius={20}
            glowColor="18 100 60"
            colors={['#0A2647', '#FF6B35', '#144272']}
            edgeSensitivity={30}
            glowIntensity={1.5}
            glowRadius={32}
          >
            <Link
              href={`/categories/${cat.slug}`}
              className="group flex flex-col items-center p-4 md:p-6"
            >
              <div className="w-14 h-14 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-[var(--color-bg)] to-white overflow-hidden mb-3 group-hover:ring-4 ring-[var(--color-accent)]/20 transition-all duration-500">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <span className="text-sm md:text-base font-semibold text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">
                {cat.name}
              </span>
              {cat.children && (
                <span className="text-xs text-[var(--color-text-light)] mt-0.5">
                  {cat.children.length}个子分类
                </span>
              )}
            </Link>
          </BorderGlow>
        ))}
      </div>
    </section>
  );
}
