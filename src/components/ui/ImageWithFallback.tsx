'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';

/**
 * 统一图片组件：next/image 优化（自动 WebP / 响应式尺寸） + 加载占位 + 失败兜底。
 *
 * - 只对白名单里的远程图走优化；其它域名或兜底图走 unoptimized，避免 next/image 直接报错
 * - 需要父容器有确定尺寸（组件内部用 fill 铺满 wrapper）
 */
const OPTIMIZABLE_HOSTS = [
  'images.unsplash.com',
  'picsum.photos',
  'fastly.picsum.photos',
  'loremflickr.com',
];

function canOptimize(src: string) {
  if (!src || !src.startsWith('http')) return false;
  return OPTIMIZABLE_HOSTS.some((h) => src.includes(`//${h}/`));
}

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  wrapperClassName?: string;
  sizes?: string;
  priority?: boolean;
}

export default function ImageWithFallback({
  src,
  alt,
  fallbackSrc = '/images/placeholder.svg',
  className,
  wrapperClassName,
  sizes = '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw',
  priority = false,
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const finalSrc = hasError ? fallbackSrc : imgSrc;
  const optimize = !hasError && canOptimize(finalSrc);

  return (
    <div className={clsx('relative overflow-hidden bg-gray-100', wrapperClassName)}>
      {isLoading && <div className="absolute inset-0 animate-pulse bg-gray-200" />}
      <Image
        src={finalSrc}
        alt={alt}
        fill
        sizes={optimize ? sizes : undefined}
        unoptimized={!optimize}
        priority={priority}
        className={clsx(
          'object-cover transition-all duration-300',
          isLoading ? 'opacity-0 scale-105' : 'opacity-100 scale-100',
          className
        )}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
      />
    </div>
  );
}
