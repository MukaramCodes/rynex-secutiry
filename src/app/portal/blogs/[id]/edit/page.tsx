'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import styles from '../../blogForm.module.css';

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const blogId = params.id as string;
  
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  
  const [metaDescription, setMetaDescription] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');
  const [focusKeyphrase, setFocusKeyphrase] = useState('');
  const [coverImage, setCoverImage] = useState('');
  
  const [status, setStatus] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/blogs/${blogId}`);
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.error || 'Failed to fetch blog');
        
        const b = data.blog;
        setTitle(b.title);
        setSlug(b.slug);
        setExcerpt(b.excerpt || '');
        setContent(b.content);
        setTags(b.tags ? b.tags.join(', ') : '');
        setMetaDescription(b.metaDescription || '');
        setCanonicalUrl(b.canonicalUrl || '');
        setFocusKeyphrase(b.focusKeyphrase || '');
        setCoverImage(b.coverImage || '');
        setStatus(b.status);
      } catch (err: any) {
        setError(err.message || 'An error occurred fetching the blog.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlog();
  }, [blogId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const tagsArray = tags.split(',').map(t => t.trim()).filter(Boolean);
      
      const res = await fetch(`/api/blogs/${blogId}`, {
        method: 'PUT',
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
      if (!res.ok) throw new Error(data.error || 'Failed to update blog');

      alert('Blog updated successfully!');
      router.push('/portal/blogs');
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className={styles.loadingArea}>Loading blog data...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <Link href="/portal/blogs" className={styles.backBtn} title="Back to blogs">
          <i className="fas fa-arrow-left" aria-hidden="true"></i>
        </Link>
        <h1 className={styles.pageTitle}>Edit Blog</h1>
        <div style={{ marginLeft: 'auto' }}>
          <span className={styles.statusBadge} style={{
            background: status === 'APPROVED' ? 'var(--status-success-bg)' : status === 'REJECTED' ? 'var(--status-danger-bg)' : 'var(--status-warning-bg)',
            color: status === 'APPROVED' ? 'var(--status-success)' : status === 'REJECTED' ? 'var(--status-danger)' : 'var(--status-warning)',
            padding: '0.25rem 0.75rem',
            borderRadius: '99px',
            fontSize: '0.75rem',
            fontWeight: 700
          }}>
            {status}
          </span>
        </div>
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
              onChange={(e) => setTitle(e.target.value)}
              className={styles.input}
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
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Excerpt</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className={`${styles.textarea} ${styles.small}`}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Content (Markdown) *</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={styles.textarea}
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
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Meta Description</label>
            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              className={`${styles.textarea} ${styles.small}`}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Focus Keyphrase</label>
            <input
              type="text"
              value={focusKeyphrase}
              onChange={(e) => setFocusKeyphrase(e.target.value)}
              className={styles.input}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Canonical URL</label>
            <input
              type="text"
              value={canonicalUrl}
              onChange={(e) => setCanonicalUrl(e.target.value)}
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.actions}>
          <Link href="/portal/blogs" className={styles.cancelBtn}>
            Cancel
          </Link>
          <button type="submit" className={styles.submitBtn} disabled={submitting}>
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
