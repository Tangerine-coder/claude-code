'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

/**
 * 右下角悬浮工具：在线客服 + 回到顶部
 */
export default function FloatingTools() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed right-4 bottom-20 md:bottom-8 z-40 flex flex-col gap-3">
      <Link
        href="/help#contact"
        aria-label="在线客服"
        title="在线客服"
        className="w-11 h-11 rounded-full bg-[var(--color-accent)] text-white shadow-lg flex items-center justify-center hover:scale-105 hover:shadow-xl transition-all"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </Link>

      <button
        type="button"
        aria-label="回到顶部"
        title="回到顶部"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`w-11 h-11 rounded-full bg-white text-[var(--color-primary)] border border-[var(--color-border)] shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-300 ${
          showTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
        }`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </div>
  );
}
