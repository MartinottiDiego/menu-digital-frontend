'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import useSWR from 'swr';
import { adminApi } from '@/lib/adminApi';
import { formatPrice } from '@/lib/utils';
import { OrderStatusDropdown } from './OrderStatusDropdown';

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string | null;
  onStatusChange?: () => void;
}

export function OrderDetailModal({
  isOpen,
  onClose,
  orderId,
  onStatusChange,
}: OrderDetailModalProps) {
  const { data: order, error, mutate: mutateOrder } = useSWR(
    isOpen && orderId ? ['order-detail', orderId] : null,
    () => adminApi.getOrderById(orderId!),
    { revalidateOnFocus: false }
  );

  const handleStatusChange = async () => {
    await mutateOrder();
    onStatusChange?.();
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleString('es-AR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            aria-hidden
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 top-1/2 z-[60] max-h-[90vh] w-[calc(100%-2rem)] max-w-[800px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl border border-gold-300/30 bg-dark-800 p-6 shadow-2xl"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 rounded-lg p-2 text-white/70 transition-colors hover:bg-dark-700 hover:text-white"
              aria-label="Cerrar"
            >
              <X className="size-5" />
            </button>

            {error && (
              <p className="py-8 text-center text-red-400">
                Error al cargar el pedido.
              </p>
            )}

            {!order && !error && (
              <div className="flex items-center justify-center py-12">
                <div className="size-8 animate-spin rounded-full border-2 border-gold-300 border-t-transparent" />
              </div>
            )}

            {order && (
              <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gold-200">
                      {order.orderNumber}
                    </h2>
                    <p className="mt-1 text-sm text-white/60">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <OrderStatusDropdown
                    currentStatus={order.status}
                    orderId={order._id}
                    deliveryMethod={order.deliveryMethod}
                    onStatusChange={handleStatusChange}
                  />
                </div>

                {/* Cliente */}
                <div className="rounded-lg bg-dark-700/50 p-4">
                  <h3 className="mb-3 font-semibold text-gold-200">
                    Información del cliente
                  </h3>
                  <div className="grid gap-2 text-sm sm:grid-cols-2">
                    <div>
                      <span className="text-white/50">Nombre:</span>{' '}
                      <span className="text-white">{order.customerName}</span>
                    </div>
                    <div>
                      <span className="text-white/50">Teléfono:</span>{' '}
                      <span className="text-white">{order.customerPhone}</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-white/50">Entrega:</span>{' '}
                      <span className="font-semibold text-gold-200">
                        {order.deliveryMethod === 'pickup'
                          ? '🏪 Retiro en el local'
                          : '🚚 Delivery a domicilio'}
                      </span>
                    </div>
                    {order.customerAddress && (
                      <div className="sm:col-span-2">
                        <span className="text-white/50">Dirección:</span>{' '}
                        <span className="text-white">
                          {order.customerAddress}
                        </span>
                      </div>
                    )}
                    {order.customerEmail && (
                      <div>
                        <span className="text-white/50">Email:</span>{' '}
                        <span className="text-white">
                          {order.customerEmail}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Items */}
                <div className="rounded-lg bg-dark-700/50 p-4">
                  <h3 className="mb-3 font-semibold text-gold-200">
                    Detalle del pedido
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/10 text-left text-white/70">
                          <th className="pb-2 pr-4 font-medium">Producto</th>
                          <th className="pb-2 px-4 font-medium text-right">
                            Cant.
                          </th>
                          <th className="pb-2 px-4 font-medium text-right">
                            P. unit.
                          </th>
                          <th className="pb-2 pl-4 font-medium text-right">
                            Subtotal
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item, i) => (
                          <tr
                            key={i}
                            className="border-b border-white/5"
                          >
                            <td className="py-3 pr-4 text-white">
                              {item.product?.name ?? item.name ?? 'Ítem'}
                              {item.combo ? (
                                <span className="block text-xs text-gold-200/70">
                                  Combo
                                </span>
                              ) : null}
                              {item.weightKg ? (
                                <span className="block text-xs text-white/50">
                                  {item.weightKg} kg c/u · por peso
                                </span>
                              ) : null}
                            </td>
                            <td className="py-3 px-4 text-right text-white/80">
                              {item.quantity}
                            </td>
                            <td className="py-3 px-4 text-right text-white/80">
                              {formatPrice(item.priceAtOrder)}
                              {item.weightKg ? '/kg' : ''}
                            </td>
                            <td className="py-3 pl-4 text-right font-medium text-white">
                              {formatPrice(
                                item.lineTotal ?? item.quantity * item.priceAtOrder
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-end">
                  <div className="rounded-lg border border-gold-300/20 bg-dark-700/50 px-6 py-4">
                    <span className="text-lg font-bold text-gold-200">
                      Total: {formatPrice(order.total)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
