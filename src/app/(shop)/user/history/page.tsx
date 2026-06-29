'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/product/ProductCard';
import Button from '@/components/ui/Button';
import Skeleton, { ProductCardSkeleton } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { FiClock, FiTrash2 } from 'react-icons/fi';

interface HistoryItem {
  id: string;
  product_id: string;
  name: string;
  slug: string;
  price: number;
  original_price: number | null;
  stock: number;
  sales_count: number;
  image: string;
  created_at: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [clearing, setClearing] = useState(false);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch('/api/history');
      const data = await res.json();
      if (data.success) {
        setHistory(data.data);
      }
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleClear = async () => {
    setClearing(true);
    try {
      await fetch('/api/history', { method: 'DELETE' });
      setHistory([]);
    } catch (err) {
      console.error('Failed to clear history:', err);
    } finally {
      setClearing(false);
      setShowClearConfirm(false);
    }
  };

  // Group by date
  const groupedHistory = history.reduce<Record<string, HistoryItem[]>>((acc, item) => {
    const date = new Date(item.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton variant="text" width="250px" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 4 }, (_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">浏览记录</h1>
        {history.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            icon={<FiTrash2 />}
            onClick={() => setShowClearConfirm(true)}
          >
            清空记录
          </Button>
        )}
      </div>

      {history.length === 0 ? (
        <EmptyState
          icon={<FiClock className="w-12 h-12" />}
          title="暂无浏览记录"
          description="您浏览过的商品将在这里显示"
          actionLabel="去逛逛"
          actionHref="/products"
        />
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedHistory).map(([date, items]) => (
            <div key={date}>
              <h3 className="text-sm font-semibold text-[var(--color-text-light)] mb-3">{date}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {items.map((item) => (
                  <ProductCard
                    key={item.id}
                    product={{
                      id: item.product_id,
                      name: item.name,
                      slug: item.slug,
                      price: item.price,
                      original_price: item.original_price,
                      images: JSON.stringify([item.image]),
                      sales_count: item.sales_count,
                      is_new: 0,
                      is_featured: 0,
                      is_recommended: 0,
                      stock: item.stock,
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={handleClear}
        title="清空浏览记录"
        message="确定要清空所有浏览记录吗？此操作不可撤销。"
        confirmLabel="清空"
        variant="danger"
        loading={clearing}
      />
    </div>
  );
}
