'use client';

import React, { useMemo } from 'react';
import { REGIONS } from '@/lib/regions';
import type { District } from '@/lib/regions';

export interface AddressSelectorProps {
  province: string;
  city: string;
  district: string;
  onChange: (field: 'province' | 'city' | 'district', value: string, label: string) => void;
  error?: { province?: string; city?: string; district?: string };
}

export default function AddressSelector({
  province,
  city,
  district,
  onChange,
  error,
}: AddressSelectorProps) {
  const cities = useMemo(() => {
    if (!province) return [];
    const found = REGIONS.find((p) => p.value === province);
    return found ? found.cities : [];
  }, [province]);

  const districts: District[] = useMemo(() => {
    if (!province || !city) return [];
    const foundProvince = REGIONS.find((p) => p.value === province);
    if (!foundProvince) return [];
    const foundCity = foundProvince.cities.find((c) => c.value === city);
    return foundCity ? foundCity.districts : [];
  }, [province, city]);

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const selected = REGIONS.find((p) => p.value === value);
    onChange('province', value, selected ? selected.label : '');
    // Reset city and district
    onChange('city', '', '');
    onChange('district', '', '');
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const selectedProvince = REGIONS.find((p) => p.value === province);
    const selected = selectedProvince?.cities.find((c) => c.value === value);
    onChange('city', value, selected ? selected.label : '');
    // Reset district
    onChange('district', '', '');
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const selected = districts.find((d) => d.value === value);
    onChange('district', value, selected ? selected.label : '');
  };

  const selectClass =
    'w-full px-4 py-2.5 text-sm border border-[var(--color-border)] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-all duration-200';
  const selectClassError =
    'w-full px-4 py-2.5 text-sm border border-[var(--color-danger)] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-danger)] focus:border-transparent transition-all duration-200';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="w-full">
        <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
          省份 *
        </label>
        <select
          value={province}
          onChange={handleProvinceChange}
          className={error?.province ? selectClassError : selectClass}
        >
          <option value="">请选择省份</option>
          {REGIONS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
        {error?.province && (
          <p className="mt-1 text-xs text-[var(--color-danger)]">{error.province}</p>
        )}
      </div>

      <div className="w-full">
        <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
          城市 *
        </label>
        <select
          value={city}
          onChange={handleCityChange}
          className={error?.city ? selectClassError : selectClass}
          disabled={!province}
        >
          <option value="">请选择城市</option>
          {cities.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        {error?.city && (
          <p className="mt-1 text-xs text-[var(--color-danger)]">{error.city}</p>
        )}
      </div>

      <div className="w-full">
        <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
          区/县 *
        </label>
        <select
          value={district}
          onChange={handleDistrictChange}
          className={error?.district ? selectClassError : selectClass}
          disabled={!city}
        >
          <option value="">请选择区/县</option>
          {districts.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>
        {error?.district && (
          <p className="mt-1 text-xs text-[var(--color-danger)]">{error.district}</p>
        )}
      </div>
    </div>
  );
}
