import { fmtPrice, cn } from '@/lib/utils';

interface PriceProps {
  value: number;
  /** Muestra el sufijo "/kg" como en el diseño. Por defecto `true`. */
  unit?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Precio de marca: dorado, tabular, con sufijo "/kg" opcional.
 * Replica el bloque `.price` del sistema visual.
 */
export function Price({ value, unit = true, className, style }: PriceProps) {
  return (
    <span className={cn('price', className)} style={style}>
      {fmtPrice(value)}
      {unit && <span className="unit">/kg</span>}
    </span>
  );
}
