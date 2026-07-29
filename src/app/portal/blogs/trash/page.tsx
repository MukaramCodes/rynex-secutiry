'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../blogs.module.css';
import trashStyles from './trash.module.css';

interface AuthorData {
  name: string;
  role: string;
  department: string | null;
}

interface TrashedBlog {
  id: string;
  title: string;
  slug: string;
  status: string;
  author: AuthorData;
  createdAt: string;
  deletedAt: string;
}

export default function TrashPage() {
  const [blogs, setBlogs] = useState<TrashedBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [emptyingTrash, setEmptyingTrash] = useState(false);

  const fetchTrash = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/blogs/trash');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch trash');
      setBlogs(data.blogs || []);
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTrash(); }, []);

  const handleRestore = async (id: string, title: string) => {
    if (!confirm(`Restore "${title}" back to the blog list?`)) return;
    try {
      const res = await fetch(`/api/blogs/trash/${id}`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to restore');
      await fetchTrash();
    } catch (err: any) {
      alert(err.message || 'Error restoring post');
    }
  };

  const handlePermanentDelete = async (id: string, title: string) => {
    if (!confirm(`Permanently delete "${title}"? This CANNOT be undone.`)) return;
    try {
      const res = await fetch(`/api/blogs/trash/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete');
      await fetchTrash();
    } catch (err: any) {
      alert(err.message || 'Error deleting post');
    }
  };

  const handleEmptyTrash = async () => {
    if (blogs.length === 0) return;
    if (!confirm(`Permanently delete all ${blogs.length} trashed post(s)? This CANNOT be undone.`)) return;
    setEmptyingTrash(true);
    try {
      const res = await fetch('/api/blogs/trash', { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to empty trash');
      await fetchTrash();
    } catch (err: any) {
      alert(err.message || 'Error emptying trash');
    } finally {
      setEmptyingTrash(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <div className={trashStyles.breadcrumb}>
            <Link href="/portal/blogs" className={trashStyles.breadcrumbLink}>
              <i className="fas fa-pen-nib" aria-hidden="true" /> Blog Management
            </Link>
            <i className="fas fa-chevron-right" aria-hidden="true" />
            <span>Trash</span>
          </div>
          <h1 className={styles.pageTitle}>
            <i className="fas fa-trash-can" aria-hidden="true" style={{ color: 'var(--status-danger)', marginRight: '0.5rem' }} />
            Trash
          </h1>
          <p className={styles.pageSubtitle}>
            {blogs.length > 0
              ? `${blogs.length} deleted post${blogs.length > 1 ? 's' : ''} — restore or permanently remove them.`
              : 'No posts in trash.'}
          </p>
        </div>
        <div className={trashStyles.headerActions}>
          <Link href="/portal/blogs" className={trashStyles.backBtn}>
            <i className="fas fa-arrow-left" aria-hidden="true" /> Back to Blogs
          </Link>
          {blogs.length > 0 && (
            <button
              type="button"
              className={trashStyles.emptyTrashBtn}
              onClick={handleEmptyTrash}
              disabled={emptyingTrash}
            >
              <i className="fas fa-fire" aria-hidden="true" />
              {emptyingTrash ? 'Emptying…' : 'Empty Trash'}
            </button>
          )}
        </div>
      </div>

      {error && <div className={styles.errorBanner}>{error}</div>}

      {/* Warning banner */}
      {blogs.length > 0 && (
        <div className={trashStyles.warningBanner}>
          <i className="fas fa-triangle-exclamation" aria-hidden="true" />
          Posts in the trash are <strong>not visible on the public website</strong>. Permanently deleted posts cannot be recovered.
        </div>
      )}

      {loading ? (
        <div className={styles.loadingArea}>Loading trash…</div>
      ) : (
        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Original Status</th>
                <th>Deleted At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog.id} className={trashStyles.trashedRow}>
                  <td className={styles.primaryCell}>
                    <div className={trashStyles.deletedTitle}>{blog.title}</div>
                    <div className={styles.monoCell}>/{blog.slug}</div>
                  </td>
                  <td>
                    <div className={styles.flexCenter}>
                      <i className="fas fa-user-circle" style={{ color: 'var(--portal-text-muted)' }} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{blog.author.name}</div>
                        <div className={styles.monoCell}>{blog.author.role} • {blog.author.department || 'TECHNICAL'}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`${styles.statusBadge} ${styles['status_' + blog.status.toLowerCase()]}`}>
                      {blog.status}
                    </span>
                  </td>
                  <td className={styles.dateCell}>
                    {new Date(blog.deletedAt).toLocaleDateString()} {new Date(blog.deletedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td>
                    <div className={styles.actions}>
                      {/* Restore */}
                      <button
                        type="button"
                        className={`${styles.actionBtn} ${trashStyles.restoreBtn}`}
                        title="Restore post"
                        onClick={() => handleRestore(blog.id, blog.title)}
                      >
                        <i className="fas fa-rotate-left" aria-hidden="true" />
                      </button>
                      {/* Permanent delete */}
                      <button
                        type="button"
                        className={`${styles.actionBtn} ${styles.deleteBtn}`}
                        title="Delete permanently"
                        onClick={() => handlePermanentDelete(blog.id, blog.title)}
                      >
                        <i className="fas fa-skull" aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {blogs.length === 0 && (
                <tr>
                  <td colSpan={5} className={styles.empty}>
                    <div className={trashStyles.emptyState}>
                      <i className="fas fa-trash-can" aria-hidden="true" />
                      <div>Trash is empty</div>
                      <Link href="/portal/blogs" className={trashStyles.emptyLink}>← Go back to Blog Management</Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
