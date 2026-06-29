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

  if (banners.length === 0) {
    return (
      <div className="w-full h-[300px] md:h-[450px] bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-3">欢迎来到海南等下雪</h1>
          <p className="text-lg md:text-xl opacity-80">发现优质好物，享受超值价格</p>
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
        className="w-full h-[300px] md:h-[450px]"
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 text-white">
                  <h2 className="text-2xl md:text-4xl font-bold mb-2 drop-shadow-lg">{banner.title}</h2>
                  {banner.subtitle && (
                    <p className="text-sm md:text-lg opacity-90 drop-shadow">{banner.subtitle}</p>
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
