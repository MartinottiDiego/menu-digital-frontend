'use client';

import { useState, useMemo } from 'react';
import useSWR from 'swr';
import type { Period } from '@/lib/dashboard-utils';
import { adminApi } from '@/lib/adminApi';
import { fmtPrice, cn } from '@/lib/utils';
import { getDateRange } from '@/lib/dashboard-utils';
import { Icon } from '@/components/ui/Icons';
import { AdminPageHeader, StatCard } from '@/components/admin/AdminUI';
import { LowStockTable } from '@/components/admin/LowStockTable';
import { PendingOrdersList } from '@/components/admin/PendingOrdersList';
import { OrderDetailModal } from '@/components/admin/OrderDetailModal';
import type { Order, Payment, Product } from '@/lib/types';

const PERIOD_OPTIONS: { value: Period; label: string }[] = [
  { value: 'today', label: 'Hoy' },
  { value: 'week', label: 'Semana' },
  { value: 'month', label: 'Mes' },
];

function getPaymentAmount(payment: Payment): number {
  return payment.mpResponse?.transaction_amount ?? 0;
}

export default function DashboardPage() {
  const [period, setPeriod] = useState<Period>('today');
  const [detailOrderId, setDetailOrderId] = useState<string | null>(null);

  const { start, end } = useMemo(() => getDateRange(period), [period]);

  const { data: ordersData, mutate: mutateOrders } = useSWR(
    'dashboard-orders',
    () => adminApi.getAllOrders({ limit: 200 }),
    { revalidateOnFocus: false, refreshInterval: 60000 }
  );
  const { data: paymentsData, mutate: mutatePayments } = useSWR(
    'dashboard-payments',
    () => adminApi.getAllPayments({ limit: 500 }),
    { revalidateOnFocus: false, refreshInterval: 60000 }
  );
  const { data: productsData } = useSWR(
    'dashboard-products',
    () => adminApi.getAllProducts({ limit: 200, includeInactive: false }),
    { revalidateOnFocus: false }
  );

  const isMetricsLoading = !ordersData || !paymentsData;
  const orders = ordersData?.data ?? [];
  const payments = paymentsData?.data ?? [];
  const products = productsData?.data ?? [];

  const ordersInPeriod = useMemo(
    () => orders.filter((o) => {
      const d = new Date(o.createdAt);
      return d >= start && d <= end;
    }),
    [orders, start, end]
  );

  const approvedPaymentsInPeriod = useMemo(
    () => payments.filter((p) => {
      const d = new Date(p.createdAt);
      return p.status === 'approved' && d >= start && d <= end;
    }),
    [payments, start, end]
  );

  const totalSales = useMemo(
    () => approvedPaymentsInPeriod.reduce((s, p) => s + getPaymentAmount(p), 0),
    [approvedPaymentsInPeriod]
  );
  const averageTicket =
    approvedPaymentsInPeriod.length > 0
      ? totalSales / approvedPaymentsInPeriod.length
      : 0;

  const lowStockProducts = useMemo(
    () =>
      (products as Product[])
        .filter((p) => p.stock < 10 && p.active)
        .sort((a, b) => a.stock - b.stock)
        .slice(0, 5),
    [products]
  );
  const pendingOrders = useMemo(
    () =>
      (orders as Order[])
        .filter((o) => o.status === 'pending' || o.status === 'paid')
        // A prueba de NaN: si una fecha viene inválida, no rompe el orden (un
        // comparador que devuelve NaN deja el array desordenado).
        .sort(
          (a, b) =>
            (new Date(b.createdAt).getTime() || 0) -
            (new Date(a.createdAt).getTime() || 0)
        )
        .slice(0, 10),
    [orders]
  );

  const lowStockCount = lowStockProducts.length;

  return (
    <div>
      <AdminPageHeader
        title="Dashboard"
        subtitle="Resumen de tu carnicería"
        actions={
          <>
            <div
              className="flex rounded-[10px] p-1"
              style={{ background: 'var(--panel)', boxShadow: 'inset 0 0 0 1px var(--line)' }}
            >
              {PERIOD_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setPeriod(opt.value)}
                  className={cn(
                    'rounded-[7px] px-3 py-2 text-[13px] font-bold transition-colors',
                    period === opt.value ? 'text-[#2a1c08]' : 'text-tan'
                  )}
                  style={period === opt.value ? { background: 'var(--gold)' } : undefined}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                mutateOrders();
                mutatePayments();
              }}
              className="icon-btn"
              style={{ boxShadow: 'inset 0 0 0 1px var(--line)' }}
              aria-label="Refrescar"
            >
              <Icon.bell />
            </button>
          </>
        }
      />

      {/* Métricas */}
      <div className="mb-[22px] grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-4">
        {isMetricsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-[140px] animate-pulse rounded-[16px]"
              style={{ background: 'var(--panel)' }}
            />
          ))
        ) : (
          <>
            <StatCard icon="clipboard" value={ordersInPeriod.length} label="Pedidos del período" />
            <StatCard icon="dollar" value={fmtPrice(totalSales)} label="Ventas aprobadas" />
            <StatCard icon="trending" value={fmtPrice(averageTicket)} label="Ticket promedio" />
            <StatCard
              icon="box"
              value={lowStockCount}
              label="Stock bajo (< 10)"
              delta={lowStockCount > 0 ? 'Revisar' : 'OK'}
              up={lowStockCount === 0}
            />
          </>
        )}
      </div>

      {/* Tablas */}
      <div className="grid grid-cols-1 gap-[18px] lg:grid-cols-2">
        <LowStockTable products={lowStockProducts} />
        <PendingOrdersList orders={pendingOrders} onViewOrder={setDetailOrderId} />
      </div>

      <OrderDetailModal
        isOpen={!!detailOrderId}
        onClose={() => setDetailOrderId(null)}
        orderId={detailOrderId}
        onStatusChange={() => mutateOrders()}
      />
    </div>
  );
}
