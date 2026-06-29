'use client';

import clsx from 'clsx';

interface QuantityInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function QuantityInput({ value, onChange, min = 1, max = 999, size = 'md' }: QuantityInputProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  return (
    <div className="inline-flex items-center border border-[var(--color-border)] rounded-lg overflow-hidden">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className={clsx(sizeClasses[size], 'flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed font-bold text-[var(--color-text)]')}
      >
        −
      </button>
      <input
        type="number"
        value={value}
        onChange={(e) => {
          const v = parseInt(e.target.value) || min;
          onChange(Math.max(min, Math.min(max, v)));
        }}
        className={clsx(sizeClasses[size], 'text-center border-x border-[var(--color-border)] outline-none font-semibold text-[var(--color-text)] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none')}
      />
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className={clsx(sizeClasses[size], 'flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed font-bold text-[var(--color-text)]')}
      >
        +
      </button>
    </div>
  );
}
