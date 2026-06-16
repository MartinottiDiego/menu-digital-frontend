'use client';

import { useState, useRef, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';

const TIP_WIDTH = 240;
const MARGIN = 8;

/**
 * Ayuda contextual: un "?" que muestra una explicación al pasar el mouse, al
 * enfocarlo con teclado o al tocarlo (mobile).
 *
 * El cartelito se renderiza en un PORTAL (fuera del modal) y con `position:
 * fixed` acotado a la pantalla, así nunca se corta ni genera scroll horizontal,
 * aunque el "?" esté pegado al borde.
 */
export function InfoTip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  useLayoutEffect(() => {
    if (!open || !ref.current) {
      setPos(null);
      return;
    }
    const r = ref.current.getBoundingClientRect();
    let left = r.left + r.width / 2 - TIP_WIDTH / 2;
    left = Math.max(
      MARGIN,
      Math.min(left, window.innerWidth - TIP_WIDTH - MARGIN)
    );
    setPos({ top: r.top - MARGIN, left });
  }, [open]);

  return (
    <>
      <span
        ref={ref}
        tabIndex={0}
        role="button"
        aria-label={text}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={(e) => {
          e.preventDefault();
          setOpen((o) => !o);
        }}
        className="ml-1.5 inline-flex h-[18px] w-[18px] cursor-help items-center justify-center rounded-full border border-gold-300/50 align-middle text-[11px] font-bold leading-none text-gold-300/90 outline-none focus:ring-2 focus:ring-gold-300/50"
      >
        ?
      </span>
      {open &&
        pos &&
        typeof document !== 'undefined' &&
        createPortal(
          <span
            role="tooltip"
            style={{
              position: 'fixed',
              top: pos.top,
              left: pos.left,
              width: TIP_WIDTH,
              transform: 'translateY(-100%)',
            }}
            className="pointer-events-none z-[100] rounded-lg border border-gold-300/25 bg-dark-900 px-3 py-2 text-[12px] font-normal leading-snug text-white/90 shadow-2xl"
          >
            {text}
          </span>,
          document.body
        )}
    </>
  );
}
