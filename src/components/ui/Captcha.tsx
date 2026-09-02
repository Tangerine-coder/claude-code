'use client';

import React, { useState, useCallback, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { FiRefreshCw } from 'react-icons/fi';

export interface CaptchaHandle {
  refresh: () => void;
}

interface CaptchaProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const Captcha = forwardRef<CaptchaHandle, CaptchaProps>(function Captcha(
  { value, onChange, error },
  ref
) {
  const [imgSrc, setImgSrc] = useState('');
  const [loading, setLoading] = useState(false);
  const [key, setKey] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);

  const refresh = useCallback(() => {
    setLoading(true);
    // Append timestamp to prevent caching
    setImgSrc(`/api/captcha?t=${Date.now()}`);
    setKey((k) => k + 1);
    onChange('');
  }, [onChange]);

  // Expose refresh to parent (e.g. refresh after failed login/register)
  useImperativeHandle(ref, () => ({ refresh }), [refresh]);

  useEffect(() => {
    refresh();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
        验证码
      </label>
      <div className="flex gap-3 items-start">
        <div className="flex-1">
          <input
            type="text"
            inputMode="numeric"
            maxLength={4}
            placeholder="请输入验证码"
            value={value}
            onChange={(e) => onChange(e.target.value.replace(/\D/g, '').slice(0, 4))}
            className={`w-full px-4 py-2.5 rounded-xl border text-sm
              bg-white/80 backdrop-blur-sm
              ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary-light)]'}
              focus:outline-none focus:ring-2 transition-all duration-200
              placeholder:text-gray-400`}
          />
        </div>
        <div className="relative flex-shrink-0">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg z-10">
              <div className="animate-spin w-5 h-5 border-2 border-[var(--color-primary)] border-t-transparent rounded-full" />
            </div>
          )}
          <img
            ref={imgRef}
            src={imgSrc}
            alt="验证码"
            key={key}
            className="h-14 w-40 rounded-lg cursor-pointer border border-[var(--color-border)] select-none"
            style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
            onClick={() => refresh()}
            onLoad={() => setLoading(false)}
            onError={() => setLoading(false)}
          />
        </div>
        <button
          type="button"
          onClick={() => refresh()}
          className="p-3 rounded-xl border border-[var(--color-border)] hover:bg-gray-50 transition-colors flex-shrink-0 mt-0"
          title="刷新验证码"
        >
          <FiRefreshCw className="w-4 h-4 text-[var(--color-text-light)]" />
        </button>
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      <p className="text-xs text-[var(--color-text-light)] mt-1">
        点击图片或刷新按钮可更换验证码
      </p>
    </div>
  );
});

export default Captcha;
