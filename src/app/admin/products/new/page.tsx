'use client';

import React from 'react';
import ProductForm from '@/components/admin/ProductForm';

export default function NewProductPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-[var(--color-text)]">添加新商品</h1>
      <ProductForm />
    </div>
  );
}
