import { cn } from '@/lib/utils';

/**
 * Logo de marca: "MIINUTA." (Zilla Slab) con subtítulo "CARNES".
 * Replica el bloque `.logo` del sistema visual.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('logo', className)}>
      <div className="word">
        MIINUTA<span className="dot">.</span>
      </div>
      <div className="sub">CARNES</div>
    </div>
  );
}
