import type { NextRequest } from 'next/server';

/**
 * 简单的进程内限流（滑动窗口计数）。
 *
 * 用途：挡住「批量试密码」「批量探测邮箱是否已注册」「刷验证码」这类脚本。
 * 注意：状态存在进程内存里，多实例/多实例重启后会重置；
 * 个人项目单实例部署够用，要更强的话换 Upstash Redis 之类的共享存储。
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
const MAX_KEYS = 10_000;

function prune(now: number) {
  if (buckets.size < MAX_KEYS) return;
  for (const [k, v] of buckets) {
    if (v.resetAt <= now) buckets.delete(k);
  }
  // 还是太大就直接清空，宁可短暂放宽也不要吃满内存
  if (buckets.size >= MAX_KEYS) buckets.clear();
}

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  retryAfter: number;
}

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  prune(now);

  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfter: 0 };
  }

  if (bucket.count >= limit) {
    return { ok: false, remaining: 0, retryAfter: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)) };
  }

  bucket.count += 1;
  return { ok: true, remaining: limit - bucket.count, retryAfter: 0 };
}

/** 取客户端 IP（Render 会带 x-forwarded-for） */
export function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip')?.trim() || 'unknown';
}

/** 统一的 429 响应 */
export function tooManyRequests(retryAfter: number, message = '操作太频繁，请稍后再试') {
  return new Response(JSON.stringify({ success: false, message }), {
    status: 429,
    headers: {
      'Content-Type': 'application/json',
      'Retry-After': String(retryAfter),
      'Cache-Control': 'no-store',
    },
  });
}
