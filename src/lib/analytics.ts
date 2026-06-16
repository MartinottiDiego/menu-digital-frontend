import { API_URL } from './constants';

const SESSION_KEY = 'miinuta_session_id';
const ANON_KEY = 'miinuta_anon_id';

/** Campos anidados bajo `properties` en el body del track */
export interface TrackPayloadProperties {
  path: string;
  referrer: string;
  device: 'mobile' | 'tablet' | 'desktop';
  userAgent: string;
}

export interface TrackEventPayload {
  event: string;
  sessionId: string;
  anonymousId: string;
  properties: TrackPayloadProperties;
}

/** Overrides de `properties` y/o `useBeacon` para enviar el body con `sendBeacon`. */
export type TrackEventOptions = Partial<TrackPayloadProperties> & {
  useBeacon?: boolean;
};

export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return '';
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

export function getAnonymousId(): string {
  if (typeof window === 'undefined') return '';
  try {
    let id = localStorage.getItem(ANON_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(ANON_KEY, id);
    }
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

export function getDevice(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';
  const w = window.innerWidth;
  if (w < 768) return 'mobile';
  if (w < 1024) return 'tablet';
  return 'desktop';
}

export function trackEvent(
  event: string,
  options?: TrackEventOptions
): void {
  if (typeof window === 'undefined') return;

  const { useBeacon, ...extraProperties } = options ?? {};

  const properties: TrackPayloadProperties = {
    path: `${window.location.pathname}${window.location.search}`,
    referrer: document.referrer || '',
    device: getDevice(),
    userAgent: navigator.userAgent,
    ...extraProperties,
  };

  const payload: TrackEventPayload = {
    event,
    sessionId: getOrCreateSessionId(),
    anonymousId: getAnonymousId(),
    properties,
  };

  const url = `${API_URL}/a/track`;
  const bodyJson = JSON.stringify(payload);

  if (useBeacon) {
    const blob = new Blob([bodyJson], { type: 'application/json' });
    const sent =
      typeof navigator.sendBeacon === 'function' &&
      navigator.sendBeacon(url, blob);
    if (!sent) {
      void fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: bodyJson,
      }).catch((err: unknown) => {
        console.warn('[analytics] track failed', err);
      });
    }
    return;
  }

  void fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: bodyJson,
  }).catch((err: unknown) => {
    console.warn('[analytics] track failed', err);
  });
}
