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

  // Helper to build default nav items if not passed in navGroups
  const buildDefaultNavGroups = (currentRole: string): NavGroup[] => {
    const isRole = (roles: string[]) => roles.includes(currentRole);
    return [
      {
        label: 'Overview',
        items: [
          { href: '/portal/dashboard', icon: 'fas fa-chart-line', label: 'Dashboard' },
        ],
      },
      {
        label: 'Work',
        items: [
          { href: '/portal/projects', icon: 'fas fa-project-diagram', label: 'Projects' },
          { href: '/portal/reports', icon: 'fas fa-file-shield', label: 'Reports', visible: isRole(['CEO', 'ADMIN', 'DEVELOPER', 'HEAD', 'INTERN']) },
          { href: '/portal/tasks', icon: 'fas fa-list-check', label: 'Tasks', visible: isRole(['CEO', 'ADMIN', 'DEVELOPER', 'HEAD', 'INTERN']) },
        ].filter(i => i.visible !== false) as NavItem[],
      },
      {
        label: 'Management',
        items: [
          { href: '/portal/users', icon: 'fas fa-users-cog', label: 'Users', visible: isRole(['CEO', 'ADMIN', 'DEVELOPER', 'HEAD']) },
          { href: '/portal/teams', icon: 'fas fa-sitemap', label: 'Teams', visible: isRole(['CEO', 'ADMIN', 'DEVELOPER', 'HEAD']) },
        ].filter(i => i.visible !== false) as NavItem[],
      },
      {
        label: 'System',
        items: [
          { href: '/portal/settings', icon: 'fas fa-cog', label: 'Settings' },
        ],
      },
    ];
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
