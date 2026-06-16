'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import type { OrderStatus, DeliveryMethod } from '@/lib/types';
import { adminApi } from '@/lib/adminApi';
import { useToast } from '@/hooks/useToast';
import { OrderStatusBadge } from './OrderStatusBadge';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

const statusLabels: Record<OrderStatus, string> = {
  pending: 'Pendiente',
  paid: 'Pagado',
  preparing: 'En preparación',
  on_the_way: 'En camino',
  ready_for_pickup: 'Listo para retirar',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
  failed: 'Fallido',
};

/** Próximos estados posibles. En "preparación" depende del método de entrega. */
function nextOptions(
  status: OrderStatus,
  deliveryMethod?: DeliveryMethod,
): OrderStatus[] {
  switch (status) {
    case 'pending':
      return ['paid', 'cancelled'];
    case 'paid':
      return ['preparing', 'cancelled'];
    case 'preparing':
      return [
        deliveryMethod === 'pickup' ? 'ready_for_pickup' : 'on_the_way',
        'cancelled',
      ];
    case 'on_the_way':
    case 'ready_for_pickup':
      return ['delivered', 'cancelled'];
    default:
      return [];
  }
}

interface OrderStatusDropdownProps {
  currentStatus: OrderStatus;
  orderId: string;
  onStatusChange: () => void;
  deliveryMethod?: DeliveryMethod;
}

export function OrderStatusDropdown({
  currentStatus,
  orderId,
  onStatusChange,
  deliveryMethod,
}: OrderStatusDropdownProps) {
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<OrderStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  // Candado sincrónico: evita que clicks rápidos disparen varios updates.
  const submittingRef = useRef(false);

  const options = nextOptions(currentStatus, deliveryMethod);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (newStatus: OrderStatus) => {
    setPendingStatus(newStatus);
    setIsOpen(false);
  };

  const handleConfirmChange = async () => {
    // El candado se chequea/activa de forma sincrónica: clicks repetidos
    // mientras el primero está en vuelo se descartan (un solo update/toast).
    if (!pendingStatus || submittingRef.current) return;
    submittingRef.current = true;
    setLoading(true);
    try {
      await adminApi.updateOrderStatus(orderId, pendingStatus);
      toast.success('Estado actualizado');
      setPendingStatus(null);
      onStatusChange();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Error al actualizar estado'
      );
    } finally {
      submittingRef.current = false;
      setLoading(false);
    }
  };

  if (options.length === 0) {
    return <OrderStatusBadge status={currentStatus} />;
  }

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 rounded-lg p-1 transition-colors hover:bg-dark-600"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <OrderStatusBadge status={currentStatus} />
          <ChevronDown
            className={`size-4 text-white/70 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {isOpen && (
          <div className="absolute bottom-full left-0 z-10 mb-1 min-w-[160px] max-h-[min(200px,50vh)] overflow-y-auto rounded-lg border border-gold-300/20 bg-dark-800 py-1 shadow-xl [transform-origin:bottom] md:bottom-auto md:top-full md:mb-0 md:mt-1">
            {options.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => handleSelect(status)}
                className="w-full px-4 py-2 text-left text-sm text-white transition-colors hover:bg-dark-700"
              >
                {statusLabels[status]}
              </button>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!pendingStatus}
        onClose={() => setPendingStatus(null)}
        onConfirm={handleConfirmChange}
        title="¿Cambiar estado?"
        message={
          pendingStatus
            ? `¿Cambiar el estado del pedido a "${statusLabels[pendingStatus]}"?`
            : ''
        }
        confirmText="Confirmar"
      />
    </>
  );
}
