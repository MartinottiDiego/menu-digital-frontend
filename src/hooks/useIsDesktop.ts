'use client';

import { useState, useEffect } from 'react';

/**
 * true cuando el viewport es >= lg (1024px). Sirve para cambiar la presentación
 * de los modales: drawer desde la derecha en desktop, centrado en mobile.
 */
export function useIsDesktop(query = '(min-width: 1024px)'): boolean {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setIsDesktop(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, [query]);
  return isDesktop;
}
