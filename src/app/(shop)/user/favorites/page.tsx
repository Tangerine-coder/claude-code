'use client';

import React, { useEffect, useState, useCallback } from 'react';
import ProductCard from '@/components/product/ProductCard';
import Skeleton, { ProductCardSkeleton } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import { FiHeart, FiX } from 'react-icons/fi';

interface FavoriteItem {
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

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const fetchFavorites = useCallback(async () => {
    try {
      const res = await fetch('/api/favorites');
      const data = await res.json();
      if (data.success) {
        setFavorites(data.data);
      }
    } catch (err) {
      console.error('Failed to load favorites:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const handleRemove = async (productId: string) => {
    setRemovingId(productId);
    try {
      await fetch(`/api/favorites?product_id=${productId}`, { method: 'DELETE' });
      setFavorites((prev) => prev.filter((f) => f.product_id !== productId));
    } catch (err) {
      console.error('Failed to remove favorite:', err);
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton variant="text" width="200px" />
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
      <h1 className="text-2xl font-bold text-[var(--color-text)]">我的收藏</h1>

      {favorites.length === 0 ? (
        <EmptyState
          icon={<FiHeart className="w-12 h-12" />}
          title="暂无收藏"
          description="浏览商品并添加到您的收藏夹"
          actionLabel="去逛逛"
          actionHref="/products"
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {favorites.map((fav) => (
            <div key={fav.id} className="relative group">
              <ProductCard
                product={{
                  id: fav.product_id,
                  name: fav.name,
                  slug: fav.slug,
                  price: fav.price,
                  original_price: fav.original_price,
                  images: JSON.stringify([fav.image]),
                  sales_count: fav.sales_count,
                  is_new: 0,
                  is_featured: 0,
                  is_recommended: 0,
                  stock: fav.stock,
                }}
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleRemove(fav.product_id);
                }}
                disabled={removingId === fav.product_id}
                className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-50 hover:text-[var(--color-danger)]"
                aria-label="取消收藏"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
