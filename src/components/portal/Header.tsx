'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Header.module.css';
import SecurityAudioControl from './SecurityAudioControl';

interface HeaderProps {
  user: {
    name: string;
    email: string;
    role: string;
  };
}

export default function Header({ user }: HeaderProps) {
  const [loggingOut, setLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (res.ok) {
        router.push('/portal/login');
        router.refresh();
      } else {
        console.error('Logout failed');
      }
    } catch (err) {
      console.error('An error occurred during logout:', err);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <SecurityAudioControl />
        <h2 className={styles.portalTitle}>Security Operations Hub</h2>
      </div>

      <div className={styles.right}>
        <div className={styles.userInfo}>
          <span className={styles.userEmail}>{user.email}</span>
          <span className={styles.roleLabel}>{user.role} Account</span>
        </div>
        <button
          onClick={handleLogout}
          className={styles.logoutBtn}
          disabled={loggingOut}
        >
          <i className="fas fa-sign-out-alt" aria-hidden="true"></i>
          <span>{loggingOut ? 'Ending Session...' : 'Sign Out'}</span>
        </button>
      </div>
    </header>
  );
}
