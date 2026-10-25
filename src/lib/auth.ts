import crypto from 'crypto';
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import type { AuthPayload } from '@/types';

const DEV_ONLY_SECRET = 'nova-mart-dev-secret-change-in-production';

function resolveJwtSecret(): string {
  const fromEnv = process.env.JWT_SECRET;
  if (fromEnv && fromEnv.length >= 16) return fromEnv;

  // 开发环境才允许用固定值，方便本地反复登录
  if (process.env.NODE_ENV !== 'production') return DEV_ONLY_SECRET;

  // 生产环境没有配置 JWT_SECRET 时，绝不再回落到仓库里写死的默认值：
  // 那个值是公开的，任何人都能据此伪造 admin token。
  // 改为每次进程启动生成随机密钥 —— 重启后旧登录态失效，但无法被伪造。
  console.warn(
    '[auth] 未配置 JWT_SECRET，已生成随机密钥（重启后登录态会失效）。请尽快在部署环境设置 JWT_SECRET。'
  );
  return crypto.randomBytes(32).toString('hex');
}

export const JWT_SECRET = resolveJwtSecret();
const JWT_EXPIRY = '7d';

export function signToken(payload: AuthPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY } as jwt.SignOptions);
}

export function verifyToken(token: string): AuthPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthPayload;
  } catch {
    return null;
  }
}

export function getAuthUser(request: NextRequest): AuthPayload | null {
  const token = request.cookies.get('auth_token')?.value;
  if (!token) return null;
  return verifyToken(token);
}

export function requireAuth(request: NextRequest, role?: 'customer' | 'admin'): AuthPayload {
  const user = getAuthUser(request);
  if (!user) {
    throw new AuthError('Unauthorized', 401);
  }
  if (role && user.role !== role) {
    throw new AuthError('Forbidden', 403);
  }
  return user;
}

export function requireAdmin(request: NextRequest): AuthPayload {
  return requireAuth(request, 'admin');
}

export class AuthError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export function authErrorResponse(error: unknown) {
  if (error instanceof AuthError) {
    return Response.json(
      { success: false, message: error.message },
      { status: error.status }
    );
  }
  return Response.json(
    { success: false, message: 'Internal server error' },
    { status: 500 }
  );
}
