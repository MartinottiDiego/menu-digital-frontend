import { STATUS_META } from '@/lib/brand';

/** Píldora de estado de pedido (color/label desde STATUS_META). */
export function StatusPill({ status }: { status: string }) {
  const meta = STATUS_META[status] ?? STATUS_META.pending;
  return (
    <span
      className="inline-flex items-center rounded-full px-[11px] py-[5px] text-[11.5px] font-extrabold"
      style={{ color: meta.color, background: meta.bg, letterSpacing: '.02em' }}
    >
      {meta.label}
    </span>
  );
}
