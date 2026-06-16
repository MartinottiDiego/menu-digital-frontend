'use client';

import { useEffect, useRef, useState } from 'react';
import { Payment, initMercadoPago } from '@mercadopago/sdk-react';
import { MP_PUBLIC_KEY } from '@/lib/constants';

/** Datos que el Brick tokeniza y nos entrega al confirmar el pago. */
export interface BrickFormData {
  token?: string;
  issuer_id?: string;
  payment_method_id: string;
  installments?: number;
  payer?: {
    email?: string;
    identification?: { type?: string; number?: string };
  };
}

interface PaymentBrickProps {
  /** Monto a cobrar (lo revalida el backend desde la orden). */
  amount: number;
  payerEmail?: string;
  /** Se llama al confirmar; debe resolver para que el Brick muestre éxito. */
  onPay: (data: BrickFormData) => Promise<void>;
}

export function PaymentBrick({ amount, payerEmail, onPay }: PaymentBrickProps) {
  const [ready, setReady] = useState(false);
  // Mantengo la última versión de onPay sin re-montar el Brick.
  const onPayRef = useRef(onPay);
  onPayRef.current = onPay;

  useEffect(() => {
    if (MP_PUBLIC_KEY) {
      initMercadoPago(MP_PUBLIC_KEY, { locale: 'es-AR' });
    }
    setReady(true);
  }, []);

  if (!MP_PUBLIC_KEY) {
    return (
      <div className="rounded-[13px] p-4 text-[13.5px] text-tan-dim" style={{ boxShadow: 'inset 0 0 0 1px var(--line)' }}>
        Falta configurar <code>NEXT_PUBLIC_MP_PUBLIC_KEY</code> para mostrar el
        formulario de pago.
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="flex items-center justify-center gap-3 py-10 text-tan-dim">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-gold border-t-transparent" />
        Cargando medios de pago…
      </div>
    );
  }

  return (
    <>
      <p className="mb-3 text-[12px] leading-snug text-tan-dim">
        💳 Pagando en{' '}
        <span className="font-semibold text-tan">1 cuota no tenés interés</span>.
        En más cuotas, el interés lo aplica tu banco/tarjeta (ya ves el total al
        elegir).
      </p>
      <Payment
        initialization={{ amount, payer: payerEmail ? { email: payerEmail } : undefined }}
      customization={{
        visual: {
          // Match con la marca (oro sobre negro) en vez del azul/celeste default.
          style: {
            theme: 'dark',
            customVariables: {
              baseColor: '#d8a23e', // oro: botón + estados seleccionados
              baseColorFirstVariant: '#ecc063',
              baseColorSecondVariant: '#a9781f',
              buttonTextColor: '#241606', // texto oscuro sobre el botón dorado
              textPrimaryColor: '#f5edde', // crema
              textSecondaryColor: '#cbb697', // tan
              inputBackgroundColor: '#160f08',
              formBackgroundColor: '#1c130b', // panel de la marca
              outlinePrimaryColor: 'rgba(216,162,62,0.30)',
              outlineSecondaryColor: 'rgba(216,162,62,0.16)',
              successColor: '#5bbd7a',
              errorColor: '#d4796b',
              borderRadiusSmall: '8px',
              borderRadiusMedium: '12px',
              borderRadiusLarge: '16px',
            },
          },
        },
        paymentMethods: {
          creditCard: 'all',
          debitCard: 'all',
          ticket: 'all',
          // Dinero en cuenta / saldo de Mercado Pago (requiere login del comprador).
          mercadoPago: 'all',
          maxInstallments: 12,
        },
      }}
      onSubmit={async ({ formData }) => {
        await onPayRef.current(formData as BrickFormData);
      }}
      onError={(error) => {
        // El Brick emite errores NO críticos durante el uso normal (validaciones
        // del propio form, reintentos, doble render de StrictMode en dev). No
        // rompen el pago; logueamos como aviso con el detalle si existe.
        const e = error as { type?: string; message?: string; cause?: unknown };
        if (e?.type === 'critical') {
          console.error('[PaymentBrick] crítico:', e.message, e.cause ?? '');
        } else if (e?.message) {
          console.warn('[PaymentBrick]', e.message, e.cause ?? '');
        }
      }}
      />
    </>
  );
}
