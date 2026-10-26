import { NextResponse, type NextRequest } from 'next/server';

/**
 * 统一的安全 / 隐私响应头。
 *
 * - 个人相关路径（/api、/admin、/user、/cart、/checkout）：
 *   · X-Robots-Tag: noindex —— 搜索引擎和爬虫不会收录、不会出现在搜索结果里
 *   · Cache-Control: no-store —— 浏览器、代理、CDN 都不缓存，避免个人信息留在中间层
 * - 全站补充基础安全头（防嗅探、防点击劫持、控制 Referer 泄漏）
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  const isPrivate =
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/user') ||
    pathname.startsWith('/cart') ||
    pathname.startsWith('/checkout');

  if (isPrivate) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    response.headers.set('Pragma', 'no-cache');
  }

  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|favicon.svg).*)'],
};
