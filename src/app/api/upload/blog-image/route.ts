import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

// Max 5 MB
const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('image') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: JPG, PNG, WebP, GIF, SVG.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File exceeds 5 MB limit.' }, { status: 400 });
    }

    // Build a safe unique filename
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    // Save to public/uploads/blog/
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'blog');
    fs.mkdirSync(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, safeName);
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    const url = `/uploads/blog/${safeName}`;
    return NextResponse.json({ url }, { status: 200 });
  } catch (err: any) {
    console.error('[upload/blog-image]', err);
    return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 });
  }
}
