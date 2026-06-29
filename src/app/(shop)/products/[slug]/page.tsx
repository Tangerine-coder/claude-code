'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import StarRating from '@/components/ui/StarRating';
import QuantityInput from '@/components/ui/QuantityInput';
import PriceDisplay from '@/components/ui/PriceDisplay';
import Badge from '@/components/ui/Badge';
import ScrollReveal from '@/components/ui/ScrollReveal';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Skeleton from '@/components/ui/Skeleton';
import ProductCard from '@/components/product/ProductCard';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';
import { formatPrice } from '@/lib/utils';

interface ProductData {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  original_price: number | null;
  stock: number;
  category_id: string | null;
  brand: string;
  images: string;
  specs: string;
  tags: string;
  is_featured: number;
  is_new: number;
  is_recommended: number;
  sales_count: number;
  status: string;
  skus: SkuData[];
  reviews: ReviewData[];
  review_count: number;
  avg_rating: number;
  related: RelatedProduct[];
}

interface SkuData {
  id: string;
  product_id: string;
  spec_info: string;
  price: number | null;
  stock: number;
  sku_code: string;
}

interface ReviewData {
  id: string;
  product_id: string;
  user_id: string | null;
  rating: number;
  content: string;
  images: string;
  created_at: string;
  username?: string;
  avatar?: string;
}

