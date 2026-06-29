import clsx from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'new' | 'hot' | 'sale' | 'discount' | 'bestseller' | 'default';
  size?: 'sm' | 'md';
  className?: string;
}

const variantClasses: Record<string, string> = {
  new: 'bg-green-500 text-white shadow-sm shadow-green-500/20',
  hot: 'bg-[var(--color-danger)] text-white shadow-sm shadow-red-500/20',
  sale: 'bg-[var(--color-accent)] text-white shadow-sm shadow-orange-500/20',
  discount: 'bg-[var(--color-accent)] text-white shadow-sm shadow-orange-500/20',
  bestseller: 'bg-[var(--color-primary)] text-white shadow-sm shadow-[var(--color-primary)]/20',
  default: 'bg-gray-100 text-[var(--color-text-light)]',
};

export default function Badge({ children, variant = 'default', size = 'sm', className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center font-semibold tracking-wide rounded-full',
        'ring-1 ring-inset ring-white/20',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
