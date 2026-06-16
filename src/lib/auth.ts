import { useAuthStore } from '@/store/auth';

/**
 * Hook para verificar autenticación en componentes
 */
export function useAuth() {
  const { token, isAuthenticated, logout } = useAuthStore();
  return { token, isAuthenticated, logout };
}

/**
 * Función para hacer requests autenticados
 */
export async function authFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = useAuthStore.getState().token;

  const res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (res.status === 401) {
    useAuthStore.getState().logout();
    window.location.href = '/admin/login';
  }

  return res;
}
