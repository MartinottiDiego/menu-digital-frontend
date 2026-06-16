'use client';

import { createContext, useContext } from 'react';
import useSWR from 'swr';
import { fetchSettings, DEFAULT_SETTINGS, type Settings } from '@/lib/settings';

const SettingsContext = createContext<Settings>(DEFAULT_SETTINGS);

/** Config del negocio en vivo. Cae a defaults mientras carga o si el backend falla. */
export function useSettings(): Settings {
  return useContext(SettingsContext);
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { data } = useSWR<Settings>('site-settings', fetchSettings, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
    dedupingInterval: 600000, // 10 min: no re-pide settings constantemente
    // Si falla, seguimos con defaults (no rompe el sitio).
    shouldRetryOnError: false,
  });
  return (
    <SettingsContext.Provider value={data ?? DEFAULT_SETTINGS}>
      {children}
    </SettingsContext.Provider>
  );
}
