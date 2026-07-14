/** Cómo se vende el producto e interpreta `price`. (Legacy) */
export type SellBy = 'unit' | 'weight';

/**
 * Modo de venta (modelo nuevo, más claro). Si está, manda sobre `sellBy`.
 * - 'unit'   → por unidad. price = total por unidad, stock = unidades.
 * - 'bulk'   → granel por peso. price = $/kg, stock = kg, min/step de compra.
 * - 'pieces' → piezas individuales. price = $/kg, el cliente elige una pieza.
 */
export type SellMode = 'unit' | 'bulk' | 'pieces';

/** Una pieza individual (modo 'pieces'): ej. un matambre de 3.2 kg. */
export interface ProductPiece {
  _id?: string;
  weightKg: number;
  available: boolean;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  /** sellBy=unit → total por unidad. sellBy=weight → precio por kg. */
  price: number;
  /** Por defecto 'unit' (compatibilidad con productos viejos). */
  sellBy?: SellBy;
  /** Modo de venta (nuevo). Si está, manda sobre sellBy. */
  sellMode?: SellMode;
  /** Solo 'pieces': lista de piezas individuales con su peso. */
  pieces?: ProductPiece[];
  /** Legacy weight: peso fijo por unidad (costillar). Si no está, peso a elección. */
  unitWeightKg?: number;
  /** Granel ('bulk') / legacy suelto: peso mínimo del selector (default 0.5). */
  minWeightKg?: number;
  /** Granel ('bulk') / legacy suelto: paso del selector (default 0.5). */
  stepWeightKg?: number;
  /** Granel: si el stock restante es ≤ esto, se lleva entero (0/undef = off). */
  wholeThresholdKg?: number;
  stock: number;
  imageUrl: string;
  videoUrl?: string;
  category: Category;
  active: boolean;
  displayOrder: number;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  description: string;
  active: boolean;
}

export interface OrderItem {
  productId: string;
  quantity: number;
}

export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'preparing'
  | 'on_the_way'
  | 'ready_for_pickup'
  | 'delivered'
  | 'cancelled'
  | 'failed';

/** Entrada del historial de estados (para la línea de tiempo). */
export interface OrderStatusEntry {
  status: OrderStatus;
  at: string;
}

/** Subset público del pedido para la página de seguimiento (GET /orders/track/:token). */
export interface PublicTracking {
  orderNumber: string;
  customerName: string;
  status: OrderStatus;
  deliveryMethod?: DeliveryMethod;
  total: number;
  createdAt: string;
  statusHistory: OrderStatusEntry[];
  items: {
    name: string;
    quantity: number;
    weightKg?: number;
    lineTotal: number;
  }[];
}

/** Fila de "Mis pedidos" (búsqueda pública por email, datos mínimos). */
export interface PublicMyOrder {
  orderNumber: string;
  status: OrderStatus;
  total: number;
  createdAt: string;
  trackingToken: string | null;
  items: string[];
}

/** Método de entrega del pedido. */
export type DeliveryMethod = 'delivery' | 'pickup';

export interface Order {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  customerEmail?: string;
  deliveryMethod?: DeliveryMethod;
  items: {
    product?: {
      _id: string;
      name: string;
      price: number;
    };
    combo?: string;
    name?: string;
    quantity: number;
    priceAtOrder: number;
    weightKg?: number;
    lineTotal?: number;
  }[];
  total: number;
  status: OrderStatus;
  /** Token para el link de seguimiento público. */
  trackingToken?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateOrderStatusDto {
  status: OrderStatus;
}

/** Payload del pago transparente (Payment Brick) hacia el backend. */
export interface ProcessPaymentPayload {
  orderId: string;
  /** UUID único por intento (previene pagos duplicados). */
  idempotencyKey: string;
  token?: string;
  paymentMethodId: string;
  installments?: number;
  issuerId?: string;
  /** Device ID del SDK de MP (mejora la tasa de aprobación antifraude). */
  deviceId?: string;
  payer: {
    email?: string;
    identification?: { type?: string; number?: string };
  };
}

/** Respuesta del backend al procesar el pago. */
export interface ProcessPaymentResponse {
  paymentId: string;
  status: string;
  statusDetail: string;
  /** Cupón para pagos en efectivo (Pago Fácil / Rapipago). */
  ticketUrl: string;
}

export interface Payment {
  _id: string;
  orderId: string;
  preferenceId?: string;
  paymentId?: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  mpResponse?: {
    id?: number | string;
    status?: string;
    status_detail?: string;
    transaction_amount?: number;
    date_approved?: string | null;
    date_created?: string;
    payment_method_id?: string;
    payer?: { email?: string; id?: string };
    external_reference?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CheckoutFormData {
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  customerZipCode?: string;
  customerEmail?: string;
  deliveryMethod: DeliveryMethod;
  notes?: string;
}

export interface CreateOrderPayload {
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  customerZipCode?: string;
  customerEmail?: string;
  deliveryMethod?: DeliveryMethod;
  items: {
    productId?: string;
    comboId?: string;
    /** Pieza elegida (modo 'pieces'). */
    pieceId?: string;
    quantity: number;
    weightKg?: number;
  }[];
}

export interface Combo {
  _id: string;
  name: string;
  description?: string;
  serves?: string;
  price: number;
  oldPrice?: number;
  imageUrl?: string;
  items: string[];
  active: boolean;
  displayOrder: number;
}

export interface CreateComboDto {
  name: string;
  description?: string;
  serves?: string;
  price: number;
  oldPrice?: number;
  imageUrl?: string;
  items?: string[];
}

export interface UpdateComboDto {
  name?: string;
  description?: string;
  serves?: string;
  price?: number;
  oldPrice?: number;
  imageUrl?: string;
  items?: string[];
  active?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
}

export interface CreateProductDto {
  name: string;
  description?: string;
  price: number;
  sellBy?: SellBy;
  sellMode?: SellMode;
  pieces?: ProductPiece[];
  unitWeightKg?: number;
  minWeightKg?: number;
  stepWeightKg?: number;
  /** Granel: si el stock restante es ≤ esto, se lleva entero (0/undef = off). */
  wholeThresholdKg?: number;
  stock: number;
  imageUrl?: string;
  videoUrl?: string;
  category: string;
  featured?: boolean;
  active?: boolean;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  sellBy?: SellBy;
  sellMode?: SellMode;
  pieces?: ProductPiece[];
  unitWeightKg?: number;
  minWeightKg?: number;
  stepWeightKg?: number;
  /** Granel: si el stock restante es ≤ esto, se lleva entero (0/undef = off). */
  wholeThresholdKg?: number;
  stock?: number;
  imageUrl?: string;
  videoUrl?: string;
  category?: string;
  active?: boolean;
  featured?: boolean;
}

export interface CreateCategoryDto {
  name: string;
  description?: string;
}

export interface UpdateCategoryDto {
  name?: string;
  description?: string;
  active?: boolean;
}

export type AnalyticsPeriod = 'week' | 'month' | 'year';

export interface OverviewResult {
  totalVisits: number;
  uniqueVisitors: number;
  uniqueSessions: number;
  whatsappClicks: number;
}

export interface DailyVisit {
  date: string;
  visits: number;
  uniqueVisitors: number;
}

export interface PageVisit {
  path: string;
  visits: number;
}

export interface DeviceBreakdown {
  device: string;
  count: number;
}

export interface EventSummary {
  event: string;
  count: number;
}
