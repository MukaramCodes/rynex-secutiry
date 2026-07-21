import { db } from "@/lib/db";

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  author?: {
    name: string;
    role: string;
    department: string | null;
  };
  coverImage?: string | null;
};

export type Post = PostMeta & {
  content: string;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
  focusKeyphrase?: string | null;
};

export async function getAllPosts(): Promise<PostMeta[]> {
  const posts = await db.blogPost.findMany({
    where: { status: 'APPROVED' },
    orderBy: { publishedAt: 'desc' },
    include: {
      author: {
        select: { name: true, role: true, department: true }
      }
    }
  });

  return posts.map(post => ({
    slug: post.slug,
    title: post.title,
    date: post.publishedAt ? post.publishedAt.toISOString() : post.createdAt.toISOString(),
    excerpt: post.excerpt || '',
    tags: post.tags,
    author: post.author,
    coverImage: post.coverImage,
  }));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const post = await db.blogPost.findUnique({
    where: { slug },
    include: {
      author: {
        select: { name: true, role: true, department: true }
      }
    }
  });

  if (!post || post.status !== 'APPROVED') return null;

  return {
    slug: post.slug,
    title: post.title,
    date: post.publishedAt ? post.publishedAt.toISOString() : post.createdAt.toISOString(),
    excerpt: post.excerpt || '',
    tags: post.tags,
    content: post.content,
    author: post.author,
    metaDescription: post.metaDescription,
    canonicalUrl: post.canonicalUrl,
    focusKeyphrase: post.focusKeyphrase,
    coverImage: post.coverImage,
  };
}
