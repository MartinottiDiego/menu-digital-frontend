'use client';

import { Skeleton } from '@/components/ui/Skeleton';

export function OrdersTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-gold-300/20 bg-dark-800">
      <div className="grid grid-cols-[1fr_1fr_80px_80px_100px_60px] gap-4 border-b border-white/10 bg-dark-700 px-4 py-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-14" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-12" />
      </div>
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-[1fr_1fr_80px_80px_100px_60px] gap-4 border-b border-white/10 px-4 py-4"
        >
          <Skeleton className="h-4 w-36" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="size-9 rounded-lg" />
        </div>
      ))}
    </div>
  );
}
