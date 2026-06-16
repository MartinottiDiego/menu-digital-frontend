'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import useSWR from 'swr';
import { api } from '@/lib/api';
import type { PublicTracking } from '@/lib/types';
import { Logo } from '@/components/ui/Logo';
import { Icon } from '@/components/ui/Icons';
import { fmtPrice } from '@/lib/utils';
import { PageTransition } from '@/components/layout/PageTransition';

/** Orden de avance de los estados (para marcar done/now/todo). */
const RANK: Record<string, number> = {
  pending: -1,
  paid: 0,
  preparing: 1,
  on_the_way: 2,
  ready_for_pickup: 2,
  delivered: 3,
};

function fmtWhen(iso?: string): string {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

export default function TrackingPage() {
  const { token } = useParams<{ token: string }>();

  const { data, error, isLoading } = useSWR(
    token ? ['track', token] : null,
    () => api.getTracking(token),
    { refreshInterval: 25000, revalidateOnFocus: true }
  );

  return (
    <PageTransition>
      <header
        className="flex items-center justify-between px-[20px] py-5 lg:px-14"
        style={{ boxShadow: 'inset 0 -1px 0 var(--line)' }}
      >
        <Link href="/" aria-label="Inicio">
          <Logo className="scale-90 lg:scale-100" />
        </Link>
        <Link href="/menu" className="btn btn-ghost h-[42px] px-5 text-[13px]">
          Seguir comprando
        </Link>
      </header>

      <section className="mx-auto max-w-[640px] px-[22px] pb-16 pt-8 lg:pt-12">
        {isLoading && (
          <div className="flex items-center justify-center gap-3 py-20 text-tan-dim">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-gold border-t-transparent" />
            Cargando tu pedido…
          </div>
        )}

        {error && !isLoading && (
          <div className="py-16 text-center">
            <h1 className="font-display text-[26px] text-cream">
              No encontramos este pedido
            </h1>
            <p className="mt-2 text-[14px] text-tan-dim">
              El link puede estar vencido o ser incorrecto.
            </p>
            <Link href="/seguimiento" className="btn btn-gold mt-6 h-[48px] px-6 text-[14px]">
              Buscar mi pedido por email
            </Link>
          </div>
        )}

        {data && <TrackingBody data={data} />}
      </section>
    </PageTransition>
  );
}

function TrackingBody({ data }: { data: PublicTracking }) {
  const isPickup = data.deliveryMethod === 'pickup';
  const cancelled = data.status === 'cancelled' || data.status === 'failed';

  const steps = [
    { keys: ['paid'], label: 'Pedido confirmado' },
    { keys: ['preparing'], label: 'En preparación' },
    {
      keys: ['on_the_way', 'ready_for_pickup'],
      label: isPickup ? 'Listo para retirar' : 'En camino',
    },
    { keys: ['delivered'], label: isPickup ? 'Retirado' : 'Entregado' },
  ];

  const current = RANK[data.status] ?? -1;
  const whenFor = (keys: string[]) =>
    fmtWhen(
      data.statusHistory.find((h) => keys.includes(h.status))?.at
    );

  return (
    <>
      <div className="mb-8 text-center">
        <div
          className="inline-flex h-[60px] w-[60px] items-center justify-center rounded-full text-[#2a1c08]"
          style={{
            background: cancelled
              ? 'rgba(212,121,107,.2)'
              : 'linear-gradient(180deg,var(--gold-lite),var(--gold))',
          }}
        >
          {cancelled ? (
            <span style={{ color: '#d4796b', fontSize: 30, fontWeight: 700, lineHeight: 1 }}>
              ✕
            </span>
          ) : (
            <Icon.check style={{ width: 32, height: 32 }} />
          )}
        </div>
        <h1 className="font-display mt-4 text-[26px] text-cream lg:text-[32px]">
          {cancelled ? 'Pedido cancelado' : `Hola ${data.customerName.split(' ')[0]}!`}
        </h1>
        <p className="mt-1 text-[14px] text-tan-dim">
          Pedido <span className="text-gold-lite font-semibold">#{data.orderNumber}</span>
          {!cancelled && (isPickup ? ' · Retiro en el local' : ' · Delivery a domicilio')}
        </p>
      </div>

      {cancelled ? (
        <div
          className="rounded-[16px] p-6 text-center"
          style={{ boxShadow: 'inset 0 0 0 1px var(--line)' }}
        >
          <p className="text-[14px] text-tan">
            Este pedido fue cancelado. Si creés que es un error, escribinos.
          </p>
        </div>
      ) : (
        <div
          className="rounded-[18px] p-[24px_26px]"
          style={{
            background: 'linear-gradient(180deg,var(--panel),var(--card-b))',
            boxShadow: 'inset 0 0 0 1px var(--line)',
          }}
        >
          <h2 className="font-display mb-5 text-[20px] text-cream">Seguimiento</h2>
          <div className="track">
            {steps.map((step, i) => {
              const st =
                current >= 3
                  ? 'done'
                  : i < current
                    ? 'done'
                    : i === current
                      ? 'now'
                      : 'todo';
              const when = whenFor(step.keys);
              return (
                <div className="tr" key={step.label}>
                  <div className="tdot">
                    <span className={`c ${st}`}>
                      {st === 'done' ? (
                        <Icon.check style={{ width: 14, height: 14 }} />
                      ) : (
                        <span
                          style={{
                            width: 7,
                            height: 7,
                            borderRadius: 999,
                            background: 'currentColor',
                          }}
                        />
                      )}
                    </span>
                    {i < steps.length - 1 && (
                      <span className={`ln ${st === 'done' ? 'done' : ''}`} />
                    )}
                  </div>
                  <div className="tc">
                    <div
                      className="text-[14.5px] font-bold"
                      style={{ color: st === 'todo' ? 'var(--tan-dim)' : 'var(--cream)' }}
                    >
                      {step.label}
                    </div>
                    {when && (
                      <div className="mt-0.5 text-[12.5px] text-tan-dim">{when}</div>
                    )}
                    {st === 'now' && !when && (
                      <div className="mt-0.5 text-[12.5px] text-gold-lite">Ahora</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-5 text-center text-[11.5px] text-tan-dim">
            Se actualiza solo. Dejá esta página abierta para ver los cambios.
          </p>
        </div>
      )}

      {/* Detalle del pedido */}
      <div className="mt-7">
        <h3 className="mb-3 text-[13px] font-bold uppercase tracking-[0.08em] text-tan-dim">
          Tu pedido
        </h3>
        <div className="flex flex-col gap-2">
          {data.items.map((it, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-[12px] px-4 py-3"
              style={{ boxShadow: 'inset 0 0 0 1px var(--line)' }}
            >
              <div className="min-w-0">
                <div className="text-[14px] font-semibold text-cream">{it.name}</div>
                <div className="text-[12px] text-tan-dim">
                  {it.weightKg ? `${it.weightKg} kg` : `x${it.quantity}`}
                </div>
              </div>
              <div className="text-[14px] font-bold text-gold-lite">
                {fmtPrice(it.lineTotal)}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between border-t pt-4" style={{ borderColor: 'var(--line)' }}>
          <span className="text-[13px] font-bold uppercase tracking-[0.08em] text-tan-dim">
            Total
          </span>
          <span className="font-display text-[24px] text-gold">{fmtPrice(data.total)}</span>
        </div>
      </div>
    </>
  );
}
