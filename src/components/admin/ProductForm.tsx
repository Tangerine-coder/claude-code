'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Select, Textarea } from '@/components/ui/Input';
import ImageWithFallback from '@/components/ui/ImageWithFallback';

interface CategoryOption {
  value: string;
  label: string;
}

interface SpecRow {
  key: string;
  value: string;
}

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  original_price: string;
  cost_price: string;
  stock: string;
  category_id: string;
  brand: string;
  images: string;
  tags: string;
  is_featured: boolean;
  is_new: boolean;
  is_recommended: boolean;
  status: string;
}

interface ProductFormProps {
  initialData?: {
    id?: string;
    name?: string;
    description?: string;
    price?: number;
    original_price?: number | null;
    cost_price?: number | null;
    stock?: number;
    category_id?: string | null;
    brand?: string;
    images?: string;
    tags?: string;
    is_featured?: number;
    is_new?: number;
    is_recommended?: number;
    status?: string;
    specs?: string;
  };
  isEdit?: boolean;
}

function parseImages(images: string): string[] {
  try {
    const parsed = JSON.parse(images);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return images ? images.split(',').map((s) => s.trim()).filter(Boolean) : [];
  }
}

function parseSpecs(specs: string): SpecRow[] {
  try {
    const parsed = JSON.parse(specs);
    if (Array.isArray(parsed)) return parsed.map((s: any) => ({ key: s.key || '', value: s.value || '' }));
    if (typeof parsed === 'object') return Object.entries(parsed).map(([k, v]) => ({ key: k, value: String(v) }));
    return [];
  } catch {
    return [];
  }
}

function flattenCategories(categories: any[], prefix = ''): CategoryOption[] {
  const result: CategoryOption[] = [];
  for (const cat of categories) {
    const label = prefix ? `${prefix} > ${cat.name}` : cat.name;
    result.push({ value: cat.id, label });
    if (cat.children && cat.children.length > 0) {
      result.push(...flattenCategories(cat.children, label));
    }
  }
  return result;
}

