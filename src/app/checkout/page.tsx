'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCartStore } from '@/store/cart';
import { api } from '@/lib/api';
import { API_URL } from '@/lib/constants';
import type { CheckoutFormData, DeliveryMethod, Order } from '@/lib/types';
import { useToast } from '@/hooks/useToast';
import { Logo } from '@/components/ui/Logo';
import { Icon } from '@/components/ui/Icons';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { PaymentBrick, type BrickFormData } from '@/components/checkout/PaymentBrick';
import { PayCountdown } from '@/components/checkout/PayCountdown';
import { PageTransition } from '@/components/layout/PageTransition';

/** Ventana para pagar antes de que el pedido se cancele (alineado con el back). */
const PAY_WINDOW_MS = 60 * 60 * 1000;

export default function CheckoutPage() {
  const router = useRouter();
  const toast = useToast();
  const { items, getTotal, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('delivery');
  // Cuando la orden está creada, mostramos el Payment Brick (pago en el sitio).
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [payerEmail, setPayerEmail] = useState<string | undefined>(undefined);
  // El pedido venció (pasó la ventana de pago) → hay que rehacerlo.
  const [expired, setExpired] = useState(false);
  // Nombre del producto cuyo stock se agotó en la carrera (muestra un modal).
  const [stockTaken, setStockTaken] = useState<string | null>(null);
  // true cuando el pago está en curso/concretado: en ese caso NO cancelamos la
  // orden al salir (evita cancelar un pago recién aprobado).
  const settledRef = useRef(false);
  // Última orden creada (ref para leerla en el cleanup de desmontaje).
  const createdOrderRef = useRef<Order | null>(null);
  createdOrderRef.current = createdOrder;

  const payDeadline = createdOrder
    ? new Date(createdOrder.createdAt).getTime() + PAY_WINDOW_MS
    : 0;

  const total = getTotal();

  useEffect(() => {
    if (items.length === 0) {
      router.replace('/cart');
    }
  }, [items.length, router]);

  // Si el cliente cierra la pestaña con un pedido pendiente sin pagar, liberamos
  // el stock reservado (best-effort vía sendBeacon).
  useEffect(() => {
    const handler = () => {
      if (createdOrder && !settledRef.current) {
        navigator.sendBeacon(`${API_URL}/orders/${createdOrder._id}/cancel`);
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [createdOrder]);

  // Al salir del checkout por navegación interna (logo, "atrás", etc.) el
  // componente se desmonta sin disparar beforeunload: liberamos acá la reserva
  // si quedó una orden pendiente sin pagar.
  useEffect(() => {
    return () => {
      const o = createdOrderRef.current;
      if (o && !settledRef.current) {
        api.cancelOrder(o._id).catch(() => {});
      }
    };
  }, []);

  // Cancela la orden pendiente (libera stock) al abandonar el pago.
  const abandonOrder = useCallback(async () => {
    const order = createdOrder;
    if (order && !settledRef.current) {
      await api.cancelOrder(order._id).catch(() => {});
    }
  }, [createdOrder]);

  // Al vencerse el contador: marcamos vencido y cancelamos para liberar stock ya.
  const handleExpire = useCallback(() => {
    settledRef.current = true; // la cancelamos nosotros; evita doble cancelación
    setExpired(true);
    if (createdOrder) api.cancelOrder(createdOrder._id).catch(() => {});
  }, [createdOrder]);

  const handleSubmit = useCallback(
    async (data: CheckoutFormData) => {
      if (items.length === 0) {
        toast.error('El carrito está vacío');
        return;
      }
      setLoading(true);
      try {
        const address = data.notes
          ? [data.customerAddress, `Notas: ${data.notes}`]
              .filter(Boolean)
              .join(' | ')
          : data.customerAddress;

        const order = await api.createOrder({
          customerName: data.customerName,
          customerPhone: data.customerPhone,
          customerAddress: address || undefined,
          customerZipCode: data.customerZipCode || undefined,
          customerEmail: data.customerEmail,
          deliveryMethod: data.deliveryMethod,
          items: items.map((i) =>
            i.comboId
              ? { comboId: i.comboId, quantity: i.quantity }
              : i.pieceId
                ? { productId: i.productId, pieceId: i.pieceId, quantity: i.quantity }
                : { productId: i.productId, quantity: i.quantity, weightKg: i.weightKg }
          ),
        });

        // En vez de redirigir a Mercado Pago, mostramos el formulario de pago
        // embebido (Payment Brick) con la orden ya creada.
        setPayerEmail(data.customerEmail || order.customerEmail);
        setExpired(false);
        settledRef.current = false; // nueva orden: cancelable si se abandona
        setCreatedOrder(order);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        const message =
          err instanceof Error ? err.message : 'Ocurrió un error inesperado';
        // Carrera de stock: alguien reservó la última unidad justo antes. El
        // backend responde con un error técnico ("No hay stock/kilos…"); lo
        // traducimos a algo claro (y esperanzador: puede volver a haber stock).
        if (/stock|kilos|disponible|pieza/i.test(message)) {
          const m = message.match(/"([^"]+)"/);
          setStockTaken(m ? m[1] : '');
        } else {
          toast.error(message);
        }
      }
    },
    [items, toast]
  );

  // Confirma el pago con el token que tokenizó el Brick.
  const handleBrickPay = useCallback(
    async (formData: BrickFormData) => {
      if (!createdOrder) return;
      // Pago en curso: no cancelar la orden si la pestaña se cierra ahora.
      settledRef.current = true;
      // Device ID que genera el SDK de MP al cargarse: identifica el dispositivo
      // del comprador ante el motor antifraude (mejora la tasa de aprobación).
      const deviceId = (
        window as unknown as { MP_DEVICE_SESSION_ID?: string }
      ).MP_DEVICE_SESSION_ID;
      try {
        const result = await api.processPayment({
          orderId: createdOrder._id,
          idempotencyKey: crypto.randomUUID(),
          token: formData.token,
          paymentMethodId: formData.payment_method_id,
          installments: formData.installments,
          issuerId: formData.issuer_id,
          deviceId,
          payer: {
            email: formData.payer?.email || payerEmail,
            identification: formData.payer?.identification,
          },
        });

        const qs =
          `?status=${result.status}` +
          `&payment_id=${result.paymentId}` +
          `&external_reference=${createdOrder.orderNumber}` +
          `&token=${createdOrder.trackingToken ?? ''}`;

        // Rechazado/cancelado: la orden sigue PENDING. No navegamos ni limpiamos
        // el carrito; lanzamos para que el Brick muestre el error y el cliente
        // pueda reintentar con otra tarjeta/medio en el mismo pedido.
        if (result.status === 'rejected' || result.status === 'cancelled') {
          // Sigue PENDING para reintentar: vuelve a ser cancelable si abandona.
          settledRef.current = false;
          toast.error('Tu pago fue rechazado. Probá con otra tarjeta o medio de pago.');
          throw new Error('payment_rejected');
        }

        // A partir de acá el pago se concretó (aprobado) o quedó en curso
        // (efectivo/acreditación): el pedido ya existe, así que vaciamos el carrito.
        clearCart();

        // Efectivo (Pago Fácil / Rapipago): mandamos al cupón.
        if (result.ticketUrl) {
          window.location.href = result.ticketUrl;
          return;
        }
        if (result.status === 'approved') {
          window.location.href = `/payment/success${qs}`;
        } else {
          window.location.href = `/payment/pending${qs}`;
        }
      } catch (err) {
        if (err instanceof Error && err.message === 'payment_rejected') {
          throw err; // ya avisamos por toast; el Brick habilita el reintento
        }
        const message =
          err instanceof Error ? err.message : 'No se pudo procesar el pago';
        toast.error(message);
        throw err; // que el Brick muestre el error y permita reintentar
      }
    },
    [createdOrder, payerEmail, toast, clearCart]
  );

  if (items.length === 0) return null;

  return (
    <PageTransition>
      {/* Header propio del checkout (reemplaza el global vía pantalla completa) */}
      <header
        className="flex items-center justify-between px-[20px] py-5 lg:px-14"
        style={{ boxShadow: 'inset 0 -1px 0 var(--line)' }}
      >
        <Link href="/cart" aria-label="Volver al carrito">
          <Logo className="scale-90 lg:scale-100" />
        </Link>
        <div
          className="hidden items-center gap-2 rounded-full px-4 py-2 sm:inline-flex"
          style={{
            background: 'rgba(216,162,62,.12)',
            boxShadow: 'inset 0 0 0 1px var(--line)',
          }}
        >
          <Icon.flame style={{ width: 16, height: 16, color: 'var(--gold)' }} />
          <span className="text-[12.5px] font-extrabold uppercase tracking-[0.1em] text-gold-lite">
            Compra en 1 paso
          </span>
        </div>
        <div className="flex items-center gap-2 text-[13px] font-semibold text-tan-dim">
          <Icon.lock style={{ width: 16, height: 16, color: 'var(--gold)' }} />
          <span className="hidden sm:inline">Pago seguro</span>
        </div>
      </header>

      <section className="mx-auto grid max-w-[1280px] grid-cols-1 items-start gap-9 px-[20px] py-9 lg:grid-cols-[1.5fr_1fr] lg:px-14 lg:pb-[52px]">
        <div>
          {createdOrder ? (
            <>
              <h1 className="font-display mb-1.5 text-[26px] text-cream lg:text-[30px]">
                Elegí cómo pagar
              </h1>
              {expired ? (
                <div className="mt-2 rounded-[13px] p-5" style={{ boxShadow: 'inset 0 0 0 1px var(--line)' }}>
                  <p className="text-[15px] font-bold text-cream">
                    Se venció el tiempo para pagar
                  </p>
                  <p className="mt-1.5 text-[13.5px] text-tan-dim">
                    El pedido <span className="font-semibold">#{createdOrder.orderNumber}</span> se canceló porque pasó la hora para completar el pago. Tus productos siguen en el carrito: confirmá de nuevo para generar un pedido nuevo.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setExpired(false);
                      setCreatedOrder(null);
                    }}
                    className="btn btn-gold mt-4 h-[46px] px-6 text-[14px]"
                  >
                    Confirmar de nuevo
                  </button>
                </div>
              ) : (
                <>
                  <p className="mb-6 text-[14.5px] text-tan-dim">
                    Tu pedido <span className="text-gold-lite font-semibold">#{createdOrder.orderNumber}</span> está pendiente. Tenés{' '}
                    <PayCountdown deadline={payDeadline} onExpire={handleExpire} />{' '}
                    para completar el pago; pasado ese tiempo se cancela y tenés que confirmarlo de nuevo.
                  </p>
                  <PaymentBrick
                    amount={createdOrder.total}
                    payerEmail={payerEmail}
                    onPay={handleBrickPay}
                  />
                  <button
                    type="button"
                    onClick={async () => {
                      await abandonOrder(); // libera el stock reservado
                      setCreatedOrder(null);
                    }}
                    className="mt-5 text-[13px] font-semibold text-tan-dim underline-offset-4 hover:underline"
                  >
                    ← Volver a editar mis datos
                  </button>
                </>
              )}
            </>
          ) : (
            <>
              <h1 className="font-display mb-1.5 text-[26px] text-cream lg:text-[30px]">
                Finalizá tu pedido
              </h1>
              <p className="mb-6 text-[14.5px] text-tan-dim">
                Completá tus datos y confirmá. Todo en una sola pantalla.
              </p>
              <CheckoutForm
                onSubmit={handleSubmit}
                loading={loading}
                total={total}
                deliveryMethod={deliveryMethod}
                onDeliveryMethodChange={setDeliveryMethod}
              />
            </>
          )}
        </div>

        <div className="lg:sticky lg:top-6">
          <OrderSummary items={items} total={total} deliveryMethod={deliveryMethod} />
        </div>
      </section>

      {/* Modal de carrera de stock: alguien reservó la última unidad primero. */}
      {stockTaken !== null && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center p-5"
          style={{ background: 'rgba(0,0,0,.72)', backdropFilter: 'blur(2px)' }}
          onClick={() => setStockTaken(null)}
        >
          <div
            className="w-full max-w-[420px] rounded-2xl p-6 text-center sm:p-7"
            style={{
              background: 'linear-gradient(180deg,var(--card-a),var(--card-b))',
              boxShadow: 'inset 0 0 0 1px var(--line), 0 24px 60px rgba(0,0,0,.55)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full"
              style={{ background: 'rgba(216,162,62,.14)' }}
            >
              <Icon.flame style={{ width: 26, height: 26, color: 'var(--gold)' }} />
            </div>
            <h3 className="font-display text-[22px] text-cream lg:text-[24px]">
              Justo se agotó el stock
            </h3>
            <p className="mt-2.5 text-[14px] leading-relaxed text-tan-dim">
              Otra persona se adelantó y está comprando
              {stockTaken ? (
                <>
                  {' '}
                  <span className="font-semibold text-tan">“{stockTaken}”</span>
                </>
              ) : (
                ' este producto'
              )}
              . Si no completa el pago, el stock se libera y vas a poder intentarlo
              de nuevo en un rato.
            </p>
            <div className="mt-6 flex flex-col gap-2.5">
              <Link href="/cart" className="btn btn-gold h-[48px] text-[14px]">
                Revisar mi carrito
              </Link>
              <button
                type="button"
                onClick={() => setStockTaken(null)}
                className="text-[13px] font-semibold text-tan-dim hover:underline"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </PageTransition>
  );
}
