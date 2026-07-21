import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import type { Metadata } from "next";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import styles from "../blog.module.css";

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  return {
    title: `${post.title} | Rynex Security Blog`,
    description: post.metaDescription || post.excerpt,
    alternates: post.canonicalUrl ? { canonical: post.canonicalUrl } : undefined,
    keywords: post.focusKeyphrase ? [post.focusKeyphrase] : undefined,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  return (
    <section className={styles.section}>
      <div className={styles.sectionInner}>
        <div className={styles.postHeader}>
          <Link href="/blog" className={styles.backLink}>
            <i className="fas fa-arrow-left" aria-hidden="true" /> Back to Blog
          </Link>
          <p className={styles.postDate}>
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <h1 className={styles.postDetailTitle}>{post.title}</h1>
          
          {post.author && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1.5rem', marginBottom: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '0.5rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem', color: '#000' }}>
                {post.author.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: '1.1rem' }}>{post.author.name}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{post.author.role} • {post.author.department || 'TECHNICAL'}</div>
              </div>
            </div>
          )}
          
          {post.coverImage && (
            <div style={{ marginBottom: '2rem', borderRadius: '0.75rem', overflow: 'hidden' }}>
              <img src={post.coverImage} alt={post.title} style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>
          )}

          <div className={styles.tagRow}>
            {post.tags.map((tag) => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
          </div>
        </div>
        <article className={styles.article}>
          <MDXRemote source={post.content} />
        </article>
      </div>
    </section>
  );
}
