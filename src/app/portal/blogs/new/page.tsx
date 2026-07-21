'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '../blogForm.module.css';

export default function NewBlogPage() {
  const router = useRouter();
  
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  
  const [metaDescription, setMetaDescription] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');
  const [focusKeyphrase, setFocusKeyphrase] = useState('');
  const [coverImage, setCoverImage] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(newTitle));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const tagsArray = tags.split(',').map(t => t.trim()).filter(Boolean);
      
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          excerpt,
          content,
          tags: tagsArray,
          metaDescription,
          canonicalUrl,
          focusKeyphrase,
          coverImage
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create blog');

      router.push('/portal/blogs');
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <Link href="/portal/blogs" className={styles.backBtn} title="Back to blogs">
          <i className="fas fa-arrow-left" aria-hidden="true"></i>
        </Link>
        <h1 className={styles.pageTitle}>Write New Blog</h1>
      </div>

      <form onSubmit={handleSubmit} className={styles.formCard}>
        {error && <div className={styles.errorBanner}>{error}</div>}

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <i className="fas fa-pen-nib"></i> Content
          </h2>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Title *</label>
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              className={styles.input}
              placeholder="e.g. 10 Zero-Day Vulnerabilities in 2024"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>URL Slug *</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className={styles.input}
              placeholder="e.g. 10-zero-day-vulnerabilities-2024"
              required
            />
            <span className={styles.hint}>This will be the URL: /blog/{slug || '...'}</span>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Excerpt</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className={`${styles.textarea} ${styles.small}`}
              placeholder="A short summary of the blog post..."
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Content (Markdown) *</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={styles.textarea}
              placeholder="Write your blog content here. Markdown is supported."
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Tags</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className={styles.input}
              placeholder="e.g. VAPT, Malware, Threat Intel (comma separated)"
            />
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <i className="fas fa-search"></i> SEO & Media
          </h2>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Cover Image URL</label>
            <input
              type="text"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className={styles.input}
              placeholder="e.g. /images/blog/zero-day.jpg"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Meta Description</label>
            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              className={`${styles.textarea} ${styles.small}`}
              placeholder="SEO description (typically 150-160 characters)"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Focus Keyphrase</label>
            <input
              type="text"
              value={focusKeyphrase}
              onChange={(e) => setFocusKeyphrase(e.target.value)}
              className={styles.input}
              placeholder="e.g. Zero-Day Vulnerabilities"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Canonical URL</label>
            <input
              type="text"
              value={canonicalUrl}
              onChange={(e) => setCanonicalUrl(e.target.value)}
              className={styles.input}
              placeholder="e.g. https://rynexsecurity.com/blog/..."
            />
            <span className={styles.hint}>Leave blank to use the default URL</span>
          </div>
        </div>

        <div className={styles.actions}>
          <Link href="/portal/blogs" className={styles.cancelBtn}>
            Cancel
          </Link>
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Submitting...' : 'Submit for Approval'}
          </button>
        </div>
      </form>
    </div>
  );
}
