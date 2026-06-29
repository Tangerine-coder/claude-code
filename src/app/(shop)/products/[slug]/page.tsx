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
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [showMobileBar, setShowMobileBar] = useState(false);

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

  // ---- Mobile sticky bar scroll detection ----
  useEffect(() => {
    const handleScroll = () => setShowMobileBar(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
  const displayPrice = selectedSku && selectedSku.price !== null ? selectedSku.price : product?.price || 0;
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
        product.id, product.name, images[0], displayPrice,
        selectedSku?.id ?? null, selectedSku?.spec_info ?? '{}', quantity
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
          <Skeleton variant="text" width="200px" className="mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Skeleton variant="image" className="rounded-2xl" />
              <div className="flex gap-3">
                {Array.from({ length: 4 }, (_, i) => (
                  <Skeleton key={i} variant="rect" width="80px" height="80px" className="rounded-xl" />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <Skeleton variant="text" width="70%" className="h-8" />
              <Skeleton variant="text" width="40%" className="h-5" />
              <Skeleton variant="text" width="30%" className="h-7" />
              <Skeleton variant="text" width="100%" className="h-4" />
              <Skeleton variant="text" width="100%" className="h-4" />
              <Skeleton variant="text" width="60%" className="h-4" />
              <div className="flex gap-3 pt-4">
                <Skeleton variant="rect" width="160px" height="44px" className="rounded-xl" />
                <Skeleton variant="rect" width="160px" height="44px" className="rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ----- Error state -----
  if (error || !product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-[var(--color-bg-dark)] flex items-center justify-center mb-5">
          <svg className="w-10 h-10 text-[var(--color-text-lighter)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-[var(--color-text)] mb-2">{error || '商品未找到'}</h2>
        <p className="text-sm text-[var(--color-text-light)] mb-6">找不到您要查找的商品。</p>
        <Link href="/"><Button variant="primary">返回首页</Button></Link>
      </div>
    );
  }

  // ----- Specs parsing -----
  const specs: Record<string, string> = (() => {
    try { return JSON.parse(product.specs); } catch { return {}; }
  })();
  const specEntries = Object.entries(specs);

  // ----- Main render -----
  return (
    <div className="min-h-screen bg-[var(--color-bg)] pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <Breadcrumb items={[{ label: '商品', href: '/categories' }, { label: product.name }]} />

        {/* Two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mt-4">
          {/* ---- Image Gallery (left) ---- */}
          <ScrollReveal direction="left">
            <div className="space-y-4">
              {/* Main image with zoom cursor */}
              <div
                className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-sm cursor-zoom-in group"
                onClick={() => setLightboxOpen(true)}
              >
                <img
                  src={currentImage}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-150 transition-transform duration-700 ease-[var(--ease-out-expo)]"
                />
                {badgeVariant && (
                  <div className="absolute top-4 left-4">
                    <Badge variant={badgeVariant} size="md">{badgeLabels[badgeVariant]}</Badge>
                  </div>
                )}
                {/* Zoom hint icon */}
                <div className="absolute top-4 right-4 w-8 h-8 glass rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-4 h-4 text-[var(--color-text)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>

              {/* Thumbnail strip */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {images.map((img, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setActiveImageIndex(i)}
                      className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden transition-all duration-200 ${
                        i === activeImageIndex
                          ? 'ring-2 ring-offset-2 ring-[var(--color-accent)] shadow-md'
                          : 'ring-1 ring-[var(--color-border)]/50 hover:ring-gray-400 hover:shadow-sm'
                      }`}
                    >
                      <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </ScrollReveal>

          {/* ---- Product Info (right) ---- */}
          <ScrollReveal direction="right" delay={0.1}>
            <div className="space-y-5">
              <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text)] tracking-tight">{product.name}</h1>

              <div className="flex items-center gap-3">
                <StarRating rating={product.avg_rating} size="md" showValue count={product.review_count} />
                <span className="text-sm text-[var(--color-text-light)]">已售 {product.sales_count} 件</span>
              </div>

              <PriceDisplay price={displayPrice} originalPrice={displayOriginalPrice} size="lg" />

              {/* Stock status */}
              <div className="flex items-center gap-2">
                {stock > 0 ? (
                  <>
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-sm shadow-green-500/30" />
                    <span className="text-sm font-medium text-green-600">有货（库存 {stock} 件）</span>
                  </>
                ) : (
                  <>
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm shadow-red-500/30" />
                    <span className="text-sm font-medium text-red-500">售罄</span>
                  </>
                )}
              </div>

              {/* SKU Selector */}
              {product.skus && product.skus.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">选择规格</label>
                  <div className="flex flex-wrap gap-2">
                    {product.skus.map((sku) => {
                      let skuLabel = sku.sku_code;
                      try { const info = JSON.parse(sku.spec_info); skuLabel = Object.values(info).join(' / ') || sku.sku_code; } catch { /* use sku_code */ }
                      const isSelected = selectedSku?.id === sku.id;
                      return (
                        <button
                          type="button"
                          key={sku.id}
                          onClick={() => setSelectedSku(sku)}
                          disabled={sku.stock <= 0}
                          className={`px-4 py-2.5 text-sm rounded-xl border-2 transition-all duration-200 active:scale-[0.97] ${
                            isSelected
                              ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-white shadow-md shadow-[var(--color-accent)]/20'
                              : sku.stock <= 0
                                ? 'border-[var(--color-border)] bg-gray-100 text-gray-400 cursor-not-allowed line-through'
                                : 'border-[var(--color-border)] hover:border-[var(--color-accent)] hover:shadow-sm text-[var(--color-text)]'
                          }`}
                        >
                          {skuLabel}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">数量</label>
                <QuantityInput value={quantity} onChange={setQuantity} min={1} max={Math.min(stock, 99)} size="md" />
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  variant="primary" size="lg" onClick={handleAddToCart} loading={addingToCart}
                  disabled={stock <= 0} className="flex-1 shadow-[var(--shadow-accent)]"
                >
                  加入购物车
                </Button>
                <Button
                  variant="secondary" size="lg" onClick={handleBuyNow} loading={addingToCart}
                  disabled={stock <= 0} className="flex-1 shadow-md"
                >
                  立即购买
                </Button>
              </div>

              {/* Brand and tags */}
              <div className="pt-3 border-t border-[var(--color-border)] space-y-2">
                {product.brand && (
                  <p className="text-sm text-[var(--color-text-light)]">
                    <span className="font-medium text-[var(--color-text)]">品牌：</span> {product.brand}
                  </p>
                )}
                {product.tags && (
                  <div className="flex flex-wrap gap-1.5">
                    {product.tags.split(',').filter(Boolean).map((tag) => (
                      <span key={tag} className="inline-block px-3 py-1 bg-[var(--color-bg-dark)] text-xs text-[var(--color-text-light)] rounded-full">
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
          <div className="flex gap-1 border-b border-[var(--color-border)]">
            {(['description', 'specifications', 'reviews'] as const).map((tab) => (
              <button
                type="button"
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 text-sm font-semibold rounded-t-lg transition-all duration-200 ${
                  activeTab === tab
                    ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
                    : 'text-[var(--color-text-light)] hover:text-[var(--color-text)] hover:bg-gray-50'
                }`}
              >
                {tab === 'description' ? '商品详情' : tab === 'specifications' ? '产品参数' : `用户评价 (${product.review_count})`}
              </button>
            ))}
          </div>

          <div className="py-6">
            {activeTab === 'description' && (
              <ScrollReveal>
                <div className="prose prose-sm max-w-none text-[var(--color-text)] leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: product.description || '<p>暂无商品描述</p>' }} />
              </ScrollReveal>
            )}

            {activeTab === 'specifications' && (
              <ScrollReveal>
                {specEntries.length > 0 ? (
                  <table className="w-full max-w-xl border-collapse">
                    <tbody>
                      {specEntries.map(([key, value]) => (
                        <tr key={key} className="border-b border-[var(--color-border)]">
                          <td className="py-3 pr-6 text-sm font-medium text-[var(--color-text)] w-40">{key}</td>
                          <td className="py-3 text-sm text-[var(--color-text-light)]">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-sm text-[var(--color-text-light)]">暂无产品参数</p>
                )}
              </ScrollReveal>
            )}

            {activeTab === 'reviews' && (
              <ScrollReveal>
                {product.reviews && product.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {product.reviews.map((review) => (
                      <div key={review.id} className="bg-white rounded-xl p-5 shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-sm font-bold text-white shadow-sm">
                            {(review.username || 'A').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[var(--color-text)]">{review.username || '匿名用户'}</p>
                            <StarRating rating={review.rating} size="sm" />
                          </div>
                          <span className="ml-auto text-xs text-[var(--color-text-lighter)]">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-[var(--color-text-light)] leading-relaxed">{review.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[var(--color-text-light)]">暂无评价，成为第一个评价此商品的用户吧</p>
                )}
              </ScrollReveal>
            )}
          </div>
        </div>

        {/* ---- Related Products ---- */}
        {product.related && product.related.length > 0 && (
          <section className="mt-12 md:mt-16">
            <ScrollReveal>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 bg-[var(--color-accent)] rounded-full" />
                <h2 className="text-xl md:text-2xl font-bold text-[var(--color-text)]">相关推荐</h2>
              </div>
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

      {/* ---- Lightbox ---- */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[10000] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            className="absolute top-4 right-4 w-12 h-12 glass rounded-full flex items-center justify-center text-white z-10 hover:scale-110 transition-transform"
            onClick={() => setLightboxOpen(false)}
            aria-label="关闭"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          {images.length > 1 && (
            <>
              <button
                type="button"
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 glass rounded-full flex items-center justify-center text-white z-10 hover:scale-110 transition-transform"
                onClick={(e) => { e.stopPropagation(); setActiveImageIndex((activeImageIndex - 1 + images.length) % images.length); }}
                aria-label="上一张"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 glass rounded-full flex items-center justify-center text-white z-10 hover:scale-110 transition-transform"
                onClick={(e) => { e.stopPropagation(); setActiveImageIndex((activeImageIndex + 1) % images.length); }}
                aria-label="下一张"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
          <img
            src={currentImage}
            alt={product.name}
            className="max-w-full max-h-[85vh] object-contain rounded-xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* ---- Mobile Sticky CTA Bar ---- */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 md:hidden glass border-t border-white/20 transition-all duration-300 ${
        showMobileBar ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}>
        <div className="flex items-center gap-3 px-4 py-3 max-w-7xl mx-auto">
          <div className="flex-shrink-0">
            <PriceDisplay price={displayPrice} originalPrice={displayOriginalPrice} size="sm" />
            <span className="text-xs text-[var(--color-text-light)]">{stock > 0 ? `库存 ${stock}` : '售罄'}</span>
          </div>
          <Button
            variant="primary" size="md" onClick={handleAddToCart} loading={addingToCart}
            disabled={stock <= 0} className="flex-1 shadow-[var(--shadow-accent)]"
          >
            加入购物车
          </Button>
          <Button
            variant="secondary" size="md" onClick={handleBuyNow} loading={addingToCart}
            disabled={stock <= 0} className="flex-1 shadow-md"
          >
            立即购买
          </Button>
        </div>
      </div>
    </div>
  );
}
