import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { v4 as uuid } from 'uuid';
import path from 'path';
import fs from 'fs';
import { writeFile } from 'fs/promises';

export async function POST(request: NextRequest) {
  try {
    requireAdmin(request);

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return Response.json({ success: false, message: 'No file uploaded' }, { status: 400 });
    }

    // Validate type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return Response.json({ success: false, message: 'Only JPEG, PNG, WebP allowed' }, { status: 400 });
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return Response.json({ success: false, message: 'File too large (max 5MB)' }, { status: 400 });
    }

    const ext = file.type.split('/')[1];
    const filename = `${uuid()}.${ext}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadDir, filename), buffer);

    return Response.json({
      success: true,
      data: { url: `/uploads/${filename}` },
    });
  } catch (error: any) {
    if (error.status === 401 || error.status === 403) {
      return Response.json({ success: false, message: error.message }, { status: error.status });
    }
    console.error('Upload error:', error);
    return Response.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
