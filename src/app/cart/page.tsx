'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  useCartStore,
  cartLineTotal,
  cartItemKey,
  type CartItem,
} from '@/store/cart';
import { fmtPrice } from '@/lib/utils';
import { useToast } from '@/hooks/useToast';
import { Icon } from '@/components/ui/Icons';
import { EmptyCart } from '@/components/cart/EmptyCart';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { PageTransition } from '@/components/layout/PageTransition';

export default function CartPage() {
  const router = useRouter();
  const toast = useToast();
  const { items, updateQuantity, updateWeight, removeItem, getTotal, clearCart } =
    useCartStore();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const total = getTotal();

  if (items.length === 0) {
    return (
      <PageTransition>
        <EmptyCart />
      </PageTransition>
    );
  }

  // Total de "kg" (suma de pesos elegidos/fijos) para el subtítulo + resumen.
  const totalKg = items.reduce((sum, it) => {
    const kind = it.kind ?? 'unit';
    if (kind === 'loose') return sum + (it.weightKg ?? 0);
    if (kind === 'fixed') return sum + (it.weightKg ?? 0) * it.quantity;
    return sum;
  }, 0);

  // Subtítulo: "N productos" y, si hay peso, "· X kg en total".
  const kgLabel = totalKg > 0 ? ` · ${+totalKg.toFixed(2)} kg en total` : '';
  const subtitle = `${items.length} ${
    items.length === 1 ? 'producto' : 'productos'
  }${kgLabel}`;

  const dec = (id: string, qty: number) =>
    qty <= 1 ? removeItem(id) : updateQuantity(id, qty - 1);

  return (
    <PageTransition>
      <main className="mx-auto w-full max-w-[1240px] px-[20px] pb-16 pt-8 lg:px-10 lg:pt-[42px]">
        <div className="c2-head">
          <div>
            <h1 className="c2-title">Tu carrito</h1>
            <div className="c2-sub">{subtitle}</div>
          </div>
          <button className="c2-clear" onClick={() => setShowClearConfirm(true)}>
            <Icon.trash style={{ width: 17, height: 17 }} /> Vaciar carrito
          </button>
        </div>

        <div className="c2-grid">
          {/* Lista de ítems */}
          <div className="c2-list">
            {items.map((it) => (
              <CartRow
                key={cartItemKey(it)}
                item={it}
                onDec={dec}
                onInc={updateQuantity}
                onDecWeight={updateWeight}
                onIncWeight={updateWeight}
                onRemove={removeItem}
              />
            ))}
          </div>

          {/* Resumen */}
          <aside className="c2-sum">
            <h2 className="c2-sumtitle">Resumen</h2>
            <div className="c2-sumrows">
              <div className="c2-sumrow">
                <span>Productos</span>
                <span className="tnum">
                  {items.length}
                  {totalKg > 0 ? ` · ${+totalKg.toFixed(2)} kg` : ''}
                </span>
              </div>
              <div className="c2-sumrow">
                <span>Subtotal</span>
                <span className="tnum">{fmtPrice(total)}</span>
              </div>
              <div className="c2-sumrow">
                <span>Envío</span>
                <span style={{ color: 'var(--gold)' }}>A confirmar</span>
              </div>
            </div>
            <div className="c2-total">
              <span className="eyebrow">Total estimado</span>
              <span className="c2-totalval tnum">{fmtPrice(total)}</span>
            </div>
            <button
              className="btn btn-gold c2-cta"
              onClick={() => router.push('/checkout')}
            >
              Continuar al checkout{' '}
              <Icon.arrowRight style={{ width: 18, height: 18 }} />
            </button>
            <p className="c2-note">
              El precio final se confirma según el peso real de cada corte.
            </p>
            <Link href="/menu" className="c2-keep">
              <Icon.chevLeft style={{ width: 15, height: 15 }} /> Seguir comprando
            </Link>
          </aside>
        </div>
      </main>

      <ConfirmModal
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={() => {
          clearCart();
          toast.info('Carrito vaciado');
        }}
        title="Vaciar carrito"
        message="¿Estás seguro de que querés vaciar el carrito?"
        confirmLabel="Vaciar"
        cancelLabel="Cancelar"
        variant="danger"
      />
    </PageTransition>
  );
}

