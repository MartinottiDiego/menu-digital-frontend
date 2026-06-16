'use client';

import { Skeleton } from '@/components/ui/Skeleton';

export function CategoriesTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-gold-300/20 bg-dark-800">
      <div className="grid grid-cols-[1fr_2fr_100px_100px] gap-4 border-b border-white/10 bg-dark-700 px-4 py-3 md:grid-cols-4">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-16" />
      </div>
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-[1fr_2fr_100px_100px] gap-4 border-b border-white/10 px-4 py-4 md:grid-cols-4"
        >
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-48" />
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
