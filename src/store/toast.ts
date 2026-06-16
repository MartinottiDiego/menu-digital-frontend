import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  createdAt: number;
}

interface ToastStore {
  toasts: ToastItem[];
  showToast: (message: string, type?: ToastType) => string;
  hideToast: (id: string) => void;
}

let idCounter = 0;
const generateId = () => `toast-${++idCounter}-${Date.now()}`;

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],

  showToast: (message, type = 'info') => {
    const id = generateId();
    const item: ToastItem = {
      id,
      message,
      type,
      createdAt: Date.now(),
    };
    set((state) => ({ toasts: [...state.toasts, item] }));
    return id;
  },

  hideToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
}));
