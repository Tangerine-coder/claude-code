'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function AdminLoginPage() {
  const { user, isLoading, login, logout } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && user && user.role === 'admin') {
      router.push('/admin');
    }
  }, [user, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('请填写账号和密码');
      return;
    }

    setSubmitting(true);
    try {
      const userData = await login(email, password);
      if (userData.role !== 'admin') {
        await logout();
        setError('该账号不是管理员，无法登录后台');
        return;
      }
      router.push('/admin');
    } catch (err: any) {
      setError(err.message || '登录失败');
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (user && user.role === 'admin') return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-[var(--color-accent)] rounded-xl flex items-center justify-center font-bold text-white text-lg">海</div>
            <span className="text-xl font-bold text-[var(--color-text)]">海南等下雪</span>
          </Link>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">管理员登录</h1>
          <p className="text-sm text-[var(--color-text-light)] mt-1">登录以管理您的商城</p>
        </div>

        <div className="glass-surface rounded-2xl shadow-sm border border-[var(--color-border)] p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                {error}
              </div>
            )}

            <Input
              label="账号"
              type="text"
              placeholder="账号: admin"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
            />

            <Input
              label="密码"
              type="password"
              placeholder="请输入密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
            />

            <Button type="submit" loading={submitting} className="w-full">
              登录
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-[var(--color-text-light)] mt-6">
          <a href="/" className="hover:text-[var(--color-text)] transition-colors">← 返回商城</a>
        </p>
      </div>
    </div>
  );
}

function Link({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  const router = useRouter();
  return (
    <a
      href={href}
      className={className}
      onClick={(e) => { e.preventDefault(); router.push(href); }}
    >
      {children}
    </a>
  );
}
