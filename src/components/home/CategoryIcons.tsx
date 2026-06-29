'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

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
          // Show only top-level categories
          const topLevel = (d.data as Category[]).filter((c) => c.children && c.children.length > 0);
          setCategories(topLevel);
        }
      })
      .catch(() => {});
  }, []);

  if (categories.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-3 md:gap-6 max-w-2xl mx-auto">
        {categories.slice(0, 3).map((cat) => (
          <Link
            key={cat.id}
            href={`/categories/${cat.slug}`}
            className="group flex flex-col items-center p-4 md:p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
          >
            <div className="w-14 h-14 md:w-20 md:h-20 rounded-2xl bg-[var(--color-bg)] overflow-hidden mb-3 group-hover:ring-2 ring-[var(--color-accent)] transition-all">
              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
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
        ))}
      </div>
    </section>
  );
}
