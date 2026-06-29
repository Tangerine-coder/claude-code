import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import type { AuthPayload } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET || 'nova-mart-dev-secret-change-in-production';
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
