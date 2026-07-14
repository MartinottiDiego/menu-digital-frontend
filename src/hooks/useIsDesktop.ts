'use client';

import { useState, useEffect } from 'react';

/**
 * true cuando el viewport es >= lg (1024px). Sirve para cambiar la presentación
 * de los modales: drawer desde la derecha en desktop, centrado en mobile.
 */
export function useIsDesktop(query = '(min-width: 1024px)'): boolean {
  // Inicializa con el valor real del viewport: si arranca en false y se corrige
  // recién en el efecto, los modales montan con initial={opacity:0} (variante
  // mobile) y al cambiar a la variante desktop framer-motion deja de animar
  // opacity, que queda clavada en 0 (panel transparente).
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches
  );
  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setIsDesktop(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, [query]);
  return isDesktop;
}
