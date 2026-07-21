import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = await getSessionUser(cookieStore);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { role, userId } = session;

    let blogs;

    if (role === 'CEO' || role === 'ADMIN' || role === 'DIRECTOR') {
      blogs = await db.blogPost.findMany({
        include: {
          author: {
            select: { name: true, role: true, department: true }
          }
        },
        orderBy: { createdAt: 'desc' },
      });
    } else {
      blogs = await db.blogPost.findMany({
        where: { authorId: userId },
        include: {
          author: {
            select: { name: true, role: true, department: true }
          }
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json({ success: true, blogs });
  } catch (error: any) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching blogs' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const session = await getSessionUser(cookieStore);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId } = session;

    const { title, slug, excerpt, content, tags, metaDescription, canonicalUrl, focusKeyphrase, coverImage } = await request.json();

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: 'Title, slug, and content are required' },
        { status: 400 }
      );
    }

    // Check if slug exists
    const existing = await db.blogPost.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: 'A blog with this slug already exists' },
        { status: 400 }
      );
    }

    const newBlog = await db.blogPost.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        tags: tags || [],
        metaDescription,
        canonicalUrl,
        focusKeyphrase,
        coverImage,
        authorId: userId,
        status: 'PENDING',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Blog submitted successfully and is pending approval.',
      blog: newBlog,
    });
  } catch (error: any) {
    console.error('Error creating blog:', error);
    return NextResponse.json(
      { error: 'An error occurred while creating the blog' },
      { status: 500 }
    );
  }
}
