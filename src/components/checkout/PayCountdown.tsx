'use client';

import { useEffect, useState } from 'react';

interface PayCountdownProps {
  /** Momento límite para pagar, en ms (epoch). */
  deadline: number;
  /** Se llama cuando llega a cero. */
  onExpire?: () => void;
}

/** Cuenta regresiva MM:SS hasta el vencimiento del pedido. */
export function PayCountdown({ deadline, onExpire }: PayCountdownProps) {
  const [remaining, setRemaining] = useState(() =>
    Math.max(0, deadline - Date.now())
  );

  useEffect(() => {
    const tick = () => setRemaining(Math.max(0, deadline - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [deadline]);

  useEffect(() => {
    if (remaining <= 0) onExpire?.();
  }, [remaining, onExpire]);

  const totalSec = Math.floor(remaining / 1000);
  const mm = String(Math.floor(totalSec / 60)).padStart(2, '0');
  const ss = String(totalSec % 60).padStart(2, '0');
  const danger = remaining <= 5 * 60 * 1000; // últimos 5 min

  return (
    <span
      className="font-bold tabular-nums"
      style={{ color: danger ? '#e0a93a' : 'var(--gold-lite)' }}
    >
      {mm}:{ss}
    </span>
  );
}
