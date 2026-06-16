'use client';

import { Eye } from 'lucide-react';
import type { Order } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { OrderStatusDropdown } from './OrderStatusDropdown';

interface OrdersTableProps {
  orders: Order[];
  onViewDetail: (orderId: string) => void;
  onStatusChange: () => void;
}

function getTotalItems(order: Order): number {
  return order.items.reduce((sum, item) => sum + item.quantity, 0);
}

export function OrdersTable({
  orders,
  onViewDetail,
  onStatusChange,
}: OrdersTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gold-300/20 bg-dark-800">
      {/* Desktop table */}
      <table className="hidden w-full min-w-[700px] md:table">
        <thead>
          <tr className="border-b border-white/10 bg-dark-700">
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gold-200">
              # Orden
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gold-200">
              Cliente
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gold-200">
              Items
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gold-200">
              Total
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gold-200">
              Estado
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gold-200">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr
              key={order._id}
              className="border-b border-white/10 transition-colors hover:bg-dark-700/50"
            >
              <td className="px-4 py-3 font-mono text-sm text-gold-200">
                {order.orderNumber}
              </td>
              <td className="px-4 py-3">
                <div>
                  <span className="font-medium text-white">
                    {order.customerName}
                  </span>
                  <span className="block text-sm text-white/70">
                    {order.customerPhone}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3 text-white/80">
                {getTotalItems(order)} items
              </td>
              <td className="px-4 py-3 font-bold text-gold-100">
                {formatPrice(order.total)}
              </td>
              <td className="px-4 py-3">
                <OrderStatusDropdown
                  currentStatus={order.status}
                  orderId={order._id}
                  onStatusChange={onStatusChange}
                />
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  type="button"
                  onClick={() => onViewDetail(order._id)}
                  className="rounded-lg p-2 text-white/70 transition-colors hover:bg-gold-300/10 hover:text-gold-200"
                  aria-label="Ver detalle"
                >
                  <Eye className="size-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile cards */}
      <div className="space-y-4 p-4 md:hidden">
        {orders.map((order) => (
          <div
            key={order._id}
            className="rounded-lg border border-white/10 bg-dark-700/50 p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <span className="block truncate font-mono text-sm text-gold-200">
                  {order.orderNumber}
                </span>
                <span className="block font-medium text-white">
                  {order.customerName}
                </span>
              </div>
              <OrderStatusDropdown
                currentStatus={order.status}
                orderId={order._id}
                onStatusChange={onStatusChange}
              />
            </div>
            <div className="mt-3 flex items-center justify-between text-sm text-white/70">
              <span>{getTotalItems(order)} items</span>
              <span className="font-bold text-gold-100">
                {formatPrice(order.total)}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onViewDetail(order._id)}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-gold-300/30 py-2 text-gold-200 transition-colors hover:bg-gold-300/10"
            >
              <Eye className="size-4" />
              Ver detalle
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
