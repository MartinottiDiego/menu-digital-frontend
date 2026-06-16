'use client';

import { Skeleton } from '@/components/ui/Skeleton';

export function ProductsTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-gold-300/20 bg-dark-800">
      <div className="grid grid-cols-[50px_1fr_120px_80px_80px_100px_100px] gap-4 border-b border-white/10 bg-dark-700 px-4 py-3 md:grid-cols-6">
        <Skeleton className="h-4 w-10" />
        <Skeleton className="h-4 flex-1" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-14" />
        <Skeleton className="h-4 w-16" />
      </div>
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-[50px_1fr_120px_80px_80px_100px_100px] gap-4 border-b border-white/10 px-4 py-4 md:grid-cols-6"
        >
          <Skeleton className="size-[50px] rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-5 w-16 rounded-full" />
          <div className="flex gap-2">
            <Skeleton className="size-9 rounded-lg" />
            <Skeleton className="size-9 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}
