import Link from 'next/link';
import Button from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export default function EmptyState({ icon, title, description, actionLabel, actionHref, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {icon ? (
        <div className="text-[var(--color-text-lighter)] mb-4">{icon}</div>
      ) : (
        <svg className="w-16 h-16 text-[var(--color-text-lighter)] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      )}
      <h3 className="text-lg font-semibold text-[var(--color-text)] mb-1">{title}</h3>
      {description && <p className="text-sm text-[var(--color-text-light)] mb-6 max-w-md">{description}</p>}
      {actionLabel && (actionHref ? (
        <Link href={actionHref}><Button variant="primary">{actionLabel}</Button></Link>
      ) : onAction ? (
        <Button variant="primary" onClick={onAction}>{actionLabel}</Button>
      ) : null)}
    </div>
  );
}
