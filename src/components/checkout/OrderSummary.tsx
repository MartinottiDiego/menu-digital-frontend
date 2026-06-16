'use client';

import { cartLineTotal, cartItemKey, type CartItem } from '@/store/cart';
import type { DeliveryMethod } from '@/lib/types';
import { fmtPrice } from '@/lib/utils';

function itemLabel(item: CartItem): string {
  const kind = item.kind ?? 'unit';
  if (kind === 'unit') return `${item.quantity} u.`;
  if (kind === 'fixed') return `${item.quantity} × ${item.weightKg ?? 0} kg`;
  return `${item.weightKg ?? 0} kg`;
}

interface OrderSummaryProps {
  items: CartItem[];
  total: number;
  deliveryMethod?: DeliveryMethod;
}

export function OrderSummary({ items, total, deliveryMethod = 'delivery' }: OrderSummaryProps) {
  const isPickup = deliveryMethod === 'pickup';
  return (
    <div
      className="rounded-[18px] p-6"
      style={{
        background: 'linear-gradient(180deg,var(--panel),var(--card-b))',
        boxShadow: 'inset 0 0 0 1px var(--line)',
      }}
    >
      <h3 className="font-display mb-4 text-[22px] text-cream">Tu pedido</h3>
      <div className="flex max-h-[320px] flex-col overflow-y-auto">
        {items.map((item) => (
          <div
            key={cartItemKey(item)}
            className="flex items-center gap-3 py-[11px]"
            style={{ boxShadow: 'inset 0 -1px 0 var(--line-soft)' }}
          >
            <div className="h-[46px] w-[46px] shrink-0 overflow-hidden rounded-[10px]">
              {item.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[13.5px] font-bold text-cream">{item.name}</div>
              <div className="text-[12px] text-tan-dim">{itemLabel(item)}</div>
            </div>
            <span className="tnum text-[14px] font-extrabold text-tan">
              {fmtPrice(cartLineTotal(item))}
            </span>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-[9px] pt-4">
        <div className="flex justify-between text-[13.5px] text-tan">
          <span>Subtotal</span>
          <span className="tnum">{fmtPrice(total)}</span>
        </div>
        <div className="flex justify-between text-[13.5px] text-tan">
          <span>{isPickup ? 'Retiro en el local' : 'Envío'}</span>
          <span className="text-gold">{isPickup ? 'Gratis' : 'A confirmar'}</span>
        </div>
      </div>
      <div
        className="my-4 flex items-center justify-between pt-3.5"
        style={{ boxShadow: 'inset 0 1px 0 var(--line)' }}
      >
        <span className="eyebrow">Total</span>
        <span className="price" style={{ fontSize: 28 }}>
          {fmtPrice(total)}
        </span>
      </div>
    </div>
  );
}
