'use client';

import { useState, useMemo } from 'react';
import useSWR from 'swr';
import { RefreshCw } from 'lucide-react';
import type { OrderStatus } from '@/lib/types';
import { adminApi } from '@/lib/adminApi';
import { Button } from '@/components/ui/Button';
import { OrdersTable } from '@/components/admin/OrdersTable';
import { OrdersTableSkeleton } from '@/components/admin/OrdersTableSkeleton';
import { OrderDetailModal } from '@/components/admin/OrderDetailModal';
import { AdminSearchBar } from '@/components/admin/AdminSearchBar';
import { Select } from '@/components/ui/Select';
import { AdminPageHeader } from '@/components/admin/AdminUI';

const LIMIT = 20;

const STATUS_OPTIONS: { value: OrderStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'pending', label: 'Pendientes' },
  { value: 'paid', label: 'Pagados' },
  { value: 'preparing', label: 'En preparación' },
  { value: 'delivered', label: 'Entregados' },
  { value: 'cancelled', label: 'Cancelados' },
];

export default function AdminOrdersPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [detailOrderId, setDetailOrderId] = useState<string | null>(null);

  const { data, error, isLoading, mutate } = useSWR(
    ['admin-orders', page, statusFilter],
    () =>
      adminApi.getAllOrders({
        page,
        limit: LIMIT,
        status: statusFilter === 'all' ? undefined : statusFilter,
      }),
    { revalidateOnFocus: false }
  );

  const orders = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;
  const total = data?.total ?? 0;

  const filteredOrders = useMemo(() => {
    if (!search.trim()) return orders;
    const lowerSearch = search.toLowerCase();
    return orders.filter(
      (order) =>
        order.orderNumber.toLowerCase().includes(lowerSearch) ||
        order.customerName.toLowerCase().includes(lowerSearch)
    );
  }, [orders, search]);

  const handleViewDetail = (orderId: string) => {
    setDetailOrderId(orderId);
  };

  const handleStatusChange = () => {
    mutate();
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Pedidos"
        subtitle={total > 0 ? `${total} pedidos en total` : undefined}
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="w-full sm:w-44">
          <Select
            value={statusFilter}
            onChange={(v) => {
              setStatusFilter(v as OrderStatus | 'all');
              setPage(1);
            }}
            options={STATUS_OPTIONS.map((opt) => ({
              value: opt.value,
              label: opt.label,
            }))}
          />
        </div>
        <AdminSearchBar
          value={search}
          onChange={setSearch}
          placeholder="Buscar por número o cliente..."
        />
        <Button
          variant="secondary"
          onClick={() => mutate()}
          className="flex items-center gap-2"
        >
          <RefreshCw className="size-4" />
          Refrescar
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-400/30 bg-red-600/10 p-4 text-red-400">
          <p>Error al cargar pedidos.</p>
          <Button variant="secondary" className="mt-3" onClick={() => mutate()}>
            Reintentar
          </Button>
        </div>
      )}

      {isLoading && <OrdersTableSkeleton />}

      {!isLoading && !error && filteredOrders.length === 0 && (
        <div className="rounded-lg border border-gold-300/20 bg-dark-800 p-12 text-center">
          <p className="text-white/70">
            {orders.length === 0
              ? 'No hay pedidos.'
              : 'No se encontraron pedidos con ese filtro.'}
          </p>
        </div>
      )}

      {!isLoading && !error && filteredOrders.length > 0 && (
        <>
          <OrdersTable
            orders={filteredOrders}
            onViewDetail={handleViewDetail}
            onStatusChange={handleStatusChange}
          />

          {totalPages > 1 && (
            <div className="flex items-center justify-between rounded-lg border border-gold-300/20 bg-dark-800 px-4 py-3">
              <p className="text-sm text-white/70">
                Página {page} de {totalPages} ({total} pedidos)
              </p>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  className="py-2 text-sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                >
                  Anterior
                </Button>
                <Button
                  variant="secondary"
                  className="py-2 text-sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      <OrderDetailModal
        isOpen={!!detailOrderId}
        onClose={() => setDetailOrderId(null)}
        orderId={detailOrderId}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
