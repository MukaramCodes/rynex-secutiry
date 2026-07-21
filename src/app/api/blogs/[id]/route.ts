import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

function isAdmin(role: string): boolean {
  return role === 'ADMIN' || role === 'CEO' || role === 'DIRECTOR';
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookieStore = await cookies();
    const session = await getSessionUser(cookieStore);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    
    const blog = await db.blogPost.findUnique({
      where: { id },
      include: {
        author: {
          select: { name: true, role: true, department: true }
        }
      }
    });

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    // Only admin can view any blog for editing. 
    // Authors can view their own blogs.
    if (!isAdmin(session.role) && blog.authorId !== session.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ success: true, blog });
  } catch (error: any) {
    console.error('Error fetching blog:', error);
    return NextResponse.json({ error: 'An error occurred while fetching the blog' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookieStore = await cookies();
    const session = await getSessionUser(cookieStore);

    if (!session || !isAdmin(session.role)) {
      return NextResponse.json({ error: 'Unauthorized or forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const data = await request.json();

    const updatedBlog = await db.blogPost.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        tags: data.tags,
        metaDescription: data.metaDescription,
        canonicalUrl: data.canonicalUrl,
        focusKeyphrase: data.focusKeyphrase,
        coverImage: data.coverImage,
      },
    });

    return NextResponse.json({ success: true, blog: updatedBlog });
  } catch (error: any) {
    console.error('Error updating blog:', error);
    return NextResponse.json({ error: 'An error occurred while updating the blog' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookieStore = await cookies();
    const session = await getSessionUser(cookieStore);

    if (!session || !isAdmin(session.role)) {
      return NextResponse.json({ error: 'Unauthorized or forbidden' }, { status: 403 });
    }
    
    const { id } = await params;

    await db.blogPost.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Blog deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting blog:', error);
    return NextResponse.json({ error: 'An error occurred while deleting the blog' }, { status: 500 });
  }
}
