'use client';

import React, { useState, useEffect } from 'react';
import styles from './profile.module.css';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  allowedIp?: string;
  lastLogin?: string;
  createdAt?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/portal/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setUser(data.user);
          }
        }
      } catch (err) {
        console.error('Failed to load user profile:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All password fields are required.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }

    setSaving(true);

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update password.');
      }

      setSuccess('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading user profile &amp; security settings...</div>;
  }

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className={styles.container}>
      {/* Header Banner */}
      <div className={styles.headerBanner}>
        <div>
          <h1 className={styles.title}>Account &amp; Security Profile</h1>
          <p className={styles.subtitle}>Manage your profile details and update your login password</p>
        </div>
        <div className={styles.statusBadge}>
          <i className="fas fa-shield-halved" aria-hidden="true"></i> Protected Session
        </div>
      </div>

      <div className={styles.grid}>
        {/* Profile Card */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <i className={`fas fa-user-gear ${styles.cardIcon}`} aria-hidden="true"></i>
            <h2 className={styles.cardTitle}>Identity &amp; Account Details</h2>
          </div>

          <div className={styles.profileAvatarSection}>
            <div className={styles.avatarLarge}>{initial}</div>
            <div className={styles.avatarDetails}>
              <span className={styles.name}>{user?.name || 'Security Professional'}</span>
              <span className={styles.email}>{user?.email || 'N/A'}</span>
              <span className={styles.roleTag}>{user?.role || 'USER'}</span>
            </div>
          </div>

          <div className={styles.infoList}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>
                <i className="fas fa-building" aria-hidden="true"></i> Department
              </span>
              <span className={styles.infoValue}>{user?.department || 'TECHNICAL'}</span>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>
                <i className="fas fa-network-wired" aria-hidden="true"></i> Registered Authorized IP
              </span>
              <span className={styles.infoValue}>{user?.allowedIp || 'Auto-detected on Login'}</span>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>
                <i className="fas fa-calendar-alt" aria-hidden="true"></i> Member Since
              </span>
              <span className={styles.infoValue}>
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })
                  : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Change Password Card */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <i className={`fas fa-key ${styles.cardIcon}`} aria-hidden="true"></i>
            <h2 className={styles.cardTitle}>Change Password</h2>
          </div>

          {error && (
            <div className={styles.alertError}>
              <i className="fas fa-exclamation-circle" aria-hidden="true"></i>
              {error}
            </div>
          )}

          {success && (
            <div className={styles.alertSuccess}>
              <i className="fas fa-check-circle" aria-hidden="true"></i>
              {success}
            </div>
          )}

          <form onSubmit={handlePasswordChange} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="currentPassword" className={styles.label}>
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={styles.input}
                placeholder="••••••••"
                required
                disabled={saving}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="newPassword" className={styles.label}>
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={styles.input}
                placeholder="•••••••• (Min 8 characters)"
                required
                disabled={saving}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword" className={styles.label}>
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={styles.input}
                placeholder="••••••••"
                required
                disabled={saving}
              />
            </div>

            <button type="submit" className={styles.submitBtn} disabled={saving}>
              <i className="fas fa-save" aria-hidden="true"></i>
              {saving ? 'Updating Password...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
