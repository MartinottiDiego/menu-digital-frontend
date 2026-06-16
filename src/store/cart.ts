import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Cómo se cobra la línea del carrito:
 * - 'unit'  → precio por unidad. total = price * quantity
 * - 'fixed' → por peso, peso fijo por unidad (costillar). total = price(/kg) * weightKg * quantity
 * - 'loose' → por peso, peso a elección del cliente. total = price(/kg) * weightKg  (quantity = 1)
 */
export type CartKind = 'unit' | 'fixed' | 'loose';

export interface CartItem {
  productId: string;
  name: string;
  /** Por unidad (unit) o por kg (fixed/loose). */
  price: number;
  quantity: number;
  imageUrl: string;
  /** Por defecto 'unit' (compatibilidad). */
  kind?: CartKind;
  /** fixed: peso por unidad. loose: kilos elegidos. */
  weightKg?: number;
  /** loose: paso del selector de kilos (default 0.5). */
  stepKg?: number;
  /** loose: peso mínimo (no se puede bajar de acá). */
  minKg?: number;
  /** Stock disponible del producto: el carrito no permite superarlo. */
  stock?: number;
  /** Si la línea es un combo, su id (para enviarlo al backend como comboId). */
  comboId?: string;
  /** Si la línea es una pieza elegida (modo 'pieces'), su id. */
  pieceId?: string;
}

/**
 * Identidad de una línea del carrito. Normalmente es el productId, pero para
 * piezas individuales (modo 'pieces') es productId:pieceId, así dos piezas
 * distintas del mismo producto son dos líneas separadas.
 */
export function cartItemKey(i: Pick<CartItem, 'productId' | 'pieceId'>): string {
  return i.pieceId ? `${i.productId}:${i.pieceId}` : i.productId;
}

/** Limita un valor al stock disponible (si se conoce). */
function capToStock(value: number, stock?: number): number {
  return stock != null && stock >= 0 ? Math.min(value, stock) : value;
}

/** Subtotal de una línea según su tipo de venta. */
export function cartLineTotal(i: CartItem): number {
  const kind = i.kind ?? 'unit';
  if (kind === 'loose') return Math.round(i.price * (i.weightKg ?? 0));
  if (kind === 'fixed') return Math.round(i.price * (i.weightKg ?? 0) * i.quantity);
  return Math.round(i.price * i.quantity);
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  /** key = cartItemKey(item) (productId o productId:pieceId). */
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  updateWeight: (key: string, weightKg: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const key = cartItemKey(item);
          const exists = state.items.find((i) => cartItemKey(i) === key);
          const isLoose = (item.kind ?? 'unit') === 'loose';
          if (exists) {
            return {
              items: state.items.map((i) => {
                if (cartItemKey(i) !== key) return i;
                // Stock fresco si vino, si no el guardado. Nunca se supera.
                const stock = item.stock ?? i.stock;
                // Peso a elección: se suman los kilos. Resto: se suma la cantidad.
                if (isLoose) {
                  const kg = (i.weightKg ?? 0) + (item.weightKg ?? 0);
                  return { ...i, ...item, stock, weightKg: capToStock(kg, stock) };
                }
                const qty = i.quantity + item.quantity;
                return { ...i, ...item, stock, quantity: capToStock(qty, stock) };
              }),
            };
          }
          const capped = isLoose
            ? { ...item, weightKg: capToStock(item.weightKg ?? 0, item.stock) }
            : { ...item, quantity: capToStock(item.quantity, item.stock) };
          return { items: [...state.items, capped] };
        }),

      removeItem: (key) =>
        set((state) => ({
          items: state.items.filter((i) => cartItemKey(i) !== key),
        })),

      updateQuantity: (key, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            cartItemKey(i) === key
              ? { ...i, quantity: Math.max(1, capToStock(quantity, i.stock)) }
              : i
          ),
        })),

      updateWeight: (key, weightKg) =>
        set((state) => ({
          items: state.items.map((i) =>
            cartItemKey(i) === key
              ? { ...i, weightKg: Math.max(0, capToStock(weightKg, i.stock)) }
              : i
          ),
        })),

      clearCart: () => set({ items: [] }),

      getTotal: () => get().items.reduce((sum, i) => sum + cartLineTotal(i), 0),
    }),
    { name: 'miinuta-cart' }
  )
);
