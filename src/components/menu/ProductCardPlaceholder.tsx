'use client';

/**
 * Placeholder invisible que reserva el espacio de una ProductCard.
 * Misma estructura que ProductCard para mantener dimensiones idénticas.
 */
export function ProductCardPlaceholder() {
  return (
    <div
      aria-hidden
      className="pointer-events-none invisible flex min-h-[300px] flex-col rounded-xl border border-gold-300/20 bg-dark-800 p-3 sm:min-h-[360px] sm:p-4 md:min-h-[400px]"
    >
      <div className="aspect-[4/3] w-full rounded-lg bg-dark-700" />
      <div className="mt-3 h-5 w-3/4" />
      <div className="mt-2 h-4 w-full" />
      <div className="mt-1 h-4 w-2/3" />
      <div className="mt-2 h-6 w-1/3" />
      <div className="mt-4 h-11 w-full" />
    </div>
  );
}