interface RelatedProduct {
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

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const { addItem } = useCart();
  const { addToast } = useToast();

  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>('description');
  const [selectedSku, setSelectedSku] = useState<SkuData | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/products/${slug}`);
        const data = await res.json();
        if (!data.success) {
          setError(data.message || 'Product not found');
          return;
        }
        setProduct(data.data);
        if (data.data.skus && data.data.skus.length > 0) {
          setSelectedSku(data.data.skus[0]);
        }
      } catch {
        setError('加载商品失败，请稍后重试。');
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [slug]);

  // ----- Image helpers -----
  const images: string[] = (() => {
    if (!product) return [];
    try {
      const parsed = JSON.parse(product.images);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : ['/images/placeholder.svg'];
    } catch {
      return ['/images/placeholder.svg'];
    }
  })();

  const currentImage = images[activeImageIndex] || images[0];

  // ----- Price -----
  const displayPrice =
    selectedSku && selectedSku.price !== null ? selectedSku.price : product?.price || 0;
  const displayOriginalPrice = selectedSku ? null : (product?.original_price ?? null);

  // ----- Stock -----
  const stock = selectedSku ? selectedSku.stock : (product?.stock ?? 0);

  // ----- Badge -----
  const getBadgeVariant = (): 'new' | 'hot' | 'sale' | 'bestseller' | undefined => {
    if (!product) return undefined;
    if (product.is_new) return 'new';
    if (product.is_featured) return 'hot';
    if (product.original_price && product.original_price > product.price) return 'sale';
    if (product.sales_count > 1000) return 'bestseller';
    return undefined;
  };

  const badgeVariant = getBadgeVariant();
  const badgeLabels: Record<string, string> = {
    new: 'NEW',
    hot: 'HOT',
    sale: 'SALE',
    bestseller: 'BESTSELLER',
  };

  // ----- Handlers -----
  const handleAddToCart = async () => {
    if (!product) return;
    setAddingToCart(true);
    try {
      await addItem(
        product.id,
        product.name,
        images[0],
        displayPrice,
        selectedSku?.id ?? null,
        selectedSku?.spec_info ?? '{}',
        quantity
      );
      addToast('已加入购物车！', 'success');
    } catch {
      addToast('加入购物车失败', 'error');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    router.push('/checkout');
  };

  // ----- Loading state -----
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)]">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Breadcrumb skeleton */}
          <Skeleton variant="text" width="200px" className="mb-6" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Image skeleton */}
            <div className="space-y-4">
              <Skeleton variant="image" className="rounded-xl" />
              <div className="flex gap-3">
                {Array.from({ length: 4 }, (_, i) => (
                  <Skeleton key={i} variant="rect" width="80px" height="80px" className="rounded-lg" />
                ))}
              </div>
            </div>

            {/* Info skeleton */}
            <div className="space-y-4">
              <Skeleton variant="text" width="70%" className="h-8" />
              <Skeleton variant="text" width="40%" className="h-5" />
              <Skeleton variant="text" width="30%" className="h-7" />
              <Skeleton variant="text" width="100%" className="h-4" />
              <Skeleton variant="text" width="100%" className="h-4" />
              <Skeleton variant="text" width="60%" className="h-4" />
              <div className="flex gap-3 pt-4">
                <Skeleton variant="rect" width="160px" height="44px" className="rounded-lg" />
                <Skeleton variant="rect" width="160px" height="44px" className="rounded-lg" />
              </div>
            </div>
          </div>

          {/* Tabs skeleton */}
          <div className="mt-12 space-y-4">
            <div className="flex gap-4 border-b pb-2">
              {Array.from({ length: 3 }, (_, i) => (
                <Skeleton key={i} variant="rect" width="100px" height="36px" className="rounded" />
              ))}
            </div>
            <div className="space-y-3">
              {Array.from({ length: 5 }, (_, i) => (
                <Skeleton key={i} variant="text" width={`${90 - i * 10}%`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ----- Error / Not found state -----
  if (error || !product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <svg className="w-16 h-16 text-[var(--color-text-lighter)] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="text-xl font-bold text-[var(--color-text)] mb-2">
          {error || '商品未找到'}
        </h2>
        <p className="text-sm text-[var(--color-text-light)] mb-6">
          找不到您要查找的商品。
        </p>
        <Link href="/">
          <Button variant="primary">返回首页</Button>
        </Link>
      </div>
    );
  }

  // ----- Specs parsing -----
  const specs: Record<string, string> = (() => {
    try {
      return JSON.parse(product.specs);
    } catch {
      return {};
    }
  })();

  const specEntries = Object.entries(specs);

  // ----- Main render -----
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: '商品', href: '/categories' },
            { label: product.name },
          ]}
        />

        {/* Two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          {/* ---- Image Gallery (left) ---- */}
          <ScrollReveal direction="left">
            <div className="space-y-4">
              {/* Main image */}
              <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 border border-[var(--color-border)]">
                <img
                  src={currentImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {badgeVariant && (
                  <div className="absolute top-3 left-3">
                    <Badge variant={badgeVariant} size="md">
                      {badgeLabels[badgeVariant]}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Thumbnail strip */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImageIndex(i)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        i === activeImageIndex
                          ? 'border-[var(--color-accent)] ring-1 ring-[var(--color-accent)]'
                          : 'border-[var(--color-border)] hover:border-gray-400'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </ScrollReveal>

          {/* ---- Product Info (right) ---- */}
          <ScrollReveal direction="right" delay={0.1}>
            <div className="space-y-5">
              {/* Name */}
              <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text)]">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <StarRating
                  rating={product.avg_rating}
                  size="md"
                  showValue
                  count={product.review_count}
                />
                <span className="text-sm text-[var(--color-text-light)]">
                  已售 {product.sales_count} 件
                </span>
              </div>

              {/* Price */}
              <PriceDisplay
                price={displayPrice}
                originalPrice={displayOriginalPrice}
                size="lg"
              />

              {/* Stock status */}
              <div className="flex items-center gap-2">
                {stock > 0 ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-sm font-medium text-green-600">
                      有货（库存 {stock} 件）
                    </span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="text-sm font-medium text-red-500">售罄</span>
                  </>
                )}
              </div>

              {/* SKU Selector */}
              {product.skus && product.skus.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    选择规格
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.skus.map((sku) => {
                      let skuLabel = sku.sku_code;
                      try {
                        const info = JSON.parse(sku.spec_info);
                        skuLabel = Object.values(info).join(' / ') || sku.sku_code;
                      } catch {
                        // use sku_code
                      }
                      const isSelected = selectedSku?.id === sku.id;
                      return (
                        <button
                          key={sku.id}
                          onClick={() => setSelectedSku(sku)}
                          disabled={sku.stock <= 0}
                          className={`px-4 py-2 text-sm rounded-lg border transition-all ${
                            isSelected
                              ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-white'
                              : sku.stock <= 0
                              ? 'border-[var(--color-border)] bg-gray-100 text-gray-400 cursor-not-allowed line-through'
                              : 'border-[var(--color-border)] hover:border-[var(--color-accent)] text-[var(--color-text)]'
                          }`}
                        >
                          {skuLabel}
                        </button>
                      );
                    })}
                  </div>
                  {selectedSku && selectedSku.price !== null && (
                    <p className="text-sm text-[var(--color-text-light)] mt-1.5">
                      规格价格：{formatPrice(selectedSku.price)}
                    </p>
                  )}
                </div>
              )}

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                  数量
                </label>
                <QuantityInput
                  value={quantity}
                  onChange={setQuantity}
                  min={1}
                  max={Math.min(stock, 99)}
                  size="md"
                />
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleAddToCart}
                  loading={addingToCart}
                  disabled={stock <= 0}
                  className="flex-1"
                >
                  加入购物车
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={handleBuyNow}
                  loading={addingToCart}
                  disabled={stock <= 0}
                  className="flex-1"
                >
                  立即购买
                </Button>
              </div>

              {/* Brand and tags */}
              <div className="pt-3 border-t border-[var(--color-border)] space-y-2">
                {product.brand && (
                  <p className="text-sm text-[var(--color-text-light)]">
                    <span className="font-medium text-[var(--color-text)]">品牌：</span>{' '}
                    {product.brand}
                  </p>
                )}
                {product.tags && (
                  <div className="flex flex-wrap gap-1.5">
                    {product.tags.split(',').filter(Boolean).map((tag) => (
                      <span
                        key={tag}
                        className="inline-block px-2.5 py-0.5 bg-gray-100 text-xs text-[var(--color-text-light)] rounded-full"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* ---- Tabs Section ---- */}
        <div className="mt-12 md:mt-16">
          {/* Tab nav */}
          <div className="flex border-b border-[var(--color-border)] gap-0">
            {(['description', 'specifications', 'reviews'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 text-sm font-semibold transition-all border-b-2 -mb-px ${
                  activeTab === tab
                    ? 'border-[var(--color-accent)] text-[var(--color-accent)]'
                    : 'border-transparent text-[var(--color-text-light)] hover:text-[var(--color-text)]'
                }`}
              >
                {tab === 'description'
                  ? '商品详情'
                  : tab === 'specifications'
                  ? '产品参数'
                  : `用户评价 (${product.review_count})`}
              </button>
            ))}
          </div>

          {/* Tab panels */}
          <div className="py-6">
            {activeTab === 'description' && (
              <ScrollReveal>
                <div
                  className="prose prose-sm max-w-none text-[var(--color-text)] leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: product.description || '<p>暂无商品描述</p>' }}
                />
              </ScrollReveal>
            )}

            {activeTab === 'specifications' && (
              <ScrollReveal>
                {specEntries.length > 0 ? (
                  <table className="w-full max-w-xl border-collapse">
                    <tbody>
                      {specEntries.map(([key, value]) => (
                        <tr key={key} className="border-b border-[var(--color-border)]">
                          <td className="py-3 pr-6 text-sm font-medium text-[var(--color-text)] w-40">
                            {key}
                          </td>
                          <td className="py-3 text-sm text-[var(--color-text-light)]">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-sm text-[var(--color-text-light)]">
                    暂无产品参数
                  </p>
                )}
              </ScrollReveal>
            )}

            {activeTab === 'reviews' && (
              <ScrollReveal>
                {product.reviews && product.reviews.length > 0 ? (
                  <div className="space-y-5">
                    {product.reviews.map((review) => (
                      <div
                        key={review.id}
                        className="border border-[var(--color-border)] rounded-lg p-4"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-[var(--color-text-light)]">
                            {(review.username || 'A').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[var(--color-text)]">
                              {review.username || '匿名用户'}
                            </p>
                            <StarRating rating={review.rating} size="sm" />
                          </div>
                          <span className="ml-auto text-xs text-[var(--color-text-lighter)]">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-[var(--color-text-light)] leading-relaxed">
                          {review.content}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[var(--color-text-light)]">
                    暂无评价，成为第一个评价此商品的用户吧
                  </p>
                )}
              </ScrollReveal>
            )}
          </div>
        </div>

        {/* ---- Related Products ---- */}
        {product.related && product.related.length > 0 && (
          <section className="mt-12 md:mt-16">
            <ScrollReveal>
              <h2 className="text-xl md:text-2xl font-bold text-[var(--color-text)] mb-6">
                相关推荐
              </h2>
            </ScrollReveal>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
              {product.related.map((item, i) => (
                <ScrollReveal key={item.id} delay={i * 0.05}>
                  <ProductCard product={item} />
                </ScrollReveal>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
