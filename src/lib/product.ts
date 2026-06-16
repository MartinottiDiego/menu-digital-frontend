import type { Product, ProductPiece, SellMode } from './types';
import type { CartItem, CartKind } from '@/store/cart';

/**
 * Modo de venta efectivo (modelo nuevo). Si el producto no tiene `sellMode`
 * (productos viejos), se deriva de `sellBy` para no romper compatibilidad.
 */
export function productMode(p: Product): SellMode {
  if (p.sellMode) return p.sellMode;
  return (p.sellBy ?? 'unit') === 'weight' ? 'bulk' : 'unit';
}

/** Piezas disponibles de un producto por piezas. */
export function availablePieces(p: Product): ProductPiece[] {
  return (p.pieces ?? []).filter((pc) => pc.available);
}

/** Precio total de una pieza = peso × $/kg. */
export function piecePrice(p: Product, piece: ProductPiece): number {
  return Math.round(p.price * piece.weightKg);
}

/** CartItem desde una pieza elegida: línea de peso fijo (kind 'fixed') + pieceId. */
export function buildPieceCartItem(p: Product, piece: ProductPiece): CartItem {
  return {
    productId: p._id,
    name: p.name,
    price: p.price, // $/kg
    imageUrl: p.imageUrl || '',
    quantity: 1,
    kind: 'fixed',
    weightKg: piece.weightKg,
    pieceId: piece._id,
    stock: 1,
  };
}

/** Tipo de venta efectivo del producto para el carrito. */
export function productKind(p: Product): CartKind {
  if ((p.sellBy ?? 'unit') !== 'weight') return 'unit';
  return p.unitWeightKg && p.unitWeightKg > 0 ? 'fixed' : 'loose';
}

export function isWeightProduct(p: Product): boolean {
  return (p.sellBy ?? 'unit') === 'weight';
}

/** Precio principal a mostrar en una card. unit: total · fixed: peso×$/kg · loose: $/kg. */
export function productDisplayPrice(p: Product): number {
  return productKind(p) === 'fixed'
    ? Math.round(p.price * (p.unitWeightKg ?? 0))
    : p.price;
}

/** Sufijo del precio: '/kg' solo para corte suelto. */
export function productPriceUnit(p: Product): string {
  return productKind(p) === 'loose' ? '/kg' : '';
}

export function looseStep(p: Product): number {
  return p.stepWeightKg && p.stepWeightKg > 0 ? p.stepWeightKg : 0.5;
}

export function looseMin(p: Product): number {
  return p.minWeightKg && p.minWeightKg > 0 ? p.minWeightKg : looseStep(p);
}

/**
 * ¿El carrito ya tiene TODO el stock disponible de este producto?
 *  - unidad/fijo → se compara por unidades (quantity).
 *  - granel (loose) → se compara por kilos acumulados (weightKg).
 * Sirve para que el botón "+" pase a "Ver carrito" al llegar al tope.
 */
export function reachedStockMax(items: CartItem[], product: Product): boolean {
  if (!product.stock || product.stock <= 0) return false;
  const item = items.find((i) => i.productId === product._id && !i.pieceId);
  if (!item) return false;
  if (productKind(product) === 'loose') {
    return (item.weightKg ?? 0) >= product.stock - 1e-6;
  }
  return (item.quantity ?? 0) >= product.stock;
}

/** Construye el CartItem desde un producto + cantidad/peso elegidos. */
export function buildCartItem(
  p: Product,
  quantity = 1,
  weightKg?: number
): CartItem {
  const kind = productKind(p);
  const wk =
    kind === 'fixed'
      ? p.unitWeightKg
      : kind === 'loose'
        ? (weightKg ?? looseMin(p))
        : undefined;
  return {
    productId: p._id,
    name: p.name,
    price: p.price,
    imageUrl: p.imageUrl || '',
    quantity: kind === 'loose' ? 1 : quantity,
    kind,
    weightKg: wk,
    // Paso/mínimo solo para peso a elección (granel), así el carrito sube los
    // kilos igual que el detalle del producto.
    stepKg: kind === 'loose' ? looseStep(p) : undefined,
    minKg: kind === 'loose' ? looseMin(p) : undefined,
    stock: p.stock,
  };
}
