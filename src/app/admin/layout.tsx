'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasHydrated = useAuthStore((s) => s._hasHydrated);

  useEffect(() => {
    if (pathname === '/admin/login') return;
    if (!hasHydrated) return;
    if (!isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, pathname, router, hasHydrated]);

  if (pathname === '/admin/login') {
    return <div className="min-h-screen bg-bg">{children}</div>;
  }

  if (!hasHydrated || !isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-ink text-cream lg:flex-row">
      <AdminSidebar />
      <main className="min-w-0 flex-1 px-5 py-6 lg:px-9 lg:py-8">{children}</main>
    </div>
  );
}
