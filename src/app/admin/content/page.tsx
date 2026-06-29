'use client';

import { useState, useEffect, useCallback } from 'react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Badge from '@/components/ui/Badge';
import Input, { Textarea } from '@/components/ui/Input';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
  link_url: string;
  sort_order: number;
  is_active: number;
}

interface Announcement {
  id: string;
  content: string;
  link_url: string;
  is_active: number;
  created_at: string;
}

export default function AdminContentPage() {
  // ==================== Banners State ====================
  const [banners, setBanners] = useState<Banner[]>([]);
  const [bannersLoading, setBannersLoading] = useState(true);
  const [bannerSaving, setBannerSaving] = useState(false);

  const [bannerModalOpen, setBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [bannerForm, setBannerForm] = useState({
    title: '',
    subtitle: '',
    image_url: '',
    link_url: '',
    sort_order: '0',
  });

  const [bannerDeleteTarget, setBannerDeleteTarget] = useState<Banner | null>(null);
  const [bannerDeleting, setBannerDeleting] = useState(false);

  // ==================== Announcements State ====================
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [announcementsLoading, setAnnouncementsLoading] = useState(true);
  const [announcementSaving, setAnnouncementSaving] = useState(false);

  const [announcementModalOpen, setAnnouncementModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [announcementForm, setAnnouncementForm] = useState({
    content: '',
    link_url: '',
  });

  const [announcementDeleteTarget, setAnnouncementDeleteTarget] = useState<Announcement | null>(null);
  const [announcementDeleting, setAnnouncementDeleting] = useState(false);

  // ==================== Banners ====================
  const fetchBanners = useCallback(async () => {
    setBannersLoading(true);
    try {
      const res = await fetch('/api/banners');
      const json = await res.json();
      if (json.success) {
        setBanners(json.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch banners:', err);
    } finally {
      setBannersLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const openBannerAdd = () => {
    setEditingBanner(null);
    setBannerForm({ title: '', subtitle: '', image_url: '', link_url: '', sort_order: '0' });
    setBannerModalOpen(true);
  };

  const openBannerEdit = (b: Banner) => {
    setEditingBanner(b);
    setBannerForm({
      title: b.title,
      subtitle: b.subtitle || '',
      image_url: b.image_url,
      link_url: b.link_url || '',
      sort_order: String(b.sort_order || 0),
    });
    setBannerModalOpen(true);
  };

  const handleBannerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBannerSaving(true);
    try {
      const body = {
        title: bannerForm.title,
        subtitle: bannerForm.subtitle,
        image_url: bannerForm.image_url,
        link_url: bannerForm.link_url,
        sort_order: parseInt(bannerForm.sort_order) || 0,
      };

      const url = editingBanner ? `/api/banners/${editingBanner.id}` : '/api/banners';
      const method = editingBanner ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (json.success) {
        setBannerModalOpen(false);
        fetchBanners();
      } else {
        alert(json.message || '保存轮播图失败');
      }
    } catch (err) {
      console.error('Error saving banner:', err);
      alert('保存轮播图失败');
    } finally {
      setBannerSaving(false);
    }
  };

  const handleBannerToggle = async (b: Banner) => {
    try {
      const res = await fetch(`/api/banners/${b.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: b.is_active ? 0 : 1 }),
      });
      const json = await res.json();
      if (json.success) {
        fetchBanners();
      }
    } catch (err) {
      console.error('Error toggling banner:', err);
    }
  };

  const handleBannerDelete = async () => {
    if (!bannerDeleteTarget) return;
    setBannerDeleting(true);
    try {
      const res = await fetch(`/api/banners/${bannerDeleteTarget.id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setBannerDeleteTarget(null);
        fetchBanners();
      } else {
        alert(json.message || '删除轮播图失败');
      }
    } catch (err) {
      console.error('Error deleting banner:', err);
      alert('删除轮播图失败');
    } finally {
      setBannerDeleting(false);
    }
  };

  // ==================== Announcements ====================
  const fetchAnnouncements = useCallback(async () => {
    setAnnouncementsLoading(true);
    try {
      const res = await fetch('/api/announcements');
      const json = await res.json();
      if (json.success) {
        setAnnouncements(json.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch announcements:', err);
    } finally {
      setAnnouncementsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const openAnnouncementAdd = () => {
    setEditingAnnouncement(null);
    setAnnouncementForm({ content: '', link_url: '' });
    setAnnouncementModalOpen(true);
  };

  const openAnnouncementEdit = (a: Announcement) => {
    setEditingAnnouncement(a);
    setAnnouncementForm({ content: a.content, link_url: a.link_url || '' });
    setAnnouncementModalOpen(true);
  };

  const handleAnnouncementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAnnouncementSaving(true);
    try {
      const body = {
        content: announcementForm.content,
        link_url: announcementForm.link_url,
      };

      const url = editingAnnouncement
        ? `/api/announcements/${editingAnnouncement.id}`
        : '/api/announcements';
      const method = editingAnnouncement ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (json.success) {
        setAnnouncementModalOpen(false);
        fetchAnnouncements();
      } else {
        alert(json.message || '保存公告失败');
      }
    } catch (err) {
      console.error('Error saving announcement:', err);
      alert('保存公告失败');
    } finally {
      setAnnouncementSaving(false);
    }
  };

  const handleAnnouncementToggle = async (a: Announcement) => {
    try {
      const res = await fetch(`/api/announcements/${a.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: a.is_active ? 0 : 1 }),
      });
      const json = await res.json();
      if (json.success) {
        fetchAnnouncements();
      }
    } catch (err) {
      console.error('Error toggling announcement:', err);
    }
  };

  const handleAnnouncementDelete = async () => {
    if (!announcementDeleteTarget) return;
    setAnnouncementDeleting(true);
    try {
      const res = await fetch(`/api/announcements/${announcementDeleteTarget.id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setAnnouncementDeleteTarget(null);
        fetchAnnouncements();
      } else {
        alert(json.message || '删除公告失败');
      }
    } catch (err) {
      console.error('Error deleting announcement:', err);
      alert('删除公告失败');
    } finally {
      setAnnouncementDeleting(false);
    }
  };

  return (
    <div className="p-6 space-y-10">
      {/* ==================== Banners Section ==================== */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[var(--color-text)]">轮播图管理</h2>
          <Button size="sm" onClick={openBannerAdd}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            添加轮播图
          </Button>
        </div>

        {bannersLoading ? (
          <div className="glass-surface rounded-xl shadow-sm p-6 space-y-3">
            {Array.from({ length: 3 }, (_, i) => (
              <Skeleton key={i} variant="rect" height="64px" />
            ))}
          </div>
        ) : banners.length === 0 ? (
          <EmptyState
            title="暂无轮播图"
            description="添加轮播图以在首页展示。"
            actionLabel="添加轮播图"
            onAction={openBannerAdd}
          />
        ) : (
          <div className="glass-surface rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left text-xs font-semibold text-[var(--color-text-light)] uppercase tracking-wider px-4 py-3">
                    轮播图
                  </th>
                  <th className="text-left text-xs font-semibold text-[var(--color-text-light)] uppercase tracking-wider px-4 py-3">
                    排序
                  </th>
                  <th className="text-left text-xs font-semibold text-[var(--color-text-light)] uppercase tracking-wider px-4 py-3">
                    状态
                  </th>
                  <th className="text-right text-xs font-semibold text-[var(--color-text-light)] uppercase tracking-wider px-4 py-3">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {banners.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {b.image_url && (
                          <img
                            src={b.image_url}
                            alt={b.title}
                            className="w-16 h-10 rounded object-cover bg-gray-100"
                          />
                        )}
                        <div>
                          <p className="font-medium text-sm">{b.title}</p>
                          {b.subtitle && (
                            <p className="text-xs text-[var(--color-text-light)]">{b.subtitle}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{b.sort_order}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleBannerToggle(b)} className="cursor-pointer" title="Click to toggle">
                        <Badge variant={b.is_active ? 'new' : 'default'}>
                          {b.is_active ? '启用' : '禁用'}
                        </Badge>
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 justify-end">
                        <Button size="sm" variant="ghost" onClick={() => openBannerEdit(b)}>
                          编辑
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => setBannerDeleteTarget(b)}>
                          删除
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Banner Add/Edit Modal */}
        <Modal
          isOpen={bannerModalOpen}
          onClose={() => setBannerModalOpen(false)}
          title={editingBanner ? '编辑轮播图' : '添加轮播图'}
          size="lg"
        >
          <form onSubmit={handleBannerSubmit} className="space-y-4">
            <Input
              label="标题"
              value={bannerForm.title}
              onChange={(e) => setBannerForm((f) => ({ ...f, title: e.target.value }))}
              required
              placeholder="轮播图标题"
            />
            <Input
              label="副标题"
              value={bannerForm.subtitle}
              onChange={(e) => setBannerForm((f) => ({ ...f, subtitle: e.target.value }))}
              placeholder="可选副标题"
            />
            <Input
              label="图片URL"
              value={bannerForm.image_url}
              onChange={(e) => setBannerForm((f) => ({ ...f, image_url: e.target.value }))}
              required
              placeholder="https://example.com/banner.jpg"
            />
            <Input
              label="Link URL"
              value={bannerForm.link_url}
              onChange={(e) => setBannerForm((f) => ({ ...f, link_url: e.target.value }))}
              placeholder="/products or https://..."
            />
            <Input
              label="排序"
              type="number"
              value={bannerForm.sort_order}
              onChange={(e) => setBannerForm((f) => ({ ...f, sort_order: e.target.value }))}
              placeholder="0"
            />
            <div className="flex gap-3 justify-end pt-2">
              <Button variant="ghost" type="button" onClick={() => setBannerModalOpen(false)}>
                取消
              </Button>
              <Button type="submit" loading={bannerSaving}>
                {editingBanner ? '更新' : '创建'}
              </Button>
            </div>
          </form>
        </Modal>

        {/* Banner Delete Confirm */}
        <ConfirmDialog
          isOpen={!!bannerDeleteTarget}
          onClose={() => setBannerDeleteTarget(null)}
          onConfirm={handleBannerDelete}
          title="删除轮播图"
          message={bannerDeleteTarget ? `确定要删除轮播图"${bannerDeleteTarget.title}"吗？` : ''}
          confirmLabel="删除"
          variant="danger"
          loading={bannerDeleting}
        />
      </section>

      {/* ==================== Announcements Section ==================== */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[var(--color-text)]">公告管理</h2>
          <Button size="sm" onClick={openAnnouncementAdd}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            添加公告
          </Button>
        </div>

        {announcementsLoading ? (
          <div className="glass-surface rounded-xl shadow-sm p-6 space-y-3">
            {Array.from({ length: 3 }, (_, i) => (
              <Skeleton key={i} variant="rect" height="56px" />
            ))}
          </div>
        ) : announcements.length === 0 ? (
          <EmptyState
            title="暂无公告"
            description="添加公告以在网站顶部展示。"
            actionLabel="添加公告"
            onAction={openAnnouncementAdd}
          />
        ) : (
          <div className="glass-surface rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left text-xs font-semibold text-[var(--color-text-light)] uppercase tracking-wider px-4 py-3">
                    公告内容
                  </th>
                  <th className="text-left text-xs font-semibold text-[var(--color-text-light)] uppercase tracking-wider px-4 py-3">
                    链接
                  </th>
                  <th className="text-left text-xs font-semibold text-[var(--color-text-light)] uppercase tracking-wider px-4 py-3">
                    状态
                  </th>
                  <th className="text-right text-xs font-semibold text-[var(--color-text-light)] uppercase tracking-wider px-4 py-3">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {announcements.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm max-w-xs truncate">{a.content}</td>
                    <td className="px-4 py-3 text-sm text-[var(--color-text-light)] max-w-[200px] truncate">
                      {a.link_url || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleAnnouncementToggle(a)} className="cursor-pointer" title="Click to toggle">
                        <Badge variant={a.is_active ? 'new' : 'default'}>
                          {a.is_active ? '启用' : '禁用'}
                        </Badge>
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 justify-end">
                        <Button size="sm" variant="ghost" onClick={() => openAnnouncementEdit(a)}>
                          编辑
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => setAnnouncementDeleteTarget(a)}>
                          删除
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Announcement Add/Edit Modal */}
        <Modal
          isOpen={announcementModalOpen}
          onClose={() => setAnnouncementModalOpen(false)}
          title={editingAnnouncement ? '编辑公告' : '添加公告'}
          size="lg"
        >
          <form onSubmit={handleAnnouncementSubmit} className="space-y-4">
            <Textarea
              label="公告内容"
              value={announcementForm.content}
              onChange={(e) => setAnnouncementForm((f) => ({ ...f, content: e.target.value }))}
              required
              placeholder="公告文本（支持HTML）"
            />
            <Input
              label="链接URL"
              value={announcementForm.link_url}
              onChange={(e) => setAnnouncementForm((f) => ({ ...f, link_url: e.target.value }))}
              placeholder="可选的链接URL"
            />
            <div className="flex gap-3 justify-end pt-2">
              <Button variant="ghost" type="button" onClick={() => setAnnouncementModalOpen(false)}>
                取消
              </Button>
              <Button type="submit" loading={announcementSaving}>
                {editingAnnouncement ? '更新' : '创建'}
              </Button>
            </div>
          </form>
        </Modal>

        {/* Announcement Delete Confirm */}
        <ConfirmDialog
          isOpen={!!announcementDeleteTarget}
          onClose={() => setAnnouncementDeleteTarget(null)}
          onConfirm={handleAnnouncementDelete}
          title="删除公告"
          message="确定要删除该公告吗？"
          confirmLabel="删除"
          variant="danger"
          loading={announcementDeleting}
        />
      </section>
    </div>
  );
}
