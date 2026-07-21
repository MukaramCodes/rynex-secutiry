'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import styles from './Sidebar.module.css';

interface NavItem {
  href: string;
  icon: string;
  label: string;
  badge?: number;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

interface SidebarProps {
  user?: {
    name: string;
    email: string;
    role: string;
  };
  userName?: string;
  userRole?: string;
  navGroups?: NavGroup[];
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({
  user,
  userName,
  userRole,
  navGroups,
  isMobileOpen = false,
  onMobileClose,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const name = userName || user?.name || 'Security User';
  const role = userRole || user?.role || 'INTERN';
  const email = user?.email || 'user@rynexsecurity.com';

  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Load theme from localStorage on mount
    const savedTheme = localStorage.getItem('rynex-theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('rynex-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('rynex-theme', 'light');
      }
      return newMode;
    });
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      window.location.href = '/portal/login';
    }
  };

  const buildDefaultNavGroups = (role: string): NavGroup[] => {
    const groups: NavGroup[] = [];

    // Dashboard — everyone
    groups.push({
      label: 'Overview',
      items: [
        { href: '/portal/dashboard', icon: 'fas fa-terminal', label: 'Dashboard' },
      ],
    });

    // Projects & Work
    const projectItems: NavItem[] = [];

    if (['CEO', 'ADMIN', 'DIRECTOR'].includes(role)) {
      projectItems.push({ href: '/portal/projects', icon: 'fas fa-folder-open', label: 'All Projects' });
    } else if (['HEAD', 'DEVELOPER', 'INTERN'].includes(role)) {
      projectItems.push({ href: '/portal/projects', icon: 'fas fa-folder-open', label: 'My Projects' });
    } else if (role === 'CLIENT') {
      projectItems.push({ href: '/portal/projects', icon: 'fas fa-folder-open', label: 'My Project' });
    }

    // Reports
    if (['CEO', 'ADMIN', 'DIRECTOR'].includes(role)) {
      projectItems.push({ href: '/portal/reports', icon: 'fas fa-file-lines', label: 'All Reports' });
    } else if (['HEAD', 'DEVELOPER', 'INTERN'].includes(role)) {
      projectItems.push({ href: '/portal/reports', icon: 'fas fa-file-lines', label: 'Reports' });
    } else if (role === 'CLIENT') {
      projectItems.push({ href: '/portal/reports', icon: 'fas fa-file-download', label: 'Deliverables' });
    }

    // Tasks
    if (['CEO', 'ADMIN', 'DIRECTOR', 'HEAD', 'DEVELOPER', 'INTERN'].includes(role)) {
      projectItems.push({ href: '/portal/tasks', icon: 'fas fa-list-check', label: 'Tasks' });
    }

    // Blogs - everyone can submit blogs
    projectItems.push({ href: '/portal/blogs', icon: 'fas fa-pen-nib', label: 'Blogs' });

    if (projectItems.length > 0) {
      groups.push({ label: 'Work', items: projectItems });
    }

    // Messaging
    const msgItems: NavItem[] = [];
    if (['CEO', 'DEVELOPER', 'HEAD', 'CLIENT'].includes(role)) {
      if (role === 'CEO') {
        msgItems.push({ href: '/portal/messages', icon: 'fas fa-inbox', label: 'Client Inbox' });
      } else {
        msgItems.push({ href: '/portal/messages', icon: 'fas fa-comments', label: 'Messages' });
      }
    }
    if (msgItems.length > 0) {
      groups.push({ label: 'Communication', items: msgItems });
    }

    // Management
    const mgmtItems: NavItem[] = [];

    if (['CEO', 'ADMIN', 'DIRECTOR'].includes(role)) {
      mgmtItems.push({ href: '/portal/users', icon: 'fas fa-users', label: 'Users' });
    } else if (role === 'HEAD') {
      mgmtItems.push({ href: '/portal/users', icon: 'fas fa-users', label: 'My Team' });
    }

    if (['CEO', 'ADMIN', 'DIRECTOR', 'HEAD'].includes(role)) {
      mgmtItems.push({ href: '/portal/teams', icon: 'fas fa-people-group', label: 'Teams' });
    }

    if (['CEO', 'ADMIN', 'DIRECTOR'].includes(role)) {
      mgmtItems.push({ href: '/portal/audit-log', icon: 'fas fa-scroll', label: 'Audit Log' });
    }

    if (mgmtItems.length > 0) {
      groups.push({ label: 'Management', items: mgmtItems });
    }

    // System Settings (CEO + ADMIN only)
    if (['CEO', 'ADMIN'].includes(role)) {
      groups.push({
        label: 'System',
        items: [
          { href: '/portal/settings', icon: 'fas fa-gear', label: 'Settings' },
        ],
      });
    }

    return groups;
  };

  const activeNavGroups = navGroups || buildDefaultNavGroups(role);

  return (
    <aside className={`${styles.sidebar} ${isMobileOpen ? styles.mobileOpen : ''}`}>
      <div className={styles.brand}>
        <Image
          src="/images/logo-transparent.png"
          alt="Rynex Security"
          width={28}
          height={28}
          className={styles.logoImg}
        />
        <div className={styles.brandText}>
          <span className={styles.companyName}>Rynex Security</span>
          <span className={styles.subtext}>SecOps Kernel v4.1</span>
        </div>
        {onMobileClose && (
          <button onClick={onMobileClose} className={styles.mobileCloseBtn} aria-label="Close sidebar">
            <i className="fas fa-times" aria-hidden="true"></i>
          </button>
        )}
      </div>

      <nav className={styles.nav}>
        {activeNavGroups.map((group) => (
          <div key={group.label} className={styles.navSection}>
            <div className={styles.sectionLabel}>{group.label}</div>
            <div className={styles.sectionItems}>
              {group.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`${styles.navLink} ${isActive ? styles.active : ''}`}
                    onClick={onMobileClose}
                  >
                    <i className={`${item.icon} ${styles.icon}`} aria-hidden="true"></i>
                    <span>{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className={styles.badge}>{item.badge}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className={styles.sidebarFooter}>
        <div className={styles.userCard}>
          <div className={styles.avatar}>
            {name.charAt(0).toUpperCase()}
          </div>
          <div className={styles.userInfo}>
            <div className={styles.userName}>{name}</div>
            <div className={styles.userEmail}>{email}</div>
            <span className={`${styles.roleBadge} ${styles[role.toLowerCase()]}`}>
              {role}
            </span>
          </div>
        </div>

        <div className={styles.footerActions}>
          <button onClick={toggleTheme} className={styles.themeToggleBtn} aria-label="Toggle Theme">
            {isDarkMode ? (
              <i className="fas fa-sun" aria-hidden="true"></i>
            ) : (
              <i className="fas fa-moon" aria-hidden="true"></i>
            )}
          </button>
          
          <button onClick={handleLogout} className={styles.logoutBtn} aria-label="Sign Out">
            <i className="fas fa-power-off" aria-hidden="true"></i>
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
