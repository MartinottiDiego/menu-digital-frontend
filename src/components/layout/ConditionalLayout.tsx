'use client';

import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { Footer } from './Footer';
import { MobileBottomNav } from './MobileBottomNav';

export function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // Rutas "bare": traen su propio chrome (admin) o un header propio (checkout).
  const isBare =
    pathname?.startsWith('/admin') || pathname === '/checkout';

  if (isBare) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
