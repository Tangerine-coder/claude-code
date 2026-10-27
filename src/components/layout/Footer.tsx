import Link from 'next/link';

const YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="relative bg-[var(--color-primary)] text-white/80 mt-16 overflow-hidden">
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* 品牌 */}
          <div>
            <h3 className="text-white font-bold text-sm mb-2 uppercase tracking-wider">海南等下雪</h3>
            <p className="text-xs text-[var(--color-accent-light)] mb-3 font-medium tracking-wide">
              Nova Mart 小众品质好物商城
            </p>
            <p className="text-sm leading-relaxed text-white/60">
              精选日用家居、潮流好物与数码产品，主打小众品质与限时折扣。
            </p>
          </div>

          {/* 商品分类 */}
          <div>
            <h3 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">商品分类</h3>
            <ul className="space-y-2">
              {[
                { label: '全部商品', href: '/search' },
                { label: '服装', href: '/categories/clothing' },
                { label: '电子产品', href: '/categories/electronics' },
                { label: '家居生活', href: '/categories/home-living' },
                { label: '新品上市', href: '/search?sort=newest' },
                { label: '特价专区', href: '/search?sort=price_asc' },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-white/60 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 用户服务 */}
          <div>
            <h3 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">用户服务</h3>
            <ul className="space-y-2">
              {[
                { label: '帮助中心', href: '/help' },
                { label: '隐私政策', href: '/legal/privacy' },
                { label: '用户协议', href: '/legal/terms' },
                { label: '7 天退换货规则', href: '/legal/returns' },
                { label: '配送说明', href: '/help#shipping' },
                { label: '联系我们', href: '/help#contact' },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-white/60 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 联系方式（演示数据） */}
          <div>
            <h3 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">联系方式</h3>
            <ul className="space-y-2 text-sm text-white/60">
              <li>邮箱：support@novamart.com</li>
              <li>客服：400-123-4567（演示）</li>
              <li>地址：四川省广安市广安区商业街 123 号</li>
              <li className="pt-1">周一至周五 9:00 - 18:00</li>
              <li>周六至周日 10:00 - 16:00</li>
            </ul>
          </div>
        </div>

        <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent border-0" />

        {/* 演示声明（合规：明确本站非真实经营） */}
        <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 mb-6">
          <p className="text-xs leading-relaxed text-white/55">
            本站为<strong className="text-white/80">技术演示原型</strong>，非经营性电商平台，不产生真实交易。
            页面中的商品、订单、地址、电话、备案号均为<strong className="text-white/80">模拟测试数据</strong>，
            如与实际情况雷同纯属巧合。演示账号：<span className="font-mono">user@example.com / user123</span>
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <p suppressHydrationWarning>&copy; {YEAR} 海南等下雪 · Nova Mart　保留所有权利</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/legal/privacy" className="hover:text-white/70 transition-colors">隐私政策</Link>
            <Link href="/legal/terms" className="hover:text-white/70 transition-colors">服务条款</Link>
            <Link href="/legal/returns" className="hover:text-white/70 transition-colors">退换货规则</Link>
            <span title="演示占位，非真实备案号">ICP 备案号：演示占位</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
