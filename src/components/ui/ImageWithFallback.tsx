'use client';

import React, { useState } from 'react';
import clsx from 'clsx';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  wrapperClassName?: string;
}

export default function ImageWithFallback({
  src,
  alt,
  fallbackSrc = '/images/placeholder.svg',
  className,
  wrapperClassName,
  ...props
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={clsx('relative overflow-hidden bg-gray-100', wrapperClassName)}>
      {isLoading && (
        <div className="absolute inset-0 animate-pulse bg-gray-200" />
      )}
      <img
        src={hasError ? fallbackSrc : imgSrc}
        alt={alt}
        loading="lazy"
        className={clsx(
          'transition-all duration-300',
          isLoading ? 'opacity-0 scale-105' : 'opacity-100 scale-100',
          className
        )}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
        {...props}
      />
    </div>
  );
}
