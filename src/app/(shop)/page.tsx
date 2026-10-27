'use client';

import HeroBanner from '@/components/home/HeroBanner';
import CategoryIcons from '@/components/home/CategoryIcons';
import ProductSection from '@/components/home/ProductSection';
import TrustBadges from '@/components/home/TrustBadges';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function ShopHome() {
  return (
    <div className="min-h-screen">
      {/* 轮播 Banner */}
      <HeroBanner />

      {/* 品牌主标题（全站唯一 h1） */}
      <section className="max-w-7xl mx-auto px-4 pt-8 md:pt-10">
        <div className="mx-auto w-fit max-w-full text-center rounded-2xl bg-white/75 backdrop-blur px-6 py-4 md:px-10 md:py-5 shadow-sm border border-[var(--color-border)]">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[var(--color-text)] mb-2">
            Nova Mart 线上商城
          </h1>
          <p className="text-sm md:text-base text-[var(--color-text-light)]">
            日用家居｜潮流好物｜限时折扣购物平台
          </p>
        </div>
      </section>

      {/* 分类入口 */}
      <CategoryIcons />

      {/* 信任保障 */}
      <TrustBadges />

      {/* 精选推荐 */}
      <ScrollReveal>
        <ProductSection
          title="精选推荐"
          subtitle="小编口碑优选"
          ctaLabel="浏览精选好物"
          viewAllHref="/categories/featured"
          apiParams="featured=1"
          badge="hot"
        />
      </ScrollReveal>

      {/* 新品上市 */}
      <ScrollReveal>
        <ProductSection
          title="新品上市"
          subtitle="本周全新上架"
          ctaLabel="查看全部新品"
          viewAllHref="/categories/new-arrivals"
          apiParams="is_new=1"
          badge="new"
        />
      </ScrollReveal>

      {/* 限时活动（不绑定季节） */}
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
                  限时狂欢特惠
                </h2>
                <p className="text-lg md:text-2xl font-semibold mb-2 opacity-90">
                  全场低至 5 折
                </p>
                <p className="text-sm md:text-base opacity-75 max-w-lg mx-auto">
                  限时折扣商品，售完即止。
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 热销榜单 */}
      <ScrollReveal>
        <ProductSection
          title="热销榜单"
          subtitle="平台爆款好物"
          ctaLabel="查看爆款榜单"
          viewAllHref="/categories/popular"
          apiParams="recommended=1"
          badge="bestseller"
        />
      </ScrollReveal>

      {/* 特价专区 */}
      <ScrollReveal>
        <ProductSection
          title="特价专区"
          subtitle="高性价比清仓"
          ctaLabel="进入特价专区"
          viewAllHref="/categories/offers"
          apiParams="recommended=1&sort=price_asc"
          badge="sale"
        />
      </ScrollReveal>
    </div>
  );
}