export default function ProductForm({ initialData, isEdit = false }: ProductFormProps) {
  const router = useRouter();

  const [form, setForm] = useState<ProductFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price !== undefined ? String(initialData.price) : '',
    original_price: initialData?.original_price ? String(initialData.original_price) : '',
    cost_price: initialData?.cost_price ? String(initialData.cost_price) : '',
    stock: initialData?.stock !== undefined ? String(initialData.stock) : '',
    category_id: initialData?.category_id || '',
    brand: initialData?.brand || '',
    images: initialData?.images || '',
    tags: initialData?.tags || '',
    is_featured: initialData?.is_featured === 1,
    is_new: initialData?.is_new === 1,
    is_recommended: initialData?.is_recommended === 1,
    status: initialData?.status || 'active',
  });

  const [specs, setSpecs] = useState<SpecRow[]>(
    initialData?.specs ? parseSpecs(initialData.specs) : [{ key: '', value: '' }]
  );

  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        const json = await res.json();
        if (json.success && json.data) {
          setCategories(flattenCategories(json.data));
        }
      } catch {
        // silently fail - categories are optional
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const updateField = (field: keyof ProductFormData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const addSpecRow = () => {
    setSpecs((prev) => [...prev, { key: '', value: '' }]);
  };

  const removeSpecRow = (index: number) => {
    setSpecs((prev) => prev.filter((_, i) => i !== index));
  };

  const updateSpec = (index: number, field: 'key' | 'value', val: string) => {
    setSpecs((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: val };
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim()) {
      setError('请输入商品名称');
      return;
    }
    if (!form.price || parseFloat(form.price) < 0) {
      setError('请输入有效的价格');
      return;
    }

    setSubmitting(true);

    // Build image array
    const imageArray = form.images
      ? form.images.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    // Build specs object from non-empty rows
    const specsObj: Record<string, string> = {};
    specs.forEach((s) => {
      if (s.key.trim()) {
        specsObj[s.key.trim()] = s.value;
      }
    });

    // Build payload - match the API's expected fields
    const payload: Record<string, any> = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      original_price: form.original_price ? parseFloat(form.original_price) : null,
      cost_price: form.cost_price ? parseFloat(form.cost_price) : null,
      stock: form.stock ? parseInt(form.stock) : 0,
      category_id: form.category_id || null,
      brand: form.brand,
      images: imageArray,
      specs: specsObj,
      tags: form.tags,
      is_featured: form.is_featured,
      is_new: form.is_new,
      is_recommended: form.is_recommended,
      status: form.status,
    };

    try {
      const url = isEdit && initialData?.id
        ? `/api/products/${initialData.id}`
        : '/api/products';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.message || '保存商品失败');

      router.push('/admin/products');
    } catch (err: any) {
      setError(err.message || '保存商品失败');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full" />
      </div>
    );
  }

  const imageList = parseImages(form.images);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>
      )}

      {/* Basic info */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-5 space-y-4">
        <h2 className="font-semibold text-[var(--color-text)]">基本信息</h2>

        <Input
          label="商品名称"
          placeholder="请输入商品名称"
          value={form.name}
          onChange={(e) => updateField('name', e.target.value)}
          required
        />

        <Textarea
          label="商品描述（支持HTML）"
          placeholder="请输入商品描述"
          value={form.description}
          onChange={(e) => updateField('description', e.target.value)}
        />
      </div>

      {/* Pricing & Inventory */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-5 space-y-4">
        <h2 className="font-semibold text-[var(--color-text)]">价格与库存</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            label="售价"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={form.price}
            onChange={(e) => updateField('price', e.target.value)}
            required
          />
          <Input
            label="原价"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={form.original_price}
            onChange={(e) => updateField('original_price', e.target.value)}
          />
          <Input
            label="成本价"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={form.cost_price}
            onChange={(e) => updateField('cost_price', e.target.value)}
          />
          <Input
            label="库存"
            type="number"
            min="0"
            placeholder="0"
            value={form.stock}
            onChange={(e) => updateField('stock', e.target.value)}
          />
        </div>
      </div>

      {/* Category & Brand */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-5 space-y-4">
        <h2 className="font-semibold text-[var(--color-text)]">分类与品牌</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="商品分类"
            value={form.category_id}
            onChange={(e) => updateField('category_id', e.target.value)}
            options={[
              { value: '', label: '-- 选择分类 --' },
              ...categories,
            ]}
          />
          <Input
            label="品牌"
            placeholder="请输入品牌名称"
            value={form.brand}
            onChange={(e) => updateField('brand', e.target.value)}
          />
        </div>
      </div>

      {/* Images */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-5 space-y-4">
        <h2 className="font-semibold text-[var(--color-text)]">商品图片</h2>
        <Input
          label="商品图片（多个URL用逗号分隔）"
          placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
          value={form.images}
          onChange={(e) => updateField('images', e.target.value)}
        />
        {imageList.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {imageList.map((url, i) => (
              <ImageWithFallback
                key={i}
                src={url}
                alt={`Preview ${i + 1}`}
                wrapperClassName="w-20 h-20 rounded-lg"
                className="w-full h-full object-cover rounded-lg"
                fallbackSrc="/images/placeholder.svg"
              />
            ))}
          </div>
        )}
      </div>

      {/* Specifications */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-[var(--color-text)]">商品参数</h2>
          <Button type="button" variant="outline" size="sm" onClick={addSpecRow} icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          }>添加参数</Button>
        </div>
        {specs.map((spec, i) => (
          <div key={i} className="flex items-center gap-3">
            <Input
              placeholder="参数名（如：颜色）"
              value={spec.key}
              onChange={(e) => updateSpec(i, 'key', e.target.value)}
              className="flex-1"
            />
            <Input
              placeholder="参数值（如：红色）"
              value={spec.value}
              onChange={(e) => updateSpec(i, 'value', e.target.value)}
              className="flex-1"
            />
            {specs.length > 1 && (
              <button
                type="button"
                onClick={() => removeSpecRow(i)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Tags & Badges */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-5 space-y-4">
        <h2 className="font-semibold text-[var(--color-text)]">标签与标记</h2>
        <Input
          label="标签（逗号分隔）"
          placeholder="电子产品, 新品, 促销"
          value={form.tags}
          onChange={(e) => updateField('tags', e.target.value)}
        />
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={(e) => updateField('is_featured', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-[var(--color-accent)] focus:ring-[var(--color-accent)]"
            />
            <span className="text-sm text-[var(--color-text)]">精选推荐</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_new}
              onChange={(e) => updateField('is_new', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-[var(--color-accent)] focus:ring-[var(--color-accent)]"
            />
            <span className="text-sm text-[var(--color-text)]">新品上市</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_recommended}
              onChange={(e) => updateField('is_recommended', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-[var(--color-accent)] focus:ring-[var(--color-accent)]"
            />
            <span className="text-sm text-[var(--color-text)]">热销推荐</span>
          </label>
        </div>
      </div>

      {/* Status & Submit */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-5 space-y-4">
        <h2 className="font-semibold text-[var(--color-text)]">发布状态</h2>
        <Select
          label="状态"
          value={form.status}
          onChange={(e) => updateField('status', e.target.value)}
          options={[
            { value: 'active', label: '上架' },
            { value: 'inactive', label: '下架' },
            { value: 'draft', label: '草稿' },
          ]}
        />
        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" loading={submitting}>
            {isEdit ? '更新商品' : '创建商品'}
          </Button>
          <Button type="button" variant="ghost" onClick={() => router.push('/admin/products')}>
            取消
          </Button>
        </div>
      </div>
    </form>
  );
}
