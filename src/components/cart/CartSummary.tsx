'use client';

import { formatPrice } from '@/lib/utils';

interface CartSummaryProps {
  subtotal: number;
  total: number;
}

export function CartSummary({ subtotal, total }: CartSummaryProps) {
  return (
    <div className="rounded-xl border border-gold-300/20 bg-dark-800 p-6">
      <h3 className="text-lg font-semibold text-gold-200">Resumen del pedido</h3>
      <div className="mt-4 space-y-2">
        <div className="flex justify-between text-white/80">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between border-t border-gold-300/20 pt-4">
          <span className="text-xl font-semibold text-white">Total</span>
          <span className="text-2xl font-bold text-gold-100">
            {formatPrice(total)}
          </span>
        </div>
      </div>
    </div>
  );
}
