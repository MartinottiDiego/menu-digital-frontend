import { cn } from '@/lib/utils';

interface WordmarkProps {
  /** Tamaño tipográfico (clases Tailwind). Por defecto `text-xl`. */
  className?: string;
  /** Si es `false`, no muestra el punto dorado del final. Por defecto `true`. */
  withDot?: boolean;
}

/**
 * Wordmark de marca: "MIINUTA" en crema (Zilla Slab) con un punto dorado.
 * Variante inline (una línea) del logo, para usos compactos.
 */
export function Wordmark({ className, withDot = true }: WordmarkProps) {
  return (
    <span
      className={cn(
        'font-logo font-bold uppercase tracking-[0.04em] text-cream',
        className
      )}
    >
      MIINUTA
      {withDot && <span className="text-gold">.</span>}
    </span>
  );
}
