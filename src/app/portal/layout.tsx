import React from 'react';
import { cookies } from 'next/headers';
import { getSessionUser } from '@/lib/auth';
import Sidebar from '@/components/portal/Sidebar';
import Header from '@/components/portal/Header';
import styles from './portal.module.css';
import './portal.css';

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const session = await getSessionUser(cookieStore);

  // If there is no session (e.g. on login page), just render children directly
  if (!session) {
    return <>{children}</>;
  }

  return (
    <div className={styles.portalWrapper}>
      <Sidebar user={session} />
      <div className={styles.mainContent}>
        <Header user={session} />
        <main className={styles.scrollArea}>{children}</main>
      </div>
    </div>
  );
}
