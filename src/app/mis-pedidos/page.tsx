'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import type { PublicMyOrder } from '@/lib/types';
import { fmtPrice } from '@/lib/utils';
import { Icon } from '@/components/ui/Icons';
import { StatusPill } from '@/components/ui/StatusPill';

/** "Hoy · 12:48", "Ayer · 19:30" o "2 jun · 19:30". */
function fmtOrderDate(iso: string): string {
  const d = new Date(iso);
  const time = d.toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === now.toDateString()) return `Hoy · ${time}`;
  if (d.toDateString() === yesterday.toDateString()) return `Ayer · ${time}`;
  const date = d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });
  return `${date} · ${time}`;
}

export default function MisPedidosPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<PublicMyOrder[] | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = email.trim();
    if (!clean) return;
    setLoading(true);
    setError(null);
    try {
      setResults(await api.getMyOrders(clean));
    } catch (err) {
      setResults(null);
      setError(err instanceof Error ? err.message : 'No pudimos buscar tus pedidos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-[880px] px-[20px] pb-12 pt-6 lg:px-14 lg:pb-14 lg:pt-11">
      <div className="eyebrow" style={{ color: 'var(--gold)' }}>
        Seguí tu pedido
      </div>
      <h1 className="font-display my-3 mb-2.5 text-[30px] text-cream lg:text-[46px]">
        Mis pedidos
      </h1>
      <p className="mb-6 max-w-[560px] text-[14px] text-tan lg:text-[16px]">
        Ingresá el email con el que hiciste tu compra y te mostramos el estado
        de tus pedidos de los últimos 90 días. No hace falta registrarse.
      </p>

      {/* Campo de búsqueda */}
      <form
        onSubmit={handleSearch}
        className="mb-6 flex flex-col gap-2.5 sm:flex-row sm:items-end"
      >
        <div className="field-input flex-1 sm:max-w-[320px]">
          <Icon.mail />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            type="email"
            inputMode="email"
            required
          />
        </div>
        <button
          type="submit"
          className="btn btn-gold h-[48px] px-6 text-[14px]"
          disabled={loading}
        >
          {loading ? (
            <Loader2 style={{ width: 17, height: 17 }} className="animate-spin" />
          ) : (
            <Icon.search style={{ width: 17, height: 17 }} />
          )}{' '}
          Buscar pedidos
        </button>
      </form>

      {error && (
        <div
          className="mb-6 rounded-[14px] px-5 py-4 text-[14px] text-red-300"
          style={{ background: 'rgba(212,121,107,.08)', boxShadow: 'inset 0 0 0 1px rgba(212,121,107,.25)' }}
        >
          {error}
        </div>
      )}

      {results !== null && !error && (
        <>
          <div className="eyebrow mb-3.5">
            {results.length}{' '}
            {results.length === 1 ? 'pedido encontrado' : 'pedidos encontrados'}
          </div>
          {results.length === 0 && (
            <p className="max-w-[560px] text-[14px] text-tan-dim">
              No encontramos pedidos de los últimos 90 días con ese email.
              Fijate que sea el mismo que usaste al comprar.
            </p>
          )}
          <div className="flex flex-col gap-3.5">
            {results.map((o) => {
              const card = (
                <div
                  className="rounded-[16px] p-[16px_18px] transition-shadow lg:p-[20px_24px]"
                  style={{
                    background: 'linear-gradient(180deg,var(--card-a),var(--card-b))',
                    boxShadow: 'inset 0 0 0 1px var(--line)',
                  }}
                >
                  {/* mobile */}
                  <div className="lg:hidden">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="tnum text-[14px] font-extrabold text-gold">
                        #{o.orderNumber}
                      </span>
                      <StatusPill status={o.status} />
                    </div>
                    <div className="mb-2 text-[13px] leading-[1.4] text-tan">
                      {o.items.join(', ')}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] text-tan-dim">
                        {fmtOrderDate(o.createdAt)}
                      </span>
                      <span className="price tnum" style={{ fontSize: 16 }}>
                        {fmtPrice(o.total)}
                      </span>
                    </div>
                  </div>
                  {/* desktop */}
                  <div className="hidden items-center gap-[22px] lg:flex">
                    <div className="min-w-[92px]">
                      <div className="tnum text-[17px] font-extrabold text-gold">
                        #{o.orderNumber}
                      </div>
                      <div className="mt-[3px] text-[12.5px] text-tan-dim">
                        {fmtOrderDate(o.createdAt)}
                      </div>
                    </div>
                    <div className="min-w-0 flex-1 text-[14.5px] text-tan">
                      {o.items.join(', ')}
                    </div>
                    <StatusPill status={o.status} />
                    <span
                      className="price tnum min-w-[90px] text-right"
                      style={{ fontSize: 20 }}
                    >
                      {fmtPrice(o.total)}
                    </span>
                  </div>
                </div>
              );
              // Con token de seguimiento, la tarjeta linkea al detalle del pedido.
              return o.trackingToken ? (
                <Link
                  key={o.orderNumber}
                  href={`/seguimiento/${o.trackingToken}`}
                  className="block hover:brightness-110"
                >
                  {card}
                </Link>
              ) : (
                <div key={o.orderNumber}>{card}</div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
