'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { FiUser, FiPackage, FiMapPin, FiHeart, FiClock, FiSettings } from 'react-icons/fi';
import clsx from 'clsx';

const navItems = [
  { label: '个人中心', href: '/user', icon: FiUser },
  { label: '我的订单', href: '/user/orders', icon: FiPackage },
  { label: '收货地址', href: '/user/addresses', icon: FiMapPin },
  { label: '我的收藏', href: '/user/favorites', icon: FiHeart },
  { label: '浏览记录', href: '/user/history', icon: FiClock },
  { label: '账户设置', href: '/user/settings', icon: FiSettings },
];

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-10 w-10 text-[var(--color-accent)]" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm text-[var(--color-text-light)]">加载中...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex gap-8">
        {/* Sidebar */}
        <aside className="w-56 flex-shrink-0 hidden md:block">
          <nav className="sticky top-24 space-y-1">
            <div className="px-3 py-2 mb-4">
              <p className="text-xs font-semibold text-[var(--color-text-lighter)] uppercase tracking-wider">个人中心菜单</p>
            </div>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-[var(--color-accent)] text-white shadow-sm'
                      : 'text-[var(--color-text-light)] hover:bg-gray-100 hover:text-[var(--color-text)]'
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </div>
    </div>
  );
}
