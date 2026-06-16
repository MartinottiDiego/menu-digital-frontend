'use client';

import { motion } from 'framer-motion';
import type { Order } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { OrderStatusBadge } from './OrderStatusBadge';

interface PendingOrdersListProps {
  orders: Order[];
  onViewOrder: (orderId: string) => void;
}

export function PendingOrdersList({
  orders,
  onViewOrder,
}: PendingOrdersListProps) {
  if (orders.length === 0) {
    return (
      <div className="rounded-xl border border-gold-300/20 bg-dark-800 p-6">
        <h3 className="mb-4 font-semibold text-gold-200">
          Pedidos pendientes
        </h3>
        <p className="text-sm text-white/50">
          No hay pedidos pendientes de pago o preparación.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gold-300/20 bg-dark-800 overflow-hidden">
      <div className="border-b border-white/10 bg-dark-700/50 px-4 py-3">
        <h3 className="font-semibold text-gold-200">
          Pedidos pendientes ({orders.length})
        </h3>
      </div>
      <div className="max-h-[400px] overflow-y-auto">
        {orders.map((order) => (
          <motion.button
            key={order._id}
            type="button"
            onClick={() => onViewOrder(order._id)}
            className="flex w-full items-center justify-between gap-3 border-b border-white/5 px-4 py-3 text-left transition-colors last:border-0 hover:bg-dark-700/50"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate font-mono text-sm text-gold-200">
                {order.orderNumber}
              </p>
              <p className="truncate text-sm text-white/80">
                {order.customerName}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <span className="font-semibold text-gold-100">
                {formatPrice(order.total)}
              </span>
              <OrderStatusBadge status={order.status} />
              <span className="text-xs text-gold-200">Ver</span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
