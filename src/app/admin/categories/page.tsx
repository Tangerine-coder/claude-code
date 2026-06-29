'use client';

import { useState, useEffect, useCallback } from 'react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Badge from '@/components/ui/Badge';
import Input, { Select, Textarea } from '@/components/ui/Input';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';

interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  description: string;
  image: string;
  sort_order: number;
  is_active: number;
  children?: Category[];
}

function flattenTree(tree: Category[], level = 0): (Category & { _level: number })[] {
  const result: (Category & { _level: number })[] = [];
  for (const cat of tree) {
    result.push({ ...cat, _level: level });
    if (cat.children && cat.children.length > 0) {
      result.push(...flattenTree(cat.children, level + 1));
    }
  }
  return result;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [flattened, setFlattened] = useState<(Category & { _level: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formParentId, setFormParentId] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formSortOrder, setFormSortOrder] = useState('0');

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/categories?all=1');
      const json = await res.json();
      if (json.success) {
        setCategories(json.data);
        setFlattened(flattenTree(json.data));
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const openAddModal = () => {
    setEditingCategory(null);
    setFormName('');
    setFormParentId('');
    setFormDescription('');
    setFormImage('');
    setFormSortOrder('0');
    setModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setFormName(cat.name);
    setFormParentId(cat.parent_id || '');
    setFormDescription(cat.description || '');
    setFormImage(cat.image || '');
    setFormSortOrder(String(cat.sort_order || 0));
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = {
        name: formName,
        parent_id: formParentId || null,
        description: formDescription,
        image: formImage,
        sort_order: parseInt(formSortOrder) || 0,
      };

      const url = editingCategory
        ? `/api/categories/${editingCategory.id}`
        : '/api/categories';
      const method = editingCategory ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (json.success) {
        setModalOpen(false);
        fetchCategories();
      } else {
        alert(json.message || '保存分类失败');
      }
    } catch (err) {
      console.error('Error saving category:', err);
      alert('保存分类失败');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (cat: Category) => {
    try {
      const res = await fetch(`/api/categories/${cat.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: cat.is_active ? 0 : 1 }),
      });
      const json = await res.json();
      if (json.success) {
        fetchCategories();
      }
    } catch (err) {
      console.error('Error toggling category status:', err);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/categories/${deleteTarget.id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setDeleteTarget(null);
        fetchCategories();
      } else {
        alert(json.message || '删除分类失败');
      }
    } catch (err) {
      console.error('Error deleting category:', err);
      alert('删除分类失败');
    } finally {
      setDeleting(false);
    }
  };

  // Build options for parent select
  const parentOptions = [
    { value: '', label: '无（顶级分类）' },
    ...flattened
      .filter((c) => !editingCategory || c.id !== editingCategory.id)
      .map((c) => ({
        value: c.id,
        label: `${'  '.repeat(c._level)}${c._level > 0 ? '└ ' : ''}${c.name}`,
      })),
  ];

  if (loading) {
    return (
      <div className="space-y-4 p-6">
        <div className="flex items-center justify-between">
          <Skeleton variant="rect" width="200px" height="36px" />
          <Skeleton variant="rect" width="120px" height="36px" />
        </div>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 space-y-3">
            {Array.from({ length: 6 }, (_, i) => (
              <Skeleton key={i} variant="rect" height="48px" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">分类管理</h1>
        <Button onClick={openAddModal}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          添加分类
        </Button>
      </div>

      {flattened.length === 0 ? (
        <EmptyState
          title="暂无分类"
          description="创建您的第一个分类来组织商品。"
          actionLabel="添加分类"
          onAction={openAddModal}
        />
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left text-xs font-semibold text-[var(--color-text-light)] uppercase tracking-wider px-4 py-3">
                    分类名称
                  </th>
                  <th className="text-left text-xs font-semibold text-[var(--color-text-light)] uppercase tracking-wider px-4 py-3">
                    别名
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
                {flattened.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3" style={{ paddingLeft: `${16 + cat._level * 28}px` }}>
                      <div className="flex items-center gap-2">
                        {cat._level > 0 && <span className="text-[var(--color-text-lighter)] select-none">&#x2514;</span>}
                        <span className="font-medium text-sm">{cat.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--color-text-light)]">{cat.slug}</td>
                    <td className="px-4 py-3 text-sm">{cat.sort_order}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleStatus(cat)}
                        className="cursor-pointer"
                        title="Click to toggle status"
                      >
                        <Badge variant={cat.is_active ? 'new' : 'default'}>
                          {cat.is_active ? '启用' : '禁用'}
                        </Badge>
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 justify-end">
                        <Button size="sm" variant="ghost" onClick={() => openEditModal(cat)}>
                          编辑
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => setDeleteTarget(cat)}>
                          删除
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCategory ? '编辑分类' : '添加分类'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="分类名称"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            required
            placeholder="请输入分类名称"
          />
          <Select
            label="父级分类"
            value={formParentId}
            onChange={(e) => setFormParentId(e.target.value)}
            options={parentOptions}
          />
          <Textarea
            label="描述"
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
            placeholder="可选的描述信息"
          />
          <Input
            label="图标URL"
            value={formImage}
            onChange={(e) => setFormImage(e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
          <Input
            label="排序"
            type="number"
            value={formSortOrder}
            onChange={(e) => setFormSortOrder(e.target.value)}
            placeholder="0"
          />
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="ghost" type="button" onClick={() => setModalOpen(false)}>
              取消
            </Button>
            <Button type="submit" loading={saving}>
              {editingCategory ? '更新' : '创建'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="删除分类"
        message={
          deleteTarget
            ? `确定要删除分类"${deleteTarget.name}"吗？子分类将被移至父级分类。`
            : ''
        }
        confirmLabel="删除"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}