/* ---------------- ROW ---------------- */
function CartRow({
  item,
  onDec,
  onInc,
  onDecWeight,
  onIncWeight,
  onRemove,
}: {
  item: CartItem;
  onDec: (id: string, qty: number) => void;
  onInc: (id: string, qty: number) => void;
  onDecWeight: (id: string, weightKg: number) => void;
  onIncWeight: (id: string, weightKg: number) => void;
  onRemove: (id: string) => void;
}) {
  const kind = item.kind ?? 'unit';
  const isLoose = kind === 'loose';
  const lineTotal = cartLineTotal(item);
  const key = cartItemKey(item);

  // Descriptor para que cada línea quede clara (sobre todo cortes del mismo
  // producto, que solo se diferencian por su peso). Siempre en kg.
  const weightDesc = item.pieceId
    ? `${item.weightKg} kg`
    : kind === 'fixed'
      ? `≈ ${item.weightKg} kg c/u`
      : null;

  // Etiqueta de precio unitario según el tipo de venta.
  const unitLine =
    kind === 'unit' ? (
      <>
        {fmtPrice(item.price)} <span>c/u</span>
      </>
    ) : (
      <>
        {fmtPrice(item.price)} <span>/kg</span>
      </>
    );

  const weight = item.weightKg ?? 0;
  const stepKg = item.stepKg ?? 0.5;
  const minKg = item.minKg ?? stepKg;
  const atStock = item.stock != null && weight >= item.stock;
  const atMinKg = weight <= minKg;
  const atQtyStock = item.stock != null && item.quantity >= item.stock;

  return (
    <div className="c2-row">
      <div className="c2-thumb">
        {item.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.imageUrl} alt={item.name} />
        )}
      </div>

      <div className="c2-info">
        <div className="c2-name">{item.name}</div>
        {weightDesc && (
          <div className="text-[12.5px] font-semibold text-gold-lite">
            {weightDesc}
          </div>
        )}
        <div className="c2-unit">{unitLine}</div>
      </div>

      {isLoose ? (
        <div className="c2-qtywrap">
          <span className="c2-qtylabel">Peso (kg)</span>
          <div className="c2-qty">
            <button
              onClick={() =>
                onDecWeight(key, Math.max(minKg, +(weight - stepKg).toFixed(2)))
              }
              disabled={atMinKg}
              aria-label="Menos peso"
            >
              <Icon.minus style={{ width: 18, height: 18, strokeWidth: 2.4 }} />
            </button>
            <span className="val tnum">{weight} kg</span>
            <button
              onClick={() => onIncWeight(key, +(weight + stepKg).toFixed(2))}
              disabled={atStock}
              aria-label="Más peso"
            >
              <Icon.plus style={{ width: 18, height: 18, strokeWidth: 2.4 }} />
            </button>
          </div>
        </div>
      ) : (
        <div className="c2-qtywrap">
          <span className="c2-qtylabel">Cantidad</span>
          <div className="c2-qty">
            <button
              onClick={() => onDec(key, item.quantity)}
              disabled={item.quantity <= 1}
              aria-label="Quitar uno"
            >
              <Icon.minus style={{ width: 18, height: 18, strokeWidth: 2.4 }} />
            </button>
            <span className="val tnum">{item.quantity}</span>
            <button
              onClick={() => onInc(key, item.quantity + 1)}
              disabled={atQtyStock}
              aria-label="Agregar uno"
            >
              <Icon.plus style={{ width: 18, height: 18, strokeWidth: 2.4 }} />
            </button>
          </div>
        </div>
      )}

      <div className="c2-line">
        <span className="c2-linelabel">Subtotal</span>
        <span className="c2-lineval tnum">{fmtPrice(lineTotal)}</span>
      </div>

      <button
        className="c2-del"
        title="Eliminar producto"
        aria-label="Eliminar producto"
        onClick={() => onRemove(key)}
      >
        <Icon.trash style={{ width: 20, height: 20 }} />
      </button>
    </div>
  );
}
