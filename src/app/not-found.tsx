import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-8xl font-extrabold text-[var(--color-primary)] mb-4">404</h1>
      <h2 className="text-2xl font-bold text-[var(--color-text)] mb-2">页面未找到</h2>
      <p className="text-[var(--color-text-light)] mb-8 max-w-md">
        抱歉，您访问的页面不存在或已被移除。
      </p>
      <Link href="/">
        <Button variant="primary" size="lg">
          返回首页
        </Button>
      </Link>
    </div>
  );
}
