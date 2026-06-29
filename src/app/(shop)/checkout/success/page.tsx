'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Button from '@/components/ui/Button';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {/* Success Checkmark */}
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
        <svg
          className="w-10 h-10 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <h1 className="text-2xl font-bold text-[var(--color-text)] mb-2">
        订单提交成功！
      </h1>

      <p className="text-sm text-[var(--color-text-light)] mb-6 max-w-md">
        感谢您的购买，我们会尽快为您发货
      </p>

      {orderId && (
        <div className="bg-gray-50 rounded-xl px-6 py-3 mb-8 inline-block">
          <span className="text-xs text-[var(--color-text-light)] mr-2">订单编号：</span>
          <span className="text-sm font-mono font-bold text-[var(--color-text)]">{orderId}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        {orderId && (
          <Link href={`/user/orders/${orderId}`}>
            <Button variant="primary" size="lg">
              查看订单
            </Button>
          </Link>
        )}
        <Link href="/">
          <Button variant="outline" size="lg">
            继续购物
          </Button>
        </Link>
      </div>
    </div>
  );
}

function SuccessFallback() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6 animate-pulse">
        <svg
          className="w-10 h-10 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-2" />
      <div className="h-4 w-48 bg-gray-100 rounded animate-pulse mb-6" />
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Suspense fallback={<SuccessFallback />}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
