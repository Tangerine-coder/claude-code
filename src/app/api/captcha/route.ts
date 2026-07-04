import { NextRequest, NextResponse } from 'next/server';
import { generateCode, signCaptcha, generateCaptchaSvg } from '@/lib/captcha';

export async function GET(request: NextRequest) {
  const code = generateCode();
  const token = signCaptcha(code);
  const svg = generateCaptchaSvg(code);

  const response = new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });

  // Set the captcha answer in a signed cookie
  response.cookies.set('captcha_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 300, // 5 minutes
  });

  return response;
}