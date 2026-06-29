'use client';

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ProductGrid from '@/components/product/ProductGrid';
import Pagination from '@/components/ui/Pagination';
import EmptyState from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';

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

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  const initialPage = parseInt(searchParams.get('page') || '1');

  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: initialPage,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResults = useCallback(
    async (q: string, page: number) => {
      if (!q.trim()) {
        setProducts([]);
        setPagination({ page: 1, limit: 20, total: 0, totalPages: 0 });
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&page=${page}&limit=20`);
        const data = await res.json();
        if (data.success) {
          setProducts(data.data || []);
          setPagination(data.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 });
        } else {
          setError(data.message || '搜索失败');
        }
      } catch {
        setError('搜索失败，请重试。');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchResults(query, initialPage);
  }, [query, initialPage, fetchResults]);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    router.push(`/search?${params.toString()}`, { scroll: false });
  };

  // ----- No query -----
  if (!query.trim()) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)]">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <EmptyState
            title="搜索商品"
            description="请输入关键词搜索您想要的商品"
            actionLabel="浏览分类"
            actionHref="/categories"
          />
        </div>
      </div>
    );
  }

  // ----- Error state -----
  if (error) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)]">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="text-center py-16">
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-2">
              出错了
            </h2>
            <p className="text-sm text-[var(--color-text-light)] mb-4">{error}</p>
            <Button variant="primary" onClick={() => fetchResults(query, 1)}>
              重试
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Heading */}
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-[var(--color-text)]">
            &apos;<span className="text-[var(--color-accent)]">{query}</span>&apos; 的搜索结果
          </h1>
          {!loading && (
            <p className="text-sm text-[var(--color-text-light)] mt-1">
              共找到 {pagination.total} 件商品
            </p>
          )}
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
            {Array.from({ length: 8 }, (_, i) => (
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
        ) : products.length === 0 ? (
          /* Empty state */
          <EmptyState
            title="未找到相关商品"
            description={`未找到与 "${query}" 相关的商品，换个关键词试试吧。`}
            actionLabel="返回首页"
            actionHref="/"
          />
        ) : (
          <>
            {/* Results */}
            <ProductGrid products={products} />

            {/* Pagination */}
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full" /></div>}>
      <SearchPageContent />
    </Suspense>
  );
}
