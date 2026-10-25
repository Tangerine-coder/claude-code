'use client';

import { useState } from 'react';
import { FiLock, FiShield } from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function AdminPasswordPage() {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('请填写所有密码字段');
      return;
    }
    if (newPassword.length < 6) {
      setError('新密码至少需要 6 个字符');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('两次输入的新密码不一致');
      return;
    }
    if (newPassword === currentPassword) {
      setError('新密码不能与当前密码相同');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/user/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        addToast('密码已更新', 'success');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setError(data.message || '修改密码失败');
      }
    } catch {
      setError('修改密码失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl">
      <div className="flex items-center gap-3 mb-1">
        <FiShield className="w-5 h-5 text-[var(--color-accent)]" />
        <h1 className="text-2xl font-bold text-[var(--color-text)]">账户安全</h1>
      </div>
      <p className="text-sm text-[var(--color-text-light)] mb-6">
        当前登录：<span className="font-medium text-[var(--color-text)]">{user?.email || user?.username}</span>
        {' '}· 角色：{user?.role === 'admin' ? '管理员' : '普通用户'}
      </p>

      <form onSubmit={handleSubmit} className="glass-surface rounded-xl border border-[var(--color-border)] p-6 space-y-5">
        <div className="flex items-center gap-2 mb-1">
          <FiLock className="w-4 h-4 text-[var(--color-accent)]" />
          <h2 className="text-lg font-semibold text-[var(--color-text)]">修改密码</h2>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>
        )}

        <Input
          label="当前密码"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="请输入当前密码"
          autoComplete="current-password"
        />
        <Input
          label="新密码"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="至少 6 个字符"
          autoComplete="new-password"
        />
        <Input
          label="确认新密码"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="再次输入新密码"
          autoComplete="new-password"
        />

        <div className="flex items-center gap-3 pt-1">
          <Button type="submit" variant="primary" loading={loading}>
            保存新密码
          </Button>
          <span className="text-xs text-[var(--color-text-light)]">
            修改后当前登录状态仍然有效，其他设备需重新登录
          </span>
        </div>
      </form>
    </div>
  );
}
