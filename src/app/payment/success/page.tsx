'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/cart';
import { Icon } from '@/components/ui/Icons';
import { getWhatsAppUrl } from '@/lib/utils';
import { WHATSAPP_NUMBER } from '@/lib/constants';
import { useSettings } from '@/components/layout/SettingsProvider';
import { PageTransition } from '@/components/layout/PageTransition';

const TRACK: [string, string, 'done' | 'now' | 'todo'][] = [
  ['Pedido confirmado', 'Recién', 'done'],
  ['En preparación', 'Ahora', 'now'],
  ['En camino', 'Te avisamos', 'todo'],
  ['Entregado', '', 'todo'],
];

export default function PaymentSuccessPage() {
  const clearCart = useCartStore((s) => s.clearCart);
  const settings = useSettings();
  // Nº de pedido y token de seguimiento que viajan en la URL de retorno.
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [trackToken, setTrackToken] = useState<string | null>(null);

  useEffect(() => {
    // El carrito se limpia solo cuando el pago se confirmó exitosamente.
    clearCart();
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('external_reference');
    const tok = params.get('token');
    if (ref) setOrderNumber(ref);
    if (tok) setTrackToken(tok);
  }, [clearCart]);

  // Ya pagó: el mensaje es de SEGUIMIENTO (no el genérico de "quiero pedir").
  const trackMessage = orderNumber
    ? `Hola! 👋 Hice el pedido #${orderNumber} y quería consultar por el seguimiento. ¡Gracias!`
    : 'Hola! 👋 Acabo de hacer un pedido y quería consultar por el seguimiento. ¡Gracias!';
  const whatsappUrl = getWhatsAppUrl(
    settings.whatsappNumber || WHATSAPP_NUMBER,
    trackMessage
  );

  return (
    <PageTransition>
      <section className="mx-auto max-w-[920px] px-[22px] pb-14 pt-10 lg:px-14">
        {/* Éxito */}
        <div className="mb-9 text-center">
          <div
            className="inline-flex h-[68px] w-[68px] items-center justify-center rounded-full text-[#2a1c08] lg:h-[76px] lg:w-[76px]"
            style={{
              background: 'linear-gradient(180deg,var(--gold-lite),var(--gold))',
              boxShadow: '0 12px 30px rgba(216,162,62,.32)',
            }}
          >
            <Icon.check style={{ width: 38, height: 38 }} />
          </div>
          <h1 className="font-display mb-2 mt-4 text-[27px] text-cream lg:text-[42px]">
            ¡Gracias por tu pedido!
          </h1>
          <p className="text-[14px] text-tan lg:text-[16px]">
            Tu pago se confirmó. Te enviamos el detalle por WhatsApp y empezamos
            a prepararlo.
          </p>
        </div>

        {/* Seguimiento */}
        <div
          className="mx-auto max-w-[460px] rounded-[18px] p-[24px_26px]"
          style={{
            background: 'linear-gradient(180deg,var(--panel),var(--card-b))',
            boxShadow: 'inset 0 0 0 1px var(--line)',
          }}
        >
          <h3 className="font-display mb-5 text-[20px] text-cream">Seguimiento</h3>
          <div className="track">
            {TRACK.map(([t, time, st], i) => (
              <div className="tr" key={t}>
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
                  {i < TRACK.length - 1 && (
                    <span className={`ln ${st === 'done' ? 'done' : ''}`} />
                  )}
                </div>
                <div className="tc">
                  <div
                    className="text-[14.5px] font-bold"
                    style={{ color: st === 'todo' ? 'var(--tan-dim)' : 'var(--cream)' }}
                  >
                    {t}
                  </div>
                  {time && (
                    <div className="mt-0.5 text-[12.5px] text-tan-dim">{time}</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {trackToken && (
            <Link
              href={`/seguimiento/${trackToken}`}
              className="btn btn-gold mt-5 h-12 w-full text-[13.5px]"
            >
              <Icon.clock style={{ width: 16, height: 16 }} /> Seguir mi pedido en vivo
            </Link>
          )}
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost h-12 flex-1 text-[13.5px]"
            >
              <Icon.whatsapp style={{ width: 16, height: 16 }} /> Ver en WhatsApp
            </a>
            <Link href="/menu" className="btn btn-ghost h-12 flex-1 text-[13.5px]">
              Seguir comprando
            </Link>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
