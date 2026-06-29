'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import CartDrawer from '@/components/cart/CartDrawer';
import SearchInput from '@/components/search/SearchInput';
import MobileMenu from './MobileMenu';
import { FiUser, FiHeart, FiLogOut, FiPackage, FiMapPin } from 'react-icons/fi';

interface NavCategory {
  id: string;
  name: string;
  slug: string;
  parent_id?: string | null;
  children?: NavCategory[];
}

export default function Header() {
  const { itemCount } = useCart();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState<string | null>(null);
  const [categories, setCategories] = useState<NavCategory[]>([]);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const megaTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((d) => { if (d.success) setCategories(d.data); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleMegaEnter = (slug: string) => {
    if (megaTimeout.current) clearTimeout(megaTimeout.current);
    setMegaMenuOpen(slug);
  };

  const handleMegaLeave = () => {
    megaTimeout.current = setTimeout(() => setMegaMenuOpen(null), 200);
  };

  const topCats = categories.map((c) => ({ ...c, children: undefined }));

  return (
    <>
      {/* Top announcement bar */}
      <div className="bg-[var(--color-primary)] text-white text-xs text-center py-1.5 px-4 font-medium">
        🎉 全场商品免费！立即抢购
      </div>

      <header
        className={`sticky top-0 z-50 transition-all duration-300 bg-white ${
          isScrolled ? 'shadow-md' : 'shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-9 h-9 bg-[var(--color-primary)] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">海</span>
              </div>
              <span className="text-xl font-bold text-[var(--color-primary)] hidden sm:block">
                海南等下雪
              </span>
            </Link>

            {/* Category nav - desktop */}
            <nav className="hidden lg:flex items-center gap-1 ml-8" onMouseLeave={handleMegaLeave}>
              <Link href="/" className="px-3 py-2 text-sm font-medium text-[var(--color-text)] hover:text-[var(--color-accent)] rounded-lg hover:bg-gray-50 transition-colors">
                首页
              </Link>
              {categories.filter((c) => !c.parent_id).map((cat) => (
                <div key={cat.id} className="relative" onMouseEnter={() => handleMegaEnter(cat.slug)} onMouseLeave={handleMegaLeave}>
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="px-3 py-2 text-sm font-medium text-[var(--color-text)] hover:text-[var(--color-accent)] rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1"
                  >
                    {cat.name}
                    {cat.children && cat.children.length > 0 && (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </Link>
                  {/* Mega dropdown */}
                  {megaMenuOpen === cat.slug && cat.children && cat.children.length > 0 && (
                    <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-xl border border-[var(--color-border)] p-4 min-w-[220px] z-50">
                      <div className="space-y-1">
                        <Link
                          href={`/categories/${cat.slug}`}
                          className="block px-3 py-2 text-sm font-semibold text-[var(--color-primary)] hover:bg-gray-50 rounded-lg"
                        >
                          全部{cat.name}
                        </Link>
                        {cat.children.map((child) => (
                          <Link
                            key={child.id}
                            href={`/categories/${child.slug}`}
                            className="block px-3 py-2 text-sm text-[var(--color-text)] hover:text-[var(--color-accent)] hover:bg-gray-50 rounded-lg"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Search + Actions */}
            <div className="flex items-center gap-2 flex-1 justify-end ml-4">
              <div className="hidden md:block flex-1 max-w-md">
                <SearchInput />
              </div>

              {/* User menu - logged in */}
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-1.5 p-2 rounded-lg hover:bg-gray-100 transition-colors text-[var(--color-text-light)] hover:text-[var(--color-text)]"
                    aria-label="User menu"
                  >
                    <FiUser className="w-5 h-5" />
                    <span className="text-sm font-medium hidden lg:inline">{user.username}</span>
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-xl border border-[var(--color-border)] py-2 z-50">
                      <div className="px-4 py-2 border-b border-[var(--color-border)]">
                        <p className="text-sm font-semibold text-[var(--color-text)]">{user.username}</p>
                        <p className="text-xs text-[var(--color-text-light)]">{user.email}</p>
                      </div>
                      <Link href="/user" className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--color-text)] hover:bg-gray-50">
                        <FiUser className="w-4 h-4" /> 我的账户
                      </Link>
                      <Link href="/user/orders" className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--color-text)] hover:bg-gray-50">
                        <FiPackage className="w-4 h-4" /> 我的订单
                      </Link>
                      <Link href="/user/favorites" className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--color-text)] hover:bg-gray-50">
                        <FiHeart className="w-4 h-4" /> 收藏夹
                      </Link>
                      <Link href="/user/addresses" className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--color-text)] hover:bg-gray-50">
                        <FiMapPin className="w-4 h-4" /> 地址管理
                      </Link>
                      {user.role === 'admin' && (
                        <>
                          <hr className="my-1 border-[var(--color-border)]" />
                          <Link href="/admin" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[var(--color-accent)] hover:bg-orange-50">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            进入后台
                          </Link>
                        </>
                      )}
                      <hr className="my-1 border-[var(--color-border)]" />
                      <button onClick={() => { logout(); setUserMenuOpen(false); }} className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--color-danger)] hover:bg-red-50 w-full text-left">
                        <FiLogOut className="w-4 h-4" /> 退出登录
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Login/Register buttons - not logged in */
                <div className="flex items-center gap-2">
                  <Link href="/login" className="px-3 py-2 text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-accent)] border border-[var(--color-primary)] hover:border-[var(--color-accent)] rounded-lg transition-colors whitespace-nowrap">
                    登录
                  </Link>
                  <Link href="/register" className="px-3 py-2 text-sm font-medium text-white bg-[var(--color-accent)] hover:bg-[var(--color-accent-dark)] rounded-lg transition-colors whitespace-nowrap">
                    注册
                  </Link>
                </div>
              )}

              {/* Cart button */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors text-[var(--color-text-light)] hover:text-[var(--color-text)]"
                aria-label="Shopping cart"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--color-accent)] text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-[var(--color-text)]"
                aria-label="Menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile search */}
          <div className="md:hidden pb-3">
            <SearchInput />
          </div>
        </div>
      </header>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} categories={topCats} />
    </>
  );
}
