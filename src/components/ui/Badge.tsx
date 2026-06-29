import clsx from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'new' | 'hot' | 'sale' | 'discount' | 'bestseller' | 'default';
  size?: 'sm' | 'md';
  className?: string;
}

const variantClasses: Record<string, string> = {
  new: 'bg-green-500 text-white',
  hot: 'bg-[var(--color-danger)] text-white',
  sale: 'bg-[var(--color-accent)] text-white',
  discount: 'bg-[var(--color-accent)] text-white',
  bestseller: 'bg-[var(--color-primary)] text-white',
  default: 'bg-gray-100 text-[var(--color-text-light)]',
};

export default function Badge({ children, variant = 'default', size = 'sm', className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center font-semibold rounded-full',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
