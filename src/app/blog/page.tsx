import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import styles from "./blog.module.css";

export const metadata: Metadata = {
  title: "Cybersecurity Blog & Insights | Rynex Security",
  description:
    "Explore practical cybersecurity insights from Rynex Security, including threat trends, penetration testing, malware analysis, SOC operations, and proactive defense.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderInner}>
          <p className={styles.eyebrow}>Rynex Security</p>
          <h1 className={styles.pageTitle}>Blog</h1>
          <p className={styles.pageSubtitle}>
            Practical cybersecurity insights, threat trends, and analysis from the Rynex Security
            team.
          </p>
        </div>
      </div>

      <section className={styles.section}>
        <div className={styles.sectionInner}>
          {posts.length === 0 ? (
            <p className={styles.empty}>No posts published yet — check back soon.</p>
          ) : (
            <div className={styles.postGrid}>
              {posts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className={styles.postCard}>
                  <p className={styles.postDate}>
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <h2 className={styles.postTitle}>{post.title}</h2>
                  <p className={styles.postExcerpt}>{post.excerpt}</p>
                  <div className={styles.tagRow}>
                    {post.tags.map((tag) => (
                      <span key={tag} className={styles.tag}>{tag}</span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
