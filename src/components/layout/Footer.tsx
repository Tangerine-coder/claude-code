import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative bg-[var(--color-primary)] text-white/80 mt-16 overflow-hidden">
      {/* Subtle gradient texture overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }} />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">关于海南等下雪</h3>
            <p className="text-sm leading-relaxed text-white/60">
              您的高端购物首选平台。我们精选优质好物，提供卓越服务与超值价格。
            </p>
            <div className="flex gap-3 mt-4">
              {[
                { name: '微信', icon: 'M17 11h-1V8a4 4 0 10-8 0v3H7a2 2 0 00-2 2v7a2 2 0 002 2h10a2 2 0 002-2v-7a2 2 0 00-2-2zm-7-3a2 2 0 114 0v3h-4V8zm2 8.5A1.5 1.5 0 1112 13a1.5 1.5 0 010 3.5z' },
                { name: '微博', icon: 'M20.194 14.197c0 3.862-4.473 7-9.988 7-5.516 0-9.988-3.138-9.988-7 0-3.861 4.472-6.999 9.988-6.999s9.988 3.138 9.988 7z' },
                { name: '抖音', icon: 'M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.89a2.89 2.89 0 01-5.76 0 2.89 2.89 0 012.89-2.89c.3 0 .59.05.86.13v-3.5a6.33 6.33 0 00-.86-.07A6.33 6.33 0 003.17 15.9a6.33 6.33 0 0012.66 0v-6.7a8.14 8.14 0 004.73 1.52V7.23a4.83 4.83 0 01-.97-.54z' },
              ].map((s) => (
                <a key={s.name} href="#" aria-label={s.name}
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center
                             hover:bg-[var(--color-accent)] hover:scale-110 hover:shadow-lg
                             transition-all duration-200">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d={s.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">购物导航</h3>
            <ul className="space-y-2">
              {[
                { label: '全部商品', href: '/search' },
                { label: '服装', href: '/categories/clothing' },
                { label: '电子产品', href: '/categories/electronics' },
                { label: '家居生活', href: '/categories/home-living' },
                { label: '新品上市', href: '/search?sort=newest' },
                { label: '特价促销', href: '/search?sort=price_asc' },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-white/60 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">客户服务</h3>
            <ul className="space-y-2">
              {[
                { label: '帮助中心', href: '/help' },
                { label: '配送说明', href: '/help' },
                { label: '退换货政策', href: '/help' },
                { label: '尺码指南', href: '/help' },
                { label: '联系我们', href: '/help' },
                { label: '隐私政策', href: '/help' },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-white/60 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">联系方式</h3>
            <ul className="space-y-2 text-sm text-white/60">
              <li>📍 四川省广安市广安区商业街123号</li>
              <li>中国 四川省 广安市 638000</li>
              <li>📧 support@novamart.com</li>
              <li>📞 +86 400-123-4567</li>
              <li className="mt-2">周一至周五: 9:00 - 18:00</li>
              <li>周六至周日: 10:00 - 16:00</li>
            </ul>
          </div>
        </div>

        <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent border-0" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <p suppressHydrationWarning>&copy; {new Date().getFullYear()} 海南等下雪 版权所有</p>
          <div className="flex gap-4">
            <span>隐私政策</span>
            <span>服务条款</span>
            <span>Cookie政策</span>
            <span>ICP备12345678号</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
