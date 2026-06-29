import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1.5 text-sm text-[var(--color-text-light)] mb-4" aria-label="Breadcrumb">
      <Link href="/" className="hover:text-[var(--color-accent)] transition-colors">Home</Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <svg className="w-3 h-3 text-[var(--color-text-lighter)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          {item.href ? (
            <Link href={item.href} className="hover:text-[var(--color-accent)] transition-colors">{item.label}</Link>
          ) : (
            <span className="text-[var(--color-text)] font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
