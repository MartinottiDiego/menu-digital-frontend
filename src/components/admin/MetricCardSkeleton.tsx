'use client';

import { Skeleton } from '@/components/ui/Skeleton';

export function MetricCardSkeleton() {
  return (
    <div className="rounded-xl border border-gold-300/20 bg-dark-800 p-6">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="mt-3 h-9 w-20" />
      <Skeleton className="mt-2 h-3 w-32" />
    </div>
  );
}
