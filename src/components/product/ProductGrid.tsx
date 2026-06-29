import React from 'react';
import ProductCard from './ProductCard';
import ScrollReveal from '@/components/ui/ScrollReveal';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  original_price: number | null;
  images: string;
  sales_count: number;
  is_new: number;
  is_featured: number;
  is_recommended: number;
  stock: number;
}

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-[var(--color-text-light)]">No products found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
      {products.map((product, i) => (
        <ScrollReveal key={product.id} delay={i * 0.03}>
          <ProductCard product={product} />
        </ScrollReveal>
      ))}
    </div>
  );
}
