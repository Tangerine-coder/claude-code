import type { Metadata } from 'next';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { ToastProvider } from '@/contexts/ToastContext';
import BackgroundEffect from '@/components/layout/BackgroundEffect';
import './globals.css';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://hai-nan-deng-xia-xue.onrender.com';
const SITE_TITLE = '海南等下雪 · Nova Mart —— 品质好物在线商店';
const SITE_DESC =
  '海南等下雪 Nova Mart：服装、电子数码、家居生活三大类目，支持分类筛选、购物车、在线下单与订单查询。满 ¥99 免运费。';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: '%s | 海南等下雪',
  },
  description: SITE_DESC,
  keywords: ['海南等下雪', 'Nova Mart', '在线购物', '服装', '数码', '家居'],
  openGraph: {
    type: 'website',
    siteName: '海南等下雪 · Nova Mart',
    locale: 'zh_CN',
    title: SITE_TITLE,
    description: SITE_DESC,
    url: '/',
    images: [{ url: '/images/og-cover.png', width: 1200, height: 630, alt: '海南等下雪 · Nova Mart' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESC,
    images: ['/images/og-cover.png'],
  },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="relative min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] antialiased">
        <BackgroundEffect />
        <div className="relative z-10">
          <ToastProvider>
            <AuthProvider>
              <CartProvider>
                {children}
              </CartProvider>
            </AuthProvider>
          </ToastProvider>
        </div>
      </body>
    </html>
  );
}
