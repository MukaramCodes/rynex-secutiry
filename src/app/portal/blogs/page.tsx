'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './blogs.module.css';

interface AuthorData {
  name: string;
  role: string;
  department: string | null;
}

interface BlogData {
  id: string;
  title: string;
  slug: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  author: AuthorData;
  createdAt: string;
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<BlogData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const meRes = await fetch('/api/portal/auth/me');
      if (meRes.ok) {
        const meData = await meRes.json();
        setCurrentUserRole(meData.user.role);
      }

      const blogsRes = await fetch('/api/blogs');
      const blogsData = await blogsRes.json();
      if (!blogsRes.ok) throw new Error(blogsData.error || 'Failed to fetch blogs');
      setBlogs(blogsData.blogs || []);
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (blogId: string, status: string) => {
    try {
      const res = await fetch(`/api/blogs/${blogId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update status');
      await fetchData();
    } catch (err: any) {
      alert(err.message || 'Error updating status');
    }
  };

  const handleDelete = async (blogId: string, blogTitle: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${blogTitle}"?`)) {
      return;
    }
    
    try {
      const res = await fetch(`/api/blogs/${blogId}`, {
        method: 'DELETE',
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete blog');
      
      await fetchData();
    } catch (err: any) {
      alert(err.message || 'Error deleting blog');
    }
  };

  const isAdmin = currentUserRole === 'ADMIN' || currentUserRole === 'CEO' || currentUserRole === 'DIRECTOR';

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Blog Management</h1>
          <p className={styles.pageSubtitle}>
            {isAdmin 
              ? 'Review, approve, and manage blog submissions for the public website.'
              : 'Submit and manage your blog posts.'}
          </p>
        </div>
        <Link href="/portal/blogs/new" className={styles.createBtn}>
          <i className="fas fa-plus" aria-hidden="true"></i>
          <span>Write Blog</span>
        </Link>
      </div>

      {error && <div className={styles.errorBanner}>{error}</div>}

      {loading ? (
        <div className={styles.loadingArea}>Retrieving blogs...</div>
      ) : (
        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog.id}>
                  <td className={styles.primaryCell}>
                    <div>{blog.title}</div>
                    <div className={styles.monoCell}>/{blog.slug}</div>
                  </td>
                  <td>
                    <div className={styles.flexCenter}>
                      <i className="fas fa-user-circle" style={{ color: 'var(--portal-text-muted)' }}></i>
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
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <div className={styles.actions}>
                      {isAdmin && blog.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(blog.id, 'APPROVED')}
                            className={`${styles.actionBtn} ${styles.approveBtn}`}
                            title="Approve"
                          >
                            <i className="fas fa-check" aria-hidden="true"></i>
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(blog.id, 'REJECTED')}
                            className={`${styles.actionBtn} ${styles.rejectBtn}`}
                            title="Reject"
                          >
                            <i className="fas fa-times" aria-hidden="true"></i>
                          </button>
                        </>
                      )}
                      
                      {isAdmin && (
                        <>
                          <Link href={`/portal/blogs/${blog.id}/edit`} className={styles.actionBtn} title="Edit">
                            <i className="fas fa-edit" aria-hidden="true"></i>
                          </Link>
                          <button
                            onClick={() => handleDelete(blog.id, blog.title)}
                            className={`${styles.actionBtn} ${styles.deleteBtn}`}
                            title="Delete"
                          >
                            <i className="fas fa-trash" aria-hidden="true"></i>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {blogs.length === 0 && (
                <tr>
                  <td colSpan={5} className={styles.empty}>No blogs found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
