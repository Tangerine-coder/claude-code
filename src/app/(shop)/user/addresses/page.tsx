'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import { FiMapPin, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { getRegionLabels } from '@/lib/regions';
import AddressSelector from '@/components/ui/AddressSelector';

interface Address {
  id: string;
  receiver_name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  detail: string;
  zip_code: string;
  is_default: number;
}

interface AddressFormData {
  receiver_name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  detail: string;
  zip_code: string;
  is_default: boolean;
}

const emptyForm: AddressFormData = {
  receiver_name: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  detail: '',
  zip_code: '',
  is_default: false,
};

export default function AddressesPage() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AddressFormData>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchAddresses = useCallback(async () => {
    try {
      const res = await fetch('/api/addresses');
      const data = await res.json();
      if (data.success) {
        setAddresses(data.data);
      }
    } catch (err) {
      console.error('Failed to load addresses:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (addr: Address) => {
    setEditingId(addr.id);
    setForm({
      receiver_name: addr.receiver_name,
      phone: addr.phone,
      province: addr.province,
      city: addr.city,
      district: addr.district,
      detail: addr.detail,
      zip_code: addr.zip_code || '',
      is_default: addr.is_default === 1,
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!form.receiver_name || !form.phone || !form.province || !form.city || !form.district || !form.detail) {
      setFormError('请填写所有必填字段');
      return;
    }
    if (!/^1\d{10}$/.test(form.phone)) {
      setFormError('手机号必须为11位数字');
      return;
    }

    setSubmitting(true);
    try {
      const url = editingId ? `/api/addresses/${editingId}` : '/api/addresses';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setModalOpen(false);
        await fetchAddresses();
      } else {
        setFormError(data.message || '保存地址失败');
      }
    } catch (err) {
      setFormError('保存地址失败');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/addresses/${deleteId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setDeleteId(null);
        await fetchAddresses();
      }
    } catch (err) {
      console.error('Failed to delete address:', err);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton variant="text" width="200px" />
          <Skeleton variant="rect" width="120px" height="40px" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="glass-surface rounded-xl border border-[var(--color-border)] p-5 space-y-2">
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="text" width="40%" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">收货地址</h1>
        <Button variant="primary" icon={<FiPlus />} onClick={openAddModal}>
          新增地址
        </Button>
      </div>

      {addresses.length === 0 ? (
        <EmptyState
          icon={<FiMapPin className="w-12 h-12" />}
          title="No addresses yet"
          description="Add your shipping addresses for faster checkout"
          actionLabel="新增地址"
          onAction={openAddModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div key={addr.id} className="glass-surface rounded-xl border border-[var(--color-border)] p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-[var(--color-text)]">{addr.receiver_name}</h3>
                  {addr.is_default === 1 && (
                    <Badge variant="bestseller" size="sm">默认</Badge>
                  )}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => openEditModal(addr)}
                    className="p-1.5 text-[var(--color-text-light)] hover:text-[var(--color-accent)] hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="编辑地址"
                  >
                    <FiEdit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteId(addr.id)}
                    className="p-1.5 text-[var(--color-text-light)] hover:text-[var(--color-danger)] hover:bg-red-50 rounded-lg transition-colors"
                    aria-label="删除地址"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="text-sm text-[var(--color-text-light)] space-y-0.5">
                <p>{addr.phone}</p>
                <p>
                  {(() => {
                    const labels = getRegionLabels(addr.province, addr.city, addr.district);
                    return labels
                      ? `${labels.provinceLabel} ${labels.cityLabel} ${labels.districtLabel}`
                      : `${addr.province} ${addr.city} ${addr.district}`;
                  })()}
                </p>
                <p>{addr.detail}</p>
                {addr.zip_code && <p>邮编: {addr.zip_code}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Address' : '新增地址'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {formError}
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="收货人 *"
              value={form.receiver_name}
              onChange={(e) => setForm({ ...form, receiver_name: e.target.value })}
              required
            />
            <Input
              label="手机号 *（11位手机号）"
              type="tel"
              maxLength={11}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
            />
          </div>
          <AddressSelector
            province={form.province}
            city={form.city}
            district={form.district}
            onChange={(field, value, label) =>
              setForm(prev => ({ ...prev, [field]: value }))
            }
          />
          <Input
            label="详细地址 *"
            value={form.detail}
            onChange={(e) => setForm({ ...form, detail: e.target.value })}
            required
          />
          <Input
            label="邮编"
            value={form.zip_code}
            onChange={(e) => setForm({ ...form, zip_code: e.target.value })}
          />
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_default}
              onChange={(e) => setForm({ ...form, is_default: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-[var(--color-accent)] focus:ring-[var(--color-accent)]"
            />
            <span className="text-sm text-[var(--color-text)]">设为默认地址</span>
          </label>
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="ghost" type="button" onClick={() => setModalOpen(false)}>
              取消
            </Button>
            <Button variant="primary" type="submit" loading={submitting}>
              {editingId ? '保存修改' : '新增地址'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="删除地址"
        message="确定要删除该地址吗？此操作不可撤销。"
        confirmLabel="删除"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}
