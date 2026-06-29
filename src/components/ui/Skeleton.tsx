import clsx from 'clsx';

interface SkeletonProps {
  variant?: 'text' | 'image' | 'card' | 'circle' | 'rect';
  width?: string;
  height?: string;
  className?: string;
}

export default function Skeleton({ variant = 'text', width, height, className }: SkeletonProps) {
  // Premium shimmer: gradient sweep instead of basic pulse
  const base = 'bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 bg-[length:200%_100%] animate-[shimmer_2s_ease-in-out_infinite] rounded';

  if (variant === 'circle') {
    return <div className={clsx(base, 'rounded-full', className)} style={{ width: width || '40px', height: height || '40px' }} />;
  }

  if (variant === 'image') {
    return <div className={clsx(base, 'aspect-square', className)} style={{ width }} />;
  }

  if (variant === 'card') {
    return (
      <div className={clsx('bg-white rounded-2xl overflow-hidden shadow-sm', className)}>
        <div className={clsx(base, 'aspect-square w-full rounded-none')} />
        <div className="p-4 space-y-2">
          <div className={clsx(base, 'h-4 w-3/4')} />
          <div className={clsx(base, 'h-4 w-1/2')} />
          <div className={clsx(base, 'h-6 w-1/3 mt-3')} />
        </div>
      </div>
    );
  }

  if (variant === 'rect') {
    return <div className={clsx(base, className)} style={{ width, height }} />;
  }

  // text
  return <div className={clsx(base, 'h-4', className)} style={{ width: width || '100%' }} />;
}

export function ProductCardSkeleton() {
  return <Skeleton variant="card" />;
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
