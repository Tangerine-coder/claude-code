'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';

interface User {
  id: string;
  username: string;
  email: string;
  phone: string;
  avatar: string;
  role: string;
  status: string;
  last_login: string | null;
  created_at: string;
  order_count: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState<User | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      const json = await res.json();
      if (json.success) {
        setUsers(json.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleToggleStatus = (user: User) => {
    setConfirmTarget(user);
    setConfirmOpen(true);
  };

  const confirmToggle = async () => {
    if (!confirmTarget) return;
    setToggling(confirmTarget.id);
    try {
      const newStatus = confirmTarget.status === 'active' ? 'disabled' : 'active';
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: confirmTarget.id, status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === confirmTarget.id ? { ...u, status: newStatus } : u))
        );
        setConfirmOpen(false);
        setConfirmTarget(null);
      } else {
        alert(json.message || '更新用户失败');
      }
    } catch (err) {
      console.error('Error updating user:', err);
      alert('更新用户失败');
    } finally {
      setToggling(null);
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton variant="rect" width="200px" height="32px" />
        <div className="glass-surface rounded-xl shadow-sm p-6 space-y-3">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} variant="rect" height="52px" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">用户管理</h1>
        <p className="text-sm text-[var(--color-text-light)]">{users.length} 位用户</p>
      </div>

      {users.length === 0 ? (
        <EmptyState title="暂无用户" description="用户账户将在这里显示。" />
      ) : (
        <div className="glass-surface rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left text-xs font-semibold text-[var(--color-text-light)] uppercase tracking-wider px-4 py-3">
                    用户名
                  </th>
                  <th className="text-left text-xs font-semibold text-[var(--color-text-light)] uppercase tracking-wider px-4 py-3">
                    邮箱
                  </th>
                  <th className="text-left text-xs font-semibold text-[var(--color-text-light)] uppercase tracking-wider px-4 py-3">
                    手机号
                  </th>
                  <th className="text-left text-xs font-semibold text-[var(--color-text-light)] uppercase tracking-wider px-4 py-3">
                    角色
                  </th>
                  <th className="text-left text-xs font-semibold text-[var(--color-text-light)] uppercase tracking-wider px-4 py-3">
                    状态
                  </th>
                  <th className="text-center text-xs font-semibold text-[var(--color-text-light)] uppercase tracking-wider px-4 py-3">
                    订单
                  </th>
                  <th className="text-left text-xs font-semibold text-[var(--color-text-light)] uppercase tracking-wider px-4 py-3">
                    注册时间
                  </th>
                  <th className="text-left text-xs font-semibold text-[var(--color-text-light)] uppercase tracking-wider px-4 py-3">
                    最后登录
                  </th>
                  <th className="text-right text-xs font-semibold text-[var(--color-text-light)] uppercase tracking-wider px-4 py-3">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.username}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-xs font-bold">
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="font-medium text-sm">{user.username}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--color-text-light)]">{user.email}</td>
                    <td className="px-4 py-3 text-sm text-[var(--color-text-light)]">{user.phone || '—'}</td>
                    <td className="px-4 py-3">
                      <Badge variant={user.role === 'admin' ? 'hot' : 'new'}>
                        {user.role === 'admin' ? '管理员' : '普通用户'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={user.status === 'active' ? 'new' : 'default'}>
                        {user.status === 'active' ? '启用' : '禁用'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Link
                        href={`/admin/orders?user_id=${user.id}`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] hover:underline transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                        查看订单
                        {user.order_count > 0 && (
                          <span className="text-xs bg-[var(--color-primary)] text-white rounded-full px-1.5 py-0.5 ml-0.5">
                            {user.order_count}
                          </span>
                        )}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--color-text-light)]">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--color-text-light)]">
                      {user.last_login
                        ? new Date(user.last_login).toLocaleDateString()
                        : '从未登录'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        size="sm"
                        variant={user.status === 'active' ? 'danger' : 'primary'}
                        onClick={() => handleToggleStatus(user)}
                        loading={toggling === user.id}
                      >
                        {user.status === 'active' ? '禁用' : '启用'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => { setConfirmOpen(false); setConfirmTarget(null); }}
        onConfirm={confirmToggle}
        title={confirmTarget ? (confirmTarget.status === 'active' ? '禁用用户' : '启用用户') : ''}
        message={
          confirmTarget
            ? `确定要${confirmTarget.status === 'active' ? '禁用' : '启用'}用户"${confirmTarget.username}"（${confirmTarget.email}）吗？`
            : ''
        }
        confirmLabel={confirmTarget?.status === 'active' ? '禁用' : '启用'}
        variant={confirmTarget?.status === 'active' ? 'danger' : 'primary'}
        loading={!!toggling}
      />
    </div>
  );
}
