'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { formatPrice } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category_id: string | null;
  images: string;
  status: 'active' | 'inactive' | 'draft';
  created_at: string;
  brand: string;
  is_featured: number;
  is_new: number;
}

const statusBadgeVariant: Record<string, 'new' | 'hot' | 'default'> = {
  active: 'new',
  inactive: 'hot',
  draft: 'default',
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; id?: string }>({ open: false });
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products?status=all&limit=100');
      const json = await res.json();
      if (!json.success) throw new Error(json.message || '加载商品失败');
      setProducts(json.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    let list = products;
    if (statusFilter !== 'all') {
      list = list.filter((p) => p.status === statusFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }
    return list;
  }, [products, search, statusFilter]);

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredProducts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredProducts.map((p) => p.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || '删除失败');
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setSelectedIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
    } catch (err: any) {
      alert(err.message);
    }
    setDeleteConfirm({ open: false });
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`确定要删除选中的${selectedIds.size}件商品吗？`)) return;
    setBulkActionLoading(true);
    let count = 0;
    for (const id of selectedIds) {
      try {
        const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
        const json = await res.json();
        if (json.success) count++;
      } catch { /* continue */ }
    }
    alert(`已删除${selectedIds.size}件商品中的${count}件。`);
    setSelectedIds(new Set());
    await fetchProducts();
    setBulkActionLoading(false);
  };

  const handleBulkStatus = async (status: string) => {
    if (selectedIds.size === 0) return;
    if (!confirm(`确定要将${selectedIds.size}件商品设为"${status}"吗？`)) return;
    setBulkActionLoading(true);
    let count = 0;
    for (const id of selectedIds) {
      try {
        const res = await fetch(`/api/products/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status }),
        });
        const json = await res.json();
        if (json.success) count++;
      } catch { /* continue */ }
    }
    alert(`已更新${selectedIds.size}件商品中的${count}件。`);
    setSelectedIds(new Set());
    await fetchProducts();
    setBulkActionLoading(false);
  };

  const parseImages = (images: string): string[] => {
    try {
      const parsed = JSON.parse(images);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return images ? images.split(',').map((s) => s.trim()).filter(Boolean) : [];
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">商品管理</h1>
        <div className="glass-surface rounded-xl border border-[var(--color-border)] p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full mx-auto" />
          <p className="text-sm text-[var(--color-text-light)] mt-3">正在加载商品...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">商品管理</h1>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-700">{error}</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={fetchProducts}>重试</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">商品管理</h1>
        <Link href="/admin/products/new">
          <Button icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          }>添加商品</Button>
        </Link>
      </div>

      {/* Filters & Bulk actions */}
      <div className="glass-surface rounded-xl border border-[var(--color-border)] p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <div className="flex-1">
            <input
              type="text"
              placeholder="搜索商品..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 text-sm border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 text-sm border border-[var(--color-border)] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          >
            <option value="all">全部</option>
            <option value="active">上架</option>
            <option value="inactive">下架</option>
            <option value="draft">草稿</option>
          </select>

          {selectedIds.size > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-[var(--color-text-light)]">已选{selectedIds.size}件</span>
              <Button variant="outline" size="sm" onClick={() => handleBulkStatus('active')} disabled={bulkActionLoading}>批量上架</Button>
              <Button variant="outline" size="sm" onClick={() => handleBulkStatus('inactive')} disabled={bulkActionLoading}>批量下架</Button>
              <Button variant="danger" size="sm" onClick={handleBulkDelete} loading={bulkActionLoading}>批量删除</Button>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="glass-surface rounded-xl border border-[var(--color-border)] overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="p-8 text-center text-[var(--color-text-light)]">
            {search || statusFilter !== 'all'
              ? '没有匹配的商品。'
              : '暂无商品，请添加您的第一个商品！'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <th className="text-left px-4 py-3 w-10">
                    <input
                      type="checkbox"
                      checked={filteredProducts.length > 0 && selectedIds.size === filteredProducts.length}
                      onChange={toggleSelectAll}
                      className="rounded"
                    />
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-[var(--color-text-light)]">图片</th>
                  <th className="text-left px-4 py-3 font-medium text-[var(--color-text-light)]">商品名称</th>
                  <th className="text-right px-4 py-3 font-medium text-[var(--color-text-light)]">价格</th>
                  <th className="text-right px-4 py-3 font-medium text-[var(--color-text-light)]">库存</th>
                  <th className="text-left px-4 py-3 font-medium text-[var(--color-text-light)]">分类</th>
                  <th className="text-left px-4 py-3 font-medium text-[var(--color-text-light)]">状态</th>
                  <th className="text-right px-4 py-3 font-medium text-[var(--color-text-light)]">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const images = parseImages(product.images);
                  const firstImg = images[0] || '';
                  return (
                    <tr key={product.id} className="border-b border-[var(--color-border)] hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(product.id)}
                          onChange={() => toggleSelect(product.id)}
                          className="rounded"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <ImageWithFallback
                          src={firstImg}
                          alt={product.name}
                          wrapperClassName="w-10 h-10 rounded-lg"
                          className="w-full h-full object-cover rounded-lg"
                          fallbackSrc="/images/placeholder.svg"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-[var(--color-text)] truncate max-w-[200px]">{product.name}</p>
                        {product.brand && <p className="text-xs text-[var(--color-text-light)]">{product.brand}</p>}
                      </td>
                      <td className="px-4 py-3 text-right font-medium">{formatPrice(product.price)}</td>
                      <td className={`px-4 py-3 text-right ${product.stock <= 10 ? 'text-red-600 font-semibold' : ''}`}>{product.stock}</td>
                      <td className="px-4 py-3 text-[var(--color-text-light)]">—</td>
                      <td className="px-4 py-3">
                        <Badge variant={statusBadgeVariant[product.status] || 'default'}>{product.status === 'active' ? '上架' : product.status === 'inactive' ? '下架' : product.status === 'draft' ? '草稿' : product.status}</Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/admin/products/${product.id}`}>
                            <Button variant="ghost" size="sm" icon={
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            }>编辑</Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteConfirm({ open: true, id: product.id })}
                            icon={
                              <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            }
                          >删除</Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete confirm dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false })}
        onConfirm={() => deleteConfirm.id && handleDelete(deleteConfirm.id)}
        title="删除商品"
        message="确定要删除该商品吗？此操作不可撤销。"
        confirmLabel="删除"
        variant="danger"
      />
    </div>
  );
}
