'use client';

import { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  RefreshCw,
  Eye,
  Users,
  Layers,
  MessageCircle,
  BarChart3,
} from 'lucide-react';
import type { AnalyticsPeriod } from '@/lib/types';
import { useAnalytics } from '@/hooks/useAnalytics';
import { MetricCard } from '@/components/admin/MetricCard';
import { MetricCardSkeleton } from '@/components/admin/MetricCardSkeleton';
import { Skeleton } from '@/components/ui/Skeleton';

const PERIOD_OPTIONS: { value: AnalyticsPeriod; label: string }[] = [
  { value: 'week', label: '7 días' },
  { value: 'month', label: '30 días' },
  { value: 'year', label: '1 año' },
];

const CHART_LINE_VISITS = '#f4c430';
const CHART_LINE_UNIQUE = '#d4af37';
const PIE_COLORS = ['#f4c430', '#d4af37', '#ffe5b4', '#22c55e', '#64748b'];

const EVENT_LABELS: Record<string, string> = {
  page_view: 'Vista de página',
  whatsapp_click: 'Click en WhatsApp',
  add_to_cart: 'Agregado al carrito',
  product_view: 'Vista de producto',
  checkout_started: 'Inicio de checkout',
  payment_success: 'Pago exitoso',
  payment_failure: 'Pago fallido',
};

function formatChartDate(isoDate: string): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  if (!y || !m || !d) return isoDate;
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
  });
}

function deviceLabel(device: string): string {
  const key = device.toLowerCase();
  if (key === 'mobile') return 'Móvil';
  if (key === 'tablet') return 'Tablet';
  if (key === 'desktop') return 'Escritorio';
  return device;
}

