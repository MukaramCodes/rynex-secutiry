import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import type { Metadata } from "next";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import styles from "../blog.module.css";

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: `${post.title} | Rynex Security Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

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
