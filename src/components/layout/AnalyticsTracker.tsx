'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { trackEvent } from '@/lib/analytics';

export function AnalyticsTracker() {
  const pathname = usePathname();
  /** Última ruta por la que ya se envió page_view (evita doble envío con StrictMode en dev). */
  const lastTrackedPathname = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || pathname.startsWith('/admin')) return;
    if (lastTrackedPathname.current === pathname) return;
    lastTrackedPathname.current = pathname;
    trackEvent('page_view');
  }, [pathname]);

  return null;
}
