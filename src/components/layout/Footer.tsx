import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[var(--color-primary)] text-white/80 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">关于海南等下雪</h3>
            <p className="text-sm leading-relaxed text-white/60">
              您的高端购物首选平台。我们精选优质好物，提供卓越服务与超值价格。
            </p>
            <div className="flex gap-3 mt-4">
              {['facebook', 'twitter', 'instagram'].map((s) => (
                <a key={s} href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[var(--color-accent)] transition-colors text-sm">
                  {s[0].toUpperCase()}
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

        <hr className="border-white/10 my-8" />

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
