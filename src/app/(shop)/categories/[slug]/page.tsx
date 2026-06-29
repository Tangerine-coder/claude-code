'use client';

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Input, { Select } from '@/components/ui/Input';
import Pagination from '@/components/ui/Pagination';
import ProductGrid from '@/components/product/ProductGrid';
import Skeleton from '@/components/ui/Skeleton';

interface CategoryData {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  description: string;
  image: string;
  children: CategoryChild[];
}

interface CategoryChild {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  is_active: number;
}

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

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

function CategoryPageContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = params.slug as string;

  // Read initial filter state from URL
  const initialPage = parseInt(searchParams.get('page') || '1');
  const initialSort = searchParams.get('sort') || '';
  const initialMinPrice = searchParams.get('min_price') || '';
  const initialMaxPrice = searchParams.get('max_price') || '';

  const [category, setCategory] = useState<CategoryData | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: initialPage,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [sort, setSort] = useState(initialSort);
  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);

  // Update URL search params
  const updateUrl = useCallback(
    (updates: Record<string, string>) => {
      const current = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          current.set(key, value);
        } else {
          current.delete(key);
        }
      });
      // Reset page when filters change (unless we are explicitly changing page)
      if (!('page' in updates)) {
        current.delete('page');
      }
      router.push(`/categories/${slug}?${current.toString()}`, { scroll: false });
    },
    [router, searchParams, slug]
  );

  // Fetch category info
  useEffect(() => {
    async function fetchCategory() {
      try {
        const res = await fetch(`/api/categories/${slug}`);
        const data = await res.json();
        if (data.success) {
          setCategory(data.data);
        } else {
          setError(data.message || 'Category not found');
        }
      } catch {
        setError('Failed to load category');
      }
    }
    fetchCategory();
  }, [slug]);

  // Fetch products
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        queryParams.set('category', slug);
        queryParams.set('page', String(pagination.page));
        if (sort) queryParams.set('sort', sort);
        if (minPrice) queryParams.set('min_price', minPrice);
        if (maxPrice) queryParams.set('max_price', maxPrice);

        const res = await fetch(`/api/products?${queryParams.toString()}`);
        const data = await res.json();
        if (data.success) {
          setProducts(data.data || []);
          setPagination(data.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 });
        }
      } catch {
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [slug, pagination.page, sort, minPrice, maxPrice]);

  // Sync URL params on mount
  useEffect(() => {
    setSort(initialSort);
    setMinPrice(initialMinPrice);
    setMaxPrice(initialMaxPrice);
    setPagination((prev) => ({ ...prev, page: initialPage }));
  }, [initialSort, initialMinPrice, initialMaxPrice, initialPage]);

  // Handlers
  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
    updateUrl({ page: String(page) });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSort(e.target.value);
    setPagination((prev) => ({ ...prev, page: 1 }));
    updateUrl({ sort: e.target.value });
  };

  const handlePriceFilter = () => {
    const updates: Record<string, string> = {};
    if (minPrice) updates.min_price = minPrice;
    else updates.min_price = '';
    if (maxPrice) updates.max_price = maxPrice;
    else updates.max_price = '';
    setPagination((prev) => ({ ...prev, page: 1 }));
    updateUrl(updates);
  };

  const handleRemoveMinPrice = () => {
    setMinPrice('');
    setPagination((prev) => ({ ...prev, page: 1 }));
    updateUrl({ min_price: '' });
  };

  const handleRemoveMaxPrice = () => {
    setMaxPrice('');
    setPagination((prev) => ({ ...prev, page: 1 }));
    updateUrl({ max_price: '' });
  };

  const handleRemoveSort = () => {
    setSort('');
    setPagination((prev) => ({ ...prev, page: 1 }));
    updateUrl({ sort: '' });
  };

  // Active filter tags
  const activeFilters: { label: string; onRemove: () => void }[] = [];
  if (sort) {
    const sortLabels: Record<string, string> = {
      price_asc: '价格从低到高',
      price_desc: '价格从高到低',
      newest: '最新',
      popular: '销量最高',
      rating: '评分最高',
    };
    activeFilters.push({
      label: sortLabels[sort] || sort,
      onRemove: handleRemoveSort,
    });
  }
  if (minPrice) {
    activeFilters.push({ label: `Min: $${minPrice}`, onRemove: handleRemoveMinPrice });
  }
  if (maxPrice) {
    activeFilters.push({ label: `Max: $${maxPrice}`, onRemove: handleRemoveMaxPrice });
  }

  // Error state
  if (error && !category) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <h2 className="text-xl font-bold text-[var(--color-text)] mb-2">{error}</h2>
        <Link href="/" className="text-sm text-[var(--color-accent)] hover:underline">
          返回首页
        </Link>
      </div>
    );
  }

  const sortOptions = [
    { value: '', label: '默认排序' },
    { value: 'newest', label: '最新' },
    { value: 'popular', label: '销量最高' },
    { value: 'price_asc', label: '价格从低到高' },
    { value: 'price_desc', label: '价格从高到低' },
    { value: 'rating', label: '评分最高' },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: '分类', href: '/categories' },
            { label: category?.name || slug },
          ]}
        />

        {/* Category header */}
        {category && (
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text)]">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-sm text-[var(--color-text-light)] mt-2">
                {category.description}
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          {/* ---- Left Sidebar ---- */}
          <aside className="w-full md:w-56 flex-shrink-0">
            <div className="space-y-6">
              {/* Subcategories */}
              {category?.children && category.children.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-[var(--color-text)] mb-3 uppercase tracking-wide">
                    子分类
                  </h3>
                  <ul className="space-y-1.5">
                    {category.children.map((child) => (
                      <li key={child.id}>
                        <Link
                          href={`/categories/${child.slug}`}
                          className={`text-sm block py-1.5 px-2 rounded transition-colors ${
                            child.slug === slug
                              ? 'text-[var(--color-accent)] font-semibold bg-[var(--color-accent)]/5'
                              : 'text-[var(--color-text-light)] hover:text-[var(--color-text)] hover:bg-gray-50'
                          }`}
                        >
                          {child.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Price Range Filter */}
              <div>
                <h3 className="text-sm font-semibold text-[var(--color-text)] mb-3 uppercase tracking-wide">
                  价格区间
                </h3>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="最低价"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="flex-1"
                    min="0"
                  />
                  <Input
                    type="number"
                    placeholder="最高价"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="flex-1"
                    min="0"
                  />
                </div>
                <button
                  onClick={handlePriceFilter}
                  className="mt-2 w-full px-3 py-1.5 text-xs font-semibold rounded-md bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-dark)] transition-colors"
                >
                  应用
                </button>
              </div>

              {/* Sort (mobile-friendly, also in sidebar) */}
              <div className="md:hidden">
                <Select
                  label="排序"
                  options={sortOptions}
                  value={sort}
                  onChange={handleSortChange}
                />
              </div>
            </div>
          </aside>

          {/* ---- Main Content ---- */}
          <div className="flex-1 min-w-0">
            {/* Active filter tags */}
            {activeFilters.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-xs text-[var(--color-text-light)]">筛选：</span>
                {activeFilters.map((filter) => (
                  <span
                    key={filter.label}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-[var(--color-accent)]/10 text-[var(--color-accent)] rounded-full"
                  >
                    {filter.label}
                    <button
                      onClick={filter.onRemove}
                      className="hover:text-[var(--color-accent-dark)]"
                      aria-label={`Remove filter: ${filter.label}`}
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Top bar: product count + sort (desktop) */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-[var(--color-text-light)]">
                共 {pagination.total} 件商品
              </p>
              <div className="hidden md:block w-48">
                <Select
                  options={sortOptions}
                  value={sort}
                  onChange={handleSortChange}
                />
              </div>
            </div>

            {/* Products */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 md:gap-5">
                {Array.from({ length: 6 }, (_, i) => (
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
            ) : (
              <ProductGrid products={products} />
            )}

            {/* Pagination */}
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CategoryPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full" /></div>}>
      <CategoryPageContent />
    </Suspense>
  );
}
