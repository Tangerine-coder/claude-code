'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import BorderGlow from '@/components/ui/BorderGlow';
import { FiMail, FiLock } from 'react-icons/fi';

function LoginPageContent() {
  const { user, login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const redirectTo = searchParams?.get('redirect') || '/';
  const justRegistered = searchParams?.get('registered') === 'true';

  React.useEffect(() => {
    if (user) router.push('/');
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('请填写所有字段'); return; }
    setLoading(true);
    try {
      await login(email, password);
      router.push(redirectTo);
    } catch (err: any) {
      setError(err.message || '登录失败，请检查邮箱和密码');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-primary relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-80 h-80 rounded-full border border-white/30" />
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full border border-white/20" />
        </div>
        <div className="relative z-10 text-center text-white px-8">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-bold text-3xl">海</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-3">海南等下雪</h1>
          <p className="text-lg font-light opacity-80">Premium Shopping Experience</p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 bg-[var(--color-bg)]">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-6">
            <div className="w-14 h-14 bg-[var(--color-primary)] rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-lg">
              <span className="text-white font-bold text-2xl">海</span>
            </div>
            <h2 className="text-xl font-bold text-[var(--color-text)]">海南等下雪</h2>
          </div>

          <BorderGlow
            backgroundColor="rgba(255,255,255,0.95)"
            borderRadius={24}
            glowColor="18 100 60"
            colors={['#0A2647', '#FF6B35', '#144272']}
            edgeSensitivity={25}
            glowIntensity={2}
          >
            <div className="p-8 border-t-4 border-t-[var(--color-accent)]">
              <div className="text-center mb-7">
                <h2 className="text-2xl font-bold text-[var(--color-text)]">欢迎回来</h2>
                <p className="text-sm text-[var(--color-text-light)] mt-1">登录您的账号</p>
              </div>

              {justRegistered && (
                <div className="mb-6 p-3.5 bg-green-50/80 backdrop-blur-sm border border-green-200/50 rounded-xl text-sm text-green-600 flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  注册成功！请登录您的账号。
                </div>
              )}
              {error && (
                <div className="mb-6 p-3.5 bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-xl text-sm text-red-600 flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <Input label="账号/邮箱" type="text" placeholder="请输入账号或邮箱" value={email}
                  onChange={(e) => setEmail(e.target.value)} icon={<FiMail />} required />
                <div>
                  <Input label="密码" type="password" placeholder="请输入密码" value={password}
                    onChange={(e) => setPassword(e.target.value)} icon={<FiLock />} required />
                  <div className="text-right mt-1.5">
                    <Link href="/forgot-password"
                      className="text-xs text-[var(--color-accent)] font-medium
                                 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent)]
                                 bg-[length:0%_1px] bg-no-repeat bg-bottom hover:bg-[length:100%_1px]
                                 transition-all duration-300 pb-0.5">
                      忘记密码？
                    </Link>
                  </div>
                </div>
                <Button type="submit" variant="primary" size="lg" loading={loading}
                  className="w-full py-4 shadow-[var(--shadow-accent)] hover:shadow-xl">
                  登录
                </Button>
              </form>

              <p className="text-center text-sm text-[var(--color-text-light)] mt-6">
                还没有账号？{' '}
                <Link href="/register"
                  className="text-[var(--color-accent)] font-semibold
                             bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent)]
                             bg-[length:0%_1px] bg-no-repeat bg-bottom hover:bg-[length:100%_1px]
                             transition-all duration-300 pb-0.5">
                  立即注册
                </Link>
              </p>
            </div>
          </BorderGlow>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full" /></div>}>
      <LoginPageContent />
    </Suspense>
  );
}
