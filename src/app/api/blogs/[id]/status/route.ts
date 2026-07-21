import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

function isAdmin(role: string): boolean {
  return role === 'ADMIN' || role === 'CEO' || role === 'DIRECTOR';
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookieStore = await cookies();
    const session = await getSessionUser(cookieStore);

    if (!session || !isAdmin(session.role)) {
      return NextResponse.json({ error: 'Unauthorized or forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const { status } = await request.json();

    if (!['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const data: any = { status };
    if (status === 'APPROVED') {
      data.publishedAt = new Date();
    }

    const updatedBlog = await db.blogPost.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true, blog: updatedBlog });
  } catch (error: any) {
    console.error('Error updating blog status:', error);
    return NextResponse.json({ error: 'An error occurred while updating the blog status' }, { status: 500 });
  }
}
