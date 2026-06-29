'use client';

import HeroBanner from '@/components/home/HeroBanner';
import CategoryIcons from '@/components/home/CategoryIcons';
import ProductSection from '@/components/home/ProductSection';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function ShopHome() {
  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <HeroBanner />

      {/* Category Icons */}
      <CategoryIcons />

      {/* Featured Products */}
      <ScrollReveal>
        <ProductSection
          title="精选推荐"
          subtitle="为您精心挑选"
          viewAllHref="/categories/featured"
          apiParams="featured=1"
          badge="hot"
        />
      </ScrollReveal>

      {/* New Arrivals */}
      <ScrollReveal>
        <ProductSection
          title="新品上市"
          subtitle="本周新鲜上架"
          viewAllHref="/categories/new-arrivals"
          apiParams="is_new=1"
          badge="new"
        />
      </ScrollReveal>

      {/* Promotional Banner */}
      <section className="relative my-8 md:my-12">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #ff6b35 0%, #f7c948 50%, #ee5a24 100%)',
              }}
            >
              <div className="px-6 py-12 md:py-20 text-center text-white">
                <h2 className="text-3xl md:text-5xl font-extrabold mb-3 tracking-tight">
                  夏日狂欢季
                </h2>
                <p className="text-lg md:text-2xl font-semibold mb-2 opacity-90">
                  全场低至5折
                </p>
                <p className="text-sm md:text-base opacity-75 max-w-lg mx-auto">
                  不要错过本季最大促销，数千件商品限时抢购。
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Popular Picks */}
      <ScrollReveal>
        <ProductSection
          title="热销榜单"
          subtitle="深受用户喜爱"
          viewAllHref="/categories/popular"
          apiParams="recommended=1"
          badge="bestseller"
        />
      </ScrollReveal>

      {/* Special Offers */}
      <ScrollReveal>
        <ProductSection
          title="特价优惠"
          subtitle="超值好价，不容错过"
          viewAllHref="/categories/offers"
          apiParams="recommended=1&sort=price_asc"
          badge="sale"
        />
      </ScrollReveal>
    </div>
  );
}
