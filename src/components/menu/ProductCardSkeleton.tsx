import { Skeleton } from '@/components/ui/Skeleton';

export function ProductCardSkeleton() {
  return (
    <div className="flex min-h-[300px] flex-col rounded-xl border border-gold-300/20 bg-dark-800 p-3 sm:min-h-[360px] sm:p-4 md:min-h-[400px]">
      <Skeleton className="aspect-[4/3] w-full shrink-0" />
      <div className="mt-3 flex min-h-0 flex-1 flex-col">
        <Skeleton className="h-5 w-3/4 shrink-0" />
        <Skeleton className="mt-2 h-4 w-full shrink-0" />
        <Skeleton className="mt-1 h-4 w-2/3 shrink-0" />
        <div className="mt-2 min-h-[28px] shrink-0">
          <Skeleton className="h-6 w-1/3" />
        </div>
        <div className="min-h-0 flex-1" />
        <Skeleton className="mt-4 h-11 w-full shrink-0" />
      </div>
    </div>
  );
}
