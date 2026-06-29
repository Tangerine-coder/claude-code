'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { FiUser, FiHeart, FiPackage, FiLogOut, FiX } from 'react-icons/fi';

interface NavCategory {
  id: string;
  name: string;
  slug: string;
  children?: NavCategory[];
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  categories: NavCategory[];
}

export default function MobileMenu({ isOpen, onClose, categories }: MobileMenuProps) {
  const { user, logout } = useAuth();
  const [expandedCat, setExpandedCat] = React.useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] lg:hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-2xl overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
          <span className="font-bold text-[var(--color-primary)] text-lg">菜单</span>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* User section */}
        <div className="p-4 border-b border-[var(--color-border)]">
          {user ? (
            <div className="space-y-1">
              <p className="text-sm font-semibold">{user.username}</p>
              <p className="text-xs text-[var(--color-text-light)]">{user.email}</p>
            </div>
          ) : (
            <div className="flex gap-3">
              <Link href="/login" onClick={onClose} className="flex-1 text-center py-2 text-sm font-medium bg-[var(--color-primary)] text-white rounded-lg">登录</Link>
              <Link href="/register" onClick={onClose} className="flex-1 text-center py-2 text-sm font-medium border border-[var(--color-primary)] text-[var(--color-primary)] rounded-lg">注册</Link>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          <Link href="/" onClick={onClose} className="block px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-gray-50">首页</Link>
          {categories.map((cat) => (
            <div key={cat.id}>
              <button
                onClick={() => setExpandedCat(expandedCat === cat.slug ? null : cat.slug)}
                className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-gray-50"
              >
                {cat.name}
                {cat.children && cat.children.length > 0 && (
                  <svg className={`w-4 h-4 transition-transform ${expandedCat === cat.slug ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </button>
              {expandedCat === cat.slug && cat.children && (
                <div className="ml-4 space-y-1">
                  {cat.children.map((child) => (
                    <Link key={child.id} href={`/categories/${child.slug}`} onClick={onClose} className="block px-3 py-2 text-sm text-[var(--color-text-light)] rounded-lg hover:bg-gray-50">
                      {child.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* User links */}
        {user && (
          <div className="p-4 border-t border-[var(--color-border)] space-y-1">
            <Link href="/user/orders" onClick={onClose} className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg hover:bg-gray-50">
              <FiPackage className="w-4 h-4" /> 我的订单
            </Link>
            <Link href="/user/favorites" onClick={onClose} className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg hover:bg-gray-50">
              <FiHeart className="w-4 h-4" /> 收藏夹
            </Link>
            {user.role === 'admin' && (
              <Link href="/admin" onClick={onClose} className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-[var(--color-accent)] rounded-lg hover:bg-orange-50">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                进入后台
              </Link>
            )}
            <button onClick={() => { logout(); onClose(); }} className="flex items-center gap-3 px-3 py-2.5 text-sm text-[var(--color-danger)] rounded-lg hover:bg-red-50 w-full">
              <FiLogOut className="w-4 h-4" /> 退出登录
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
