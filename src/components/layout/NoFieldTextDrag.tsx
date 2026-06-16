'use client';

import { useEffect } from 'react';

/**
 * Desactiva el drag & drop nativo de TEXTO en campos (input / textarea), que
 * permitía "mover" el valor de un campo a otro arrastrándolo con el mouse.
 *
 * Filtra por el tipo de elemento, así que NO afecta el drop de imágenes
 * (dropzone es un div) ni el reordenar por arrastre (filas draggables).
 */
export function NoFieldTextDrag() {
  useEffect(() => {
    const isField = (t: EventTarget | null) =>
      t instanceof HTMLElement &&
      (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA');
    const onDragStart = (e: DragEvent) => {
      if (isField(e.target)) e.preventDefault();
    };
    const onDrop = (e: DragEvent) => {
      if (isField(e.target)) e.preventDefault();
    };
    document.addEventListener('dragstart', onDragStart, true);
    document.addEventListener('drop', onDrop, true);
    return () => {
      document.removeEventListener('dragstart', onDragStart, true);
      document.removeEventListener('drop', onDrop, true);
    };
  }, []);
  return null;
}
