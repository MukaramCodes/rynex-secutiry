import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

function isAdmin(role: string) {
  return role === 'ADMIN' || role === 'CEO' || role === 'DIRECTOR';
}

// POST /api/blogs/trash/[id] — restore a post from trash
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const session = await getSessionUser(cookieStore);
    if (!session || !isAdmin(session.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;

    await db.blogPost.update({
      where: { id },
      data: { deletedAt: null },
    });

    return NextResponse.json({ success: true, message: 'Blog restored successfully' });
  } catch (err: any) {
    console.error('[trash restore]', err);
    return NextResponse.json({ error: 'Failed to restore blog' }, { status: 500 });
  }
}

// DELETE /api/blogs/trash/[id] — permanently delete a single trashed post
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const session = await getSessionUser(cookieStore);
    if (!session || !isAdmin(session.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;

    await db.blogPost.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Blog permanently deleted' });
  } catch (err: any) {
    console.error('[trash perm delete]', err);
    return NextResponse.json({ error: 'Failed to delete blog permanently' }, { status: 500 });
  }
}
