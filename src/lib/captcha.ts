import crypto from 'crypto';

const CAPTCHA_SECRET = process.env.JWT_SECRET || 'nova-mart-captcha-secret';

// Generate a random 4-digit code
export function generateCode(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}

// Create a signed token to store the captcha answer
export function signCaptcha(code: string): string {
  const payload = `${code}:${Date.now()}`;
  const hmac = crypto.createHmac('sha256', CAPTCHA_SECRET).update(payload).digest('hex').slice(0, 12);
  return Buffer.from(payload + ':' + hmac).toString('base64url');
}

// Verify the captcha answer against the signed token
export function verifyCaptcha(token: string, answer: string): boolean {
  try {
    const decoded = Buffer.from(token, 'base64url').toString();
    const parts = decoded.split(':');
    if (parts.length !== 3) return false;
    const [code, ts, hmac] = parts;
    // Expire after 5 minutes
    if (Date.now() - Number(ts) > 5 * 60 * 1000) return false;
    // Verify HMAC
    const payload = `${code}:${ts}`;
    const expectedHmac = crypto.createHmac('sha256', CAPTCHA_SECRET).update(payload).digest('hex').slice(0, 12);
    if (hmac !== expectedHmac) return false;
    // Compare answer (case-insensitive trim)
    return code === answer.trim();
  } catch {
    return false;
  }
}

// Generate an SVG image with the given code
export function generateCaptchaSvg(code: string): string {
  const colors = ['#0A2647', '#FF6B35', '#144272', '#E84A2A', '#1B5E8A'];
  const w = 160, h = 56;

  // Create noise lines
  const lines = Array.from({ length: 6 }, () => {
    const x1 = Math.floor(Math.random() * w * 0.2);
    const y1 = Math.floor(Math.random() * h);
    const x2 = w * 0.6 + Math.floor(Math.random() * w * 0.4);
    const y2 = Math.floor(Math.random() * h);
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${colors[Math.floor(Math.random() * colors.length)]}" stroke-width="${1 + Math.random() * 2}" opacity="0.3"/>`;
  }).join('\n    ');

  // Create the digits with random transformations
  const digits = code.split('').map((d, i) => {
    const x = 20 + i * 32 + Math.floor(Math.random() * 10);
    const y = 32 + Math.floor(Math.random() * 12) - 6;
    const rot = (Math.random() - 0.5) * 30;
    const color = colors[i % colors.length];
    return `<text x="${x}" y="${y}" transform="rotate(${rot.toFixed(1)},${x},${y})" font-size="${28 + Math.floor(Math.random() * 8)}" font-family="Arial, sans-serif" font-weight="bold" fill="${color}" opacity="0.9">${d}</text>`;
  }).join('\n    ');

  // Random dots
  const dots = Array.from({ length: 40 }, () => {
    const dx = Math.floor(Math.random() * w);
    const dy = Math.floor(Math.random() * h);
    const ds = 1 + Math.random() * 2;
    return `<circle cx="${dx}" cy="${dy}" r="${ds.toFixed(1)}" fill="${colors[Math.floor(Math.random() * colors.length)]}" opacity="0.25"/>`;
  }).join('\n    ');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" rx="8" fill="#f5f5f5"/>
  ${lines}
  ${dots}
  ${digits}
</svg>`;
}