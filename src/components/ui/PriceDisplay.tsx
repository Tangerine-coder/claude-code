import clsx from 'clsx';
import { formatPrice } from '@/lib/utils';

interface PriceDisplayProps {
  price: number;
  originalPrice?: number | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function PriceDisplay({ price, originalPrice, size = 'md', className }: PriceDisplayProps) {
  const sizeClasses = {
    sm: { current: 'text-sm', original: 'text-xs' },
    md: { current: 'text-lg', original: 'text-sm' },
    lg: { current: 'text-2xl', original: 'text-base' },
  };

  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercent = hasDiscount ? Math.round((1 - price / originalPrice) * 100) : 0;

  if (price === 0) {
    return (
      <div className={clsx('inline-flex items-baseline gap-2', className)}>
        <span className={clsx('font-bold text-green-600 tracking-tight', sizeClasses[size].current)}>
          免费
        </span>
      </div>
    );
  }

  return (
    <div className={clsx('inline-flex items-baseline gap-2', className)}>
      <span className={clsx('font-bold text-[var(--color-danger)] tracking-tight', sizeClasses[size].current)}>
        {formatPrice(price)}
      </span>
      {hasDiscount && (
        <>
          <span className={clsx('line-through text-[var(--color-text-lighter)]', sizeClasses[size].original)}>
            {formatPrice(originalPrice)}
          </span>
          <span className="text-xs font-semibold text-[var(--color-danger)] bg-red-50 px-1.5 py-0.5 rounded-md shadow-sm">
            -{discountPercent}%
          </span>
        </>
      )}
    </div>
  );
}
