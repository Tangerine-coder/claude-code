'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Skeleton from '@/components/ui/Skeleton';
import { useToast } from '@/contexts/ToastContext';

interface SiteSettings {
  site_name?: string;
  contact_email?: string;
  contact_phone?: string;
  free_shipping_threshold?: string;
  default_shipping_fee?: string;
  tax_rate?: string;
  [key: string]: string | undefined;
}

const SETTING_LABELS: Record<string, string> = {
  site_name: '网站名称',
  contact_email: '联系邮箱',
  contact_phone: '联系电话',
  free_shipping_threshold: '免运费门槛 ($)',
  default_shipping_fee: '默认运费 ($)',
  tax_rate: '税率',
};

export default function AdminSettingsPage() {
  const { addToast } = useToast();
  const [settings, setSettings] = useState<SiteSettings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    site_name: '',
    contact_email: '',
    contact_phone: '',
    free_shipping_threshold: '',
    default_shipping_fee: '',
    tax_rate: '',
  });

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/settings');
        const json = await res.json();
        if (json.success) {
          setSettings(json.data);
          const data = json.data as SiteSettings;
          setForm({
            site_name: data.site_name || '',
            contact_email: data.contact_email || '',
            contact_phone: data.contact_phone || '',
            free_shipping_threshold: data.free_shipping_threshold || '',
            default_shipping_fee: data.default_shipping_fee || '',
            tax_rate: data.tax_rate || '',
          });
        }
      } catch (err) {
        console.error('Failed to fetch settings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (json.success) {
        addToast('设置已保存', 'success');
      } else {
        addToast(json.message || '保存设置失败', 'error');
      }
    } catch (err) {
      console.error('Error saving settings:', err);
      addToast('保存设置失败', 'error');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  if (loading) {
    return (
      <div className="p-6 space-y-4 max-w-2xl">
        <Skeleton variant="rect" width="200px" height="32px" />
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} variant="rect" height="56px" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-[var(--color-text)] mb-6">系统设置</h1>

      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">
          <Input
            label="网站名称"
            value={form.site_name}
            onChange={updateField('site_name')}
            placeholder="我的电商商城"
          />

          <Input
            label="联系邮箱"
            type="email"
            value={form.contact_email}
            onChange={updateField('contact_email')}
            placeholder="contact@example.com"
          />

          <Input
            label="联系电话"
            value={form.contact_phone}
            onChange={updateField('contact_phone')}
            placeholder="+1 (555) 000-0000"
          />

          <Input
            label="免运费门槛（元）"
            type="number"
            step="0.01"
            value={form.free_shipping_threshold}
            onChange={updateField('free_shipping_threshold')}
            placeholder="50.00"
          />

          <Input
            label="默认运费（元）"
            type="number"
            step="0.01"
            value={form.default_shipping_fee}
            onChange={updateField('default_shipping_fee')}
            placeholder="5.99"
          />

          <Input
            label="税率"
            value={form.tax_rate}
            onChange={updateField('tax_rate')}
            placeholder="例如：8.25%"
          />

          <div className="pt-2">
            <Button type="submit" loading={saving} size="lg">
              保存设置
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
