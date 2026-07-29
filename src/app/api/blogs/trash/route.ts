import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

function isAdmin(role: string) {
  return role === 'ADMIN' || role === 'CEO' || role === 'DIRECTOR';
}

// GET /api/blogs/trash — list all trashed posts (admin only)
export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = await getSessionUser(cookieStore);
    if (!session || !isAdmin(session.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const blogs = await db.blogPost.findMany({
      where: { deletedAt: { not: null } },
      include: {
        author: { select: { name: true, role: true, department: true } },
      },
      orderBy: { deletedAt: 'desc' },
    });

    return NextResponse.json({ success: true, blogs });
  } catch (err: any) {
    console.error('[trash GET]', err);
    return NextResponse.json({ error: 'Failed to fetch trash' }, { status: 500 });
  }
}

// DELETE /api/blogs/trash — empty entire trash (admin only)
export async function DELETE() {
  try {
    const cookieStore = await cookies();
    const session = await getSessionUser(cookieStore);
    if (!session || !isAdmin(session.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { count } = await db.blogPost.deleteMany({
      where: { deletedAt: { not: null } },
    });

    return NextResponse.json({ success: true, count });
  } catch (err: any) {
    console.error('[trash DELETE]', err);
    return NextResponse.json({ error: 'Failed to empty trash' }, { status: 500 });
  }
}
