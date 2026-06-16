'use client';

import type { OrderStatus } from '@/lib/types';

const statusColors: Record<OrderStatus, string> = {
  pending: 'border-orange-400/30 bg-orange-600/20 text-orange-400',
  paid: 'border-blue-400/30 bg-blue-600/20 text-blue-400',
  preparing: 'border-purple-400/30 bg-purple-600/20 text-purple-400',
  delivered: 'border-green-400/30 bg-green-600/20 text-green-400',
  cancelled: 'border-red-400/30 bg-red-600/20 text-red-400',
};

const statusLabels: Record<OrderStatus, string> = {
  pending: 'Pendiente',
  paid: 'Pagado',
  preparing: 'En preparación',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${statusColors[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}
