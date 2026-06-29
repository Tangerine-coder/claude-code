import { ProductGridSkeleton } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header skeleton */}
      <div className="h-16 bg-white border-b border-[var(--color-border)] animate-pulse" />

      {/* Hero skeleton */}
      <div className="h-[300px] md:h-[420px] bg-gray-200 animate-pulse" />

      {/* Content skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-10 space-y-10">
        {/* Section title skeleton */}
        <div className="space-y-3">
          <div className="h-8 bg-gray-200 rounded w-64 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-96 animate-pulse" />
        </div>

        {/* Product grid skeleton */}
        <ProductGridSkeleton count={8} />

        {/* Another section */}
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse mt-8" />
        <ProductGridSkeleton count={4} />
      </div>
    </div>
  );
}
