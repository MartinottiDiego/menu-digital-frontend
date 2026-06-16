'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { adminApi } from '@/lib/adminApi';
import type {
  AnalyticsPeriod,
  OverviewResult,
  DailyVisit,
  PageVisit,
  DeviceBreakdown,
  EventSummary,
} from '@/lib/types';

/** Inicio del día local (00:00:00.000). */
function startOfLocalDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
}

/** Fin del día local (23:59:59.999). */
function endOfLocalDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
}

/** ISO 8601 con offset local (ej. 2026-04-12T00:00:00.000-03:00). */
function formatLocalISO(d: Date): string {
  const pad = (n: number, l = 2) => String(n).padStart(l, '0');
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const min = pad(d.getMinutes());
  const ss = pad(d.getSeconds());
  const ms = pad(d.getMilliseconds(), 3);
  const tzOffsetMin = -d.getTimezoneOffset();
  const sign = tzOffsetMin >= 0 ? '+' : '-';
  const abs = Math.abs(tzOffsetMin);
  const offH = pad(Math.floor(abs / 60));
  const offM = pad(abs % 60);
  return `${yyyy}-${mm}-${dd}T${hh}:${min}:${ss}.${ms}${sign}${offH}:${offM}`;
}

function getDateRange(period: AnalyticsPeriod): { from: string; to: string } {
  const today = new Date();
  const to = endOfLocalDay(today);

  const fromAnchor = new Date(today);
  const daysBack = period === 'week' ? 7 : period === 'month' ? 30 : 365;
  fromAnchor.setDate(fromAnchor.getDate() - daysBack);
  const from = startOfLocalDay(fromAnchor);

  return {
    from: formatLocalISO(from),
    to: formatLocalISO(to),
  };
}

export function useAnalytics(period: AnalyticsPeriod = 'month') {
  const { from, to } = useMemo(() => getDateRange(period), [period]);

  const [overview, setOverview] = useState<OverviewResult | null>(null);
  const [dailyVisits, setDailyVisits] = useState<DailyVisit[] | null>(null);
  const [byPage, setByPage] = useState<PageVisit[] | null>(null);
  const [devices, setDevices] = useState<DeviceBreakdown[] | null>(null);
  const [eventsSummary, setEventsSummary] = useState<EventSummary[] | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const refetch = useCallback(() => {
    setReloadToken((n) => n + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    Promise.all([
      adminApi.getAnalyticsOverview(from, to),
      adminApi.getAnalyticsDaily(from, to),
      adminApi.getAnalyticsByPage(from, to),
      adminApi.getAnalyticsDevices(from, to),
      adminApi.getAnalyticsEventsSummary(from, to),
    ])
      .then(([ov, daily, pages, devs, events]) => {
        if (cancelled) return;
        setOverview(ov);
        setDailyVisits(daily);
        setByPage(pages);
        setDevices(devs);
        setEventsSummary(events);
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setOverview(null);
        setDailyVisits(null);
        setByPage(null);
        setDevices(null);
        setEventsSummary(null);
        setError(e instanceof Error ? e.message : 'Error al cargar analytics');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [from, to, reloadToken]);

  return {
    overview,
    dailyVisits,
    byPage,
    devices,
    eventsSummary,
    isLoading,
    error,
    refetch,
  };
}
