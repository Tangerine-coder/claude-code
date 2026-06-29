'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import BorderGlow from '@/components/ui/BorderGlow';
import { FiUser, FiMail, FiLock } from 'react-icons/fi';

export default function RegisterPage() {
  const { user, register } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (user) router.push('/');
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username || !email || !password || !confirmPassword) { setError('请填写所有字段'); return; }
    if (password.length < 6) { setError('密码至少6位'); return; }
    if (password !== confirmPassword) { setError('两次密码不一致'); return; }
    setLoading(true);
    try {
      await register(username, email, password);
      router.push('/login?registered=true');
    } catch (err: any) {
      setError(err.message || '注册失败');
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
          <h1 className="text-4xl font-extrabold tracking-tight mb-3">加入我们</h1>
          <p className="text-lg font-light opacity-80">创建账号，开启品质购物之旅</p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 bg-[var(--color-bg)]">
        <div className="w-full max-w-md">
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
                <h2 className="text-2xl font-bold text-[var(--color-text)]">创建账号</h2>
                <p className="text-sm text-[var(--color-text-light)] mt-1">立即加入</p>
              </div>

              {error && (
                <div className="mb-6 p-3.5 bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-xl text-sm text-red-600 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <Input label="用户名" type="text" placeholder="请设置用户名" value={username}
                  onChange={(e) => setUsername(e.target.value)} icon={<FiUser />} required />
                <Input label="邮箱" type="email" placeholder="请输入邮箱地址" value={email}
                  onChange={(e) => setEmail(e.target.value)} icon={<FiMail />} required />
                <Input label="密码" type="password" placeholder="至少6位字符" value={password}
                  onChange={(e) => setPassword(e.target.value)} icon={<FiLock />} required />
                <Input label="确认密码" type="password" placeholder="请再次输入密码" value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)} icon={<FiLock />} required />
                <Button type="submit" variant="primary" size="lg" loading={loading}
                  className="w-full py-4 shadow-[var(--shadow-accent)] hover:shadow-xl">
                  注册
                </Button>
              </form>

              <p className="text-center text-sm text-[var(--color-text-light)] mt-6">
                已有账号？{' '}
                <Link href="/login"
                  className="text-[var(--color-accent)] font-semibold
                             bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent)]
                             bg-[length:0%_1px] bg-no-repeat bg-bottom hover:bg-[length:100%_1px]
                             transition-all duration-300 pb-0.5">
                  立即登录
                </Link>
              </p>
            </div>
          </BorderGlow>
        </div>
      </div>
    </div>
  );
}
