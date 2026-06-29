import React from 'react';
import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export default function Input({ label, error, icon, className, id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-light)]">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={clsx(
            'w-full px-4 py-3 text-sm border border-[var(--color-border)] rounded-xl bg-white',
            'text-[var(--color-text)] placeholder:text-[var(--color-text-lighter)]',
            'hover:border-[var(--color-text-lighter)]',
            'focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30 focus:border-[var(--color-accent)]',
            'focus:shadow-[inset_0_1px_3px_rgba(0,0,0,0.04)]',
            'transition-all duration-[var(--duration-normal)]',
            icon && 'pl-10',
            error && 'border-[var(--color-danger)] focus:ring-[var(--color-danger)]/30 focus:border-[var(--color-danger)]',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-[var(--color-danger)]">{error}</p>}
    </div>
  );
}

export function Select({
  label,
  error,
  options,
  className,
  id,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={clsx(
          'w-full px-4 py-3 text-sm border border-[var(--color-border)] rounded-xl bg-white',
          'hover:border-[var(--color-text-lighter)]',
          'focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30 focus:border-[var(--color-accent)]',
          'transition-all duration-[var(--duration-normal)]',
          error && 'border-[var(--color-danger)]',
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="mt-1.5 text-xs text-[var(--color-danger)]">{error}</p>}
    </div>
  );
}

export function Textarea({
  label,
  error,
  className,
  id,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; error?: string }) {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={textareaId} className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={clsx(
          'w-full px-4 py-3 text-sm border border-[var(--color-border)] rounded-xl bg-white',
          'hover:border-[var(--color-text-lighter)]',
          'focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30 focus:border-[var(--color-accent)]',
          'transition-all duration-[var(--duration-normal)] resize-y min-h-[100px]',
          error && 'border-[var(--color-danger)]',
          className
        )}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-[var(--color-danger)]">{error}</p>}
    </div>
  );
}
