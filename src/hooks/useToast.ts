import { useCallback } from 'react';
import { useToastStore } from '@/store/toast';

export function useToast() {
  const showToast = useToastStore((s) => s.showToast);
  const hideToast = useToastStore((s) => s.hideToast);

  return {
    success: useCallback((msg: string) => showToast(msg, 'success'), [showToast]),
    error: useCallback((msg: string) => showToast(msg, 'error'), [showToast]),
    info: useCallback((msg: string) => showToast(msg, 'info'), [showToast]),
    warning: useCallback((msg: string) => showToast(msg, 'warning'), [showToast]),
    hide: hideToast,
  };
}
