'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  // Option A (Legacy/New Layout)
  user?: {
    name: string;
    email: string;
    role: string;
  };
  
  // Option B (PortalShell)
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

  // Determine actual display values based on which props were supplied
  const name = userName || user?.name || 'User';
  const role = userRole || user?.role || 'INTERN';
  const email = user?.email || '';

  // Helper to build default nav groups if not passed in navGroups
  const buildDefaultNavGroups = (role: string): NavGroup[] => {
    const groups: NavGroup[] = [];

    // Dashboard — everyone
    groups.push({
      label: 'Overview',
      items: [
        { href: '/portal/dashboard', icon: 'fas fa-chart-pie', label: 'Dashboard' },
      ],
    });

    // Projects & Work
    const projectItems: NavItem[] = [];

    if (['CEO', 'ADMIN', 'DEVELOPER'].includes(role)) {
      projectItems.push({ href: '/portal/projects', icon: 'fas fa-folder-open', label: 'All Projects' });
    } else if (['HEAD', 'INTERN'].includes(role)) {
      projectItems.push({ href: '/portal/projects', icon: 'fas fa-folder-open', label: 'My Projects' });
    } else if (role === 'CLIENT') {
      projectItems.push({ href: '/portal/projects', icon: 'fas fa-folder-open', label: 'My Project' });
    }

    // Reports
    if (['CEO', 'ADMIN', 'DEVELOPER'].includes(role)) {
      projectItems.push({ href: '/portal/reports', icon: 'fas fa-file-lines', label: 'All Reports' });
    } else if (['HEAD', 'INTERN'].includes(role)) {
      projectItems.push({ href: '/portal/reports', icon: 'fas fa-file-lines', label: 'Reports' });
    } else if (role === 'CLIENT') {
      projectItems.push({ href: '/portal/reports', icon: 'fas fa-file-download', label: 'Deliverables' });
    }

    // Tasks
    if (['CEO', 'ADMIN', 'DEVELOPER', 'HEAD', 'INTERN'].includes(role)) {
      projectItems.push({ href: '/portal/tasks', icon: 'fas fa-list-check', label: 'Tasks' });
    }

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

    if (['CEO', 'ADMIN', 'DEVELOPER'].includes(role)) {
      mgmtItems.push({ href: '/portal/users', icon: 'fas fa-users', label: 'Users' });
    } else if (role === 'HEAD') {
      mgmtItems.push({ href: '/portal/users', icon: 'fas fa-users', label: 'My Team' });
    }

    if (['CEO', 'ADMIN', 'DEVELOPER', 'HEAD'].includes(role)) {
      mgmtItems.push({ href: '/portal/teams', icon: 'fas fa-people-group', label: 'Teams' });
    }

    if (['CEO', 'ADMIN', 'DEVELOPER'].includes(role)) {
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
        <div className={styles.logoCircle}></div>
        <div className={styles.brandText}>
          <span className={styles.companyName}>Rynex Security</span>
          <span className={styles.subtext}>Security Hub</span>
        </div>
        {onMobileClose && (
          <button onClick={onMobileClose} className={styles.mobileCloseBtn} aria-label="Close sidebar">
            <i className="fas fa-times" aria-hidden="true"></i>
          </button>
        )}
      </div>

      <div className={styles.userCard}>
        <div className={styles.avatar}>
          {name.charAt(0).toUpperCase()}
        </div>
        <div className={styles.userInfo}>
          <div className={styles.userName}>{name}</div>
          <span className={`${styles.roleBadge} ${styles[role.toLowerCase()]}`}>
            {role}
          </span>
        </div>
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

      <div className={styles.footer}>
        <span>v1.0.0</span>
      </div>
    </aside>
  );
}