export default function AdminAnalyticsPage() {
  const [period, setPeriod] = useState<AnalyticsPeriod>('week');
  const {
    overview,
    dailyVisits,
    byPage,
    devices,
    eventsSummary,
    isLoading,
    error,
    refetch,
  } = useAnalytics(period);

  const topPages = useMemo(() => {
    const list = byPage ?? [];
    return [...list]
      .sort((a, b) => b.visits - a.visits)
      .slice(0, 10);
  }, [byPage]);

  const lineData = useMemo(() => {
    const rows = dailyVisits ?? [];
    return rows.map((row) => ({
      ...row,
      label: formatChartDate(row.date),
    }));
  }, [dailyVisits]);

  const dailyVisitsCount = (dailyVisits ?? []).length;
  const showLineDots = dailyVisitsCount <= 3;

  const pieData = useMemo(() => {
    const list = devices ?? [];
    return list.map((d) => ({
      name: deviceLabel(d.device),
      value: d.count,
      raw: d.device,
    }));
  }, [devices]);

  const topEvents = useMemo(() => {
    const list = eventsSummary ?? [];
    return [...list].sort((a, b) => b.count - a.count).slice(0, 10);
  }, [eventsSummary]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gold-200">Analíticas</h1>
          <p className="mt-1 text-sm text-white/60">
            Tráfico y comportamiento del sitio público
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-gold-300/20 bg-dark-800 p-1">
            {PERIOD_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setPeriod(opt.value)}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  period === opt.value
                    ? 'bg-gold-200 text-dark-900'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-lg border border-gold-300/20 bg-dark-800 p-2 text-white/70 transition-colors hover:bg-dark-700 hover:text-gold-200"
            aria-label="Refrescar"
          >
            <RefreshCw className="size-5" />
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-400/30 bg-dark-800 p-6">
          <p className="text-sm text-red-400">{error}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 rounded-lg border border-gold-300/30 bg-dark-700 px-4 py-2 text-sm font-medium text-gold-200 transition-colors hover:bg-dark-600"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Metric cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          <>
            {Array.from({ length: 4 }).map((_, i) => (
              <MetricCardSkeleton key={i} />
            ))}
          </>
        ) : overview ? (
          <>
            <MetricCard
              title="Páginas visitadas"
              value={overview.totalVisits}
              subtitle="En el período seleccionado"
              icon={<Eye className="size-8 text-gold-200/50" />}
            />
            <MetricCard
              title="Visitantes únicos"
              value={overview.uniqueVisitors}
              subtitle="Dispositivos / cookies"
              icon={<Users className="size-8 text-gold-200/50" />}
            />
            <MetricCard
              title="Sesiones únicas"
              value={overview.uniqueSessions}
              subtitle="Sesiones registradas"
              icon={<Layers className="size-8 text-gold-200/50" />}
            />
            <MetricCard
              title="Clicks en WhatsApp"
              value={overview.whatsappClicks}
              subtitle="Enlaces al chat"
              icon={<MessageCircle className="size-8 text-gold-200/50" />}
            />
          </>
        ) : !error ? (
          <p className="col-span-full text-sm text-white/50">
            No hay datos de resumen para mostrar.
          </p>
        ) : null}
      </div>

      {/* Line chart */}
      <div className="rounded-xl border border-gold-300/20 bg-dark-800 p-6">
        <div className="mb-4 flex items-center gap-2">
          <BarChart3 className="size-5 text-gold-200/80" />
          <h2 className="text-lg font-semibold text-gold-200">
            Visitas por día
          </h2>
        </div>
        {isLoading ? (
          <div className="space-y-3" style={{ height: 300 }}>
            <Skeleton className="h-[260px] w-full" />
          </div>
        ) : lineData.length === 0 ? (
          <p className="py-12 text-center text-sm text-white/50">
            No hay datos de visitas diarias en este período.
          </p>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                <XAxis
                  dataKey="label"
                  tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
                  stroke="#404040"
                />
                <YAxis
                  tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
                  stroke="#404040"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#f4c430' }}
                />
                <Line
                  type="monotone"
                  dataKey="visits"
                  name="Visitas"
                  stroke={CHART_LINE_VISITS}
                  strokeWidth={2}
                  dot={showLineDots}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="uniqueVisitors"
                  name="Visitantes únicos"
                  stroke={CHART_LINE_UNIQUE}
                  strokeWidth={2}
                  dot={showLineDots}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
            {dailyVisitsCount === 1 && (
              <p className="mt-3 text-center text-xs text-white/45">
                Se necesitan al menos 2 días de datos para mostrar la línea.
              </p>
            )}
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Pie chart */}
        <div className="rounded-xl border border-gold-300/20 bg-dark-800 p-6">
          <h2 className="mb-4 text-lg font-semibold text-gold-200">
            Dispositivos
          </h2>
          {isLoading ? (
            <div className="flex h-[300px] items-center justify-center">
              <Skeleton className="h-56 w-56 rounded-full" />
            </div>
          ) : pieData.length === 0 ? (
            <p className="py-12 text-center text-sm text-white/50">
              No hay datos de dispositivos en este período.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) =>
                    `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                  }
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={entry.raw}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    borderRadius: '8px',
                  }}
                />
                <Legend
                  wrapperStyle={{ color: 'rgba(255,255,255,0.8)' }}
                  formatter={(value) => (
                    <span className="text-sm text-white/80">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Events summary */}
        <div className="rounded-xl border border-gold-300/20 bg-dark-800 p-6">
          <h2 className="mb-4 text-lg font-semibold text-gold-200">
            Eventos frecuentes
          </h2>
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : topEvents.length === 0 ? (
            <p className="py-8 text-center text-sm text-white/50">
              No hay eventos registrados en este período.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gold-300/20">
              <table className="w-full min-w-[280px]">
                <thead>
                  <tr className="border-b border-white/10 bg-dark-700">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gold-200">
                      Evento
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gold-200">
                      Cantidad
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {topEvents.map((row) => (
                    <tr
                      key={row.event}
                      className="border-b border-white/10 transition-colors hover:bg-dark-700/50"
                    >
                      <td className="px-4 py-3 font-medium text-gold-200/90">
                        {EVENT_LABELS[row.event] ?? row.event}
                      </td>
                      <td className="px-4 py-3 text-right text-white/80">
                        {row.count}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Pages table */}
      <div className="rounded-xl border border-gold-300/20 bg-dark-800 p-6">
        <h2 className="mb-4 text-lg font-semibold text-gold-200">
          Páginas más vistas
        </h2>
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : topPages.length === 0 ? (
          <p className="py-8 text-center text-sm text-white/50">
            No hay datos de páginas en este período.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gold-300/20 bg-dark-800">
            <table className="hidden w-full min-w-[400px] md:table">
              <thead>
                <tr className="border-b border-white/10 bg-dark-700">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gold-200">
                    Página
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gold-200">
                    Visitas
                  </th>
                </tr>
              </thead>
              <tbody>
                {topPages.map((row) => (
                  <tr
                    key={row.path}
                    className="border-b border-white/10 transition-colors hover:bg-dark-700/50"
                  >
                    <td className="max-w-[min(100vw-4rem,480px)] truncate px-4 py-3 font-medium text-gold-200">
                      {row.path}
                    </td>
                    <td className="px-4 py-3 text-right text-white/90">
                      {row.visits}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <ul className="divide-y divide-white/10 md:hidden">
              {topPages.map((row) => (
                <li
                  key={row.path}
                  className="flex items-center justify-between gap-2 px-4 py-3"
                >
                  <span className="min-w-0 flex-1 truncate font-medium text-gold-200">
                    {row.path}
                  </span>
                  <span className="shrink-0 text-white/90">{row.visits}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
