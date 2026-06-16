'use client';

import { Suspense } from 'react';
import { PageTransition } from '@/components/layout/PageTransition';
import { MenuContent } from './MenuContent';

function MenuSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 h-32 animate-pulse rounded-xl bg-dark-800" />
      <div className="mb-6 flex gap-4">
        <div className="h-12 flex-1 animate-pulse rounded-xl bg-dark-800" />
        <div className="h-12 w-48 animate-pulse rounded-xl bg-dark-800" />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-72 animate-pulse rounded-xl bg-dark-800" />
        ))}
      </div>
    </div>
  );
}

export default function MenuPage() {
  return (
    <PageTransition>
      <main className="min-h-screen bg-dark-900">
        <Suspense fallback={<MenuSkeleton />}>
          <MenuContent />
        </Suspense>
      </main>
    </PageTransition>
  );
}
