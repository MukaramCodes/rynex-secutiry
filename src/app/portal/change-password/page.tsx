'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ChangePasswordPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/portal/profile');
  }, [router]);

  return (
    <div style={{ padding: '3rem', textAlign: 'center', color: '#00e5ff', fontFamily: 'monospace' }}>
      Redirecting to Profile...
    </div>
  );
}
