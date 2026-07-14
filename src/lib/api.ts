import { API_URL } from './constants';
import type {
  Product,
  PaginatedResponse,
  Category,
  Order,
  LoginResponse,
  CreateOrderPayload,
  Combo,
  ProcessPaymentPayload,
  ProcessPaymentResponse,
  PublicTracking,
  PublicMyOrder,
} from './types';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = 'Error desconocido';
    try {
      const body = await res.json();
      message =
        body.message ||
        body.error ||
        (Array.isArray(body.message) ? body.message.join(', ') : null) ||
        message;
    } catch {
      message = res.statusText || message;
    }
    throw new Error(message);
  }
  return res.json();
}

export const api = {
  // Products
  getProducts: async (params?: {
    page?: number;
    limit?: number;
    categoryId?: string;
    featured?: boolean;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));
    if (params?.categoryId) searchParams.set('categoryId', params.categoryId);
    if (params?.featured) searchParams.set('featured', 'true');
    const query = searchParams.toString();
    const res = await fetch(`${API_URL}/products${query ? `?${query}` : ''}`);
    return handleResponse<PaginatedResponse<Product>>(res);
  },

  getProduct: async (id: string): Promise<Product> => {
    const res = await fetch(`${API_URL}/products/${id}`);
    return handleResponse<Product>(res);
  },

  // Combos
  getCombos: async () => {
    const res = await fetch(`${API_URL}/combos`);
    return handleResponse<PaginatedResponse<Combo>>(res);
  },

  // Categories
  getCategories: async (params?: { page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));
    const query = searchParams.toString();
    const res = await fetch(
      `${API_URL}/categories${query ? `?${query}` : ''}`
    );
    return handleResponse<PaginatedResponse<Category>>(res);
  },

  // Orders
  createOrder: async (orderData: CreateOrderPayload) => {
    const res = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    return handleResponse<Order>(res);
  },

  // Seguimiento público del pedido por token.
  getTracking: async (token: string) => {
    const res = await fetch(`${API_URL}/orders/track/${token}`);
    return handleResponse<PublicTracking>(res);
  },

  // "Mis pedidos": pedidos recientes de un email (datos mínimos, sin dirección ni pago).
  getMyOrders: async (email: string) => {
    const res = await fetch(`${API_URL}/orders/my-orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return handleResponse<PublicMyOrder[]>(res);
  },

  // Recuperar seguimiento: reenvía los links al email (no revela si existe).
  recoverTracking: async (email: string) => {
    const res = await fetch(`${API_URL}/orders/track/recover`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return handleResponse<{ ok: boolean }>(res);
  },

  // Cancela una orden pendiente (libera el stock reservado al abandonar el pago).
  cancelOrder: async (orderId: string) => {
    const res = await fetch(`${API_URL}/orders/${orderId}/cancel`, {
      method: 'POST',
    });
    return handleResponse<{ cancelled: boolean }>(res);
  },

  // Auth
  login: async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse<LoginResponse>(res);
  },

  // Payments
  createPaymentPreference: async (orderId: string) => {
    const res = await fetch(`${API_URL}/payments/create-preference`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId }),
    });
    return handleResponse<{ preferenceId: string; initPoint: string }>(res);
  },

  // Pago transparente (Payment Brick): manda el token tokenizado por MP.
  processPayment: async (payload: ProcessPaymentPayload) => {
    const res = await fetch(`${API_URL}/payments/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse<ProcessPaymentResponse>(res);
  },
};
