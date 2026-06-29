'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
  link_url: string;
}

export default function HeroBanner() {
  const [banners, setBanners] = useState<Banner[]>([]);

  useEffect(() => {
    fetch('/api/banners')
      .then((r) => r.json())
      .then((d) => { if (d.success) setBanners(d.data); })
      .catch(() => {});
  }, []);

  // Premium fallback hero when no banners loaded
  if (banners.length === 0) {
    return (
      <div className="relative w-full h-[400px] md:h-[560px] gradient-primary flex items-center justify-center overflow-hidden">
        {/* Decorative geometric elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full border border-white/30" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full border border-white/20" />
          <div className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full border border-white/20" />
        </div>
        {/* Floating accent dots */}
        <div className="absolute top-1/4 right-1/4 w-4 h-4 rounded-full bg-[var(--color-accent)]/60 animate-[float_4s_ease-in-out_infinite]" />
        <div className="absolute bottom-1/3 left-1/5 w-3 h-3 rounded-full bg-[var(--color-accent)]/40 animate-[float_5s_ease-in-out_infinite_1s]" />
        <div className="absolute top-1/3 right-1/3 w-2 h-2 rounded-full bg-white/40 animate-[float_6s_ease-in-out_infinite_2s]" />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        {/* Content */}
        <div className="relative z-10 text-center text-white px-4">
          <div className="inline-block w-12 h-1 bg-[var(--color-accent)] rounded-full mb-6" />
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 drop-shadow-2xl">
            欢迎来到
            <span className="block gradient-text-accent">海南等下雪</span>
          </h1>
          <p className="text-lg md:text-2xl font-light tracking-wide opacity-90 mb-8">
            发现优质好物，享受超值价格
          </p>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[var(--color-accent)] text-white font-semibold rounded-xl
                       shadow-[var(--shadow-accent)] hover:shadow-xl hover:brightness-110
                       transition-all duration-[var(--duration-normal)] ease-[var(--ease-out-expo)]
                       active:scale-[0.97] animate-[pulse-glow_3s_ease-in-out_infinite]"
          >
            立即购物
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* Bottom scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-5 h-8 rounded-full border-2 border-white/30 flex justify-center">
            <div className="w-1 h-2 bg-white/60 rounded-full mt-1.5 animate-[float_2s_ease-in-out_infinite]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        navigation
        pagination={{ clickable: true }}
        loop
        className="w-full h-[400px] md:h-[560px]"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <Link href={banner.link_url || '#'} className="block w-full h-full">
              <div className="relative w-full h-full">
                <img
                  src={banner.image_url}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
                {/* Premium gradient overlay using brand colors */}
                <div className="absolute inset-0 gradient-hero-overlay" />
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 text-white">
                  {/* Accent line above title */}
                  <div className="w-10 h-1 bg-[var(--color-accent)] rounded-full mb-3" />
                  <h2 className="text-2xl md:text-5xl font-extrabold mb-2 drop-shadow-2xl tracking-tight">
                    {banner.title}
                  </h2>
                  {banner.subtitle && (
                    <p className="text-sm md:text-xl font-light opacity-90 tracking-wide drop-shadow-md">
                      {banner.subtitle}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
