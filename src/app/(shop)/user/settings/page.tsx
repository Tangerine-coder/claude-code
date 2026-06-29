'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Skeleton from '@/components/ui/Skeleton';
import { FiUser, FiLock, FiSave } from 'react-icons/fi';

export default function SettingsPage() {
  const { user, refreshUser } = useAuth();
  const { addToast } = useToast();

  const [username, setUsername] = useState(user?.username || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  if (!user) {
    return (
      <div className="space-y-4">
        <Skeleton variant="text" width="200px" />
        <Skeleton variant="rect" height="200px" />
      </div>
    );
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError('');
    setProfileLoading(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });
      const data = await res.json();
      if (data.success) {
        addToast('资料已更新', 'success');
        await refreshUser();
      } else {
        setProfileError(data.message || '更新资料失败');
      }
    } catch {
      setProfileError('更新资料失败');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('请填写所有密码字段');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('新密码至少需要6个字符');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('两次输入的新密码不一致');
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });
      const data = await res.json();
      if (data.success) {
        addToast('密码已修改', 'success');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordError(data.message || '修改密码失败');
      }
    } catch {
      setPasswordError('修改密码失败');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-[var(--color-text)]">账户设置</h1>

      {/* Profile Section */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
        <div className="flex items-center gap-3 mb-6">
          <FiUser className="w-5 h-5 text-[var(--color-accent)]" />
          <h2 className="text-lg font-semibold text-[var(--color-text)]">修改资料</h2>
        </div>
        {profileError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {profileError}
          </div>
        )}
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <Input
            label="用户名"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <div>
            <Input label="邮箱" value={user.email} disabled />
            <p className="text-xs text-[var(--color-text-lighter)] mt-1">邮箱不可修改</p>
          </div>
          <Button type="submit" variant="primary" icon={<FiSave />} loading={profileLoading}>
            保存
          </Button>
        </form>
      </div>

      {/* Password Section */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
        <div className="flex items-center gap-3 mb-6">
          <FiLock className="w-5 h-5 text-[var(--color-accent)]" />
          <h2 className="text-lg font-semibold text-[var(--color-text)]">修改密码</h2>
        </div>
        {passwordError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {passwordError}
          </div>
        )}
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <Input
            label="当前密码"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <Input
            label="新密码"
            type="password"
            placeholder="至少6个字符"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <Input
            label="确认新密码"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="outline" icon={<FiLock />} loading={passwordLoading}>
            修改密码
          </Button>
        </form>
      </div>
    </div>
  );
}
