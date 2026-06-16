import { Icon, type IconName } from '@/components/ui/Icons';

/** Tarjeta/panel base del admin (gradiente + borde dorado tenue). */
export function Panel({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={className}
      style={{
        borderRadius: 16,
        background: 'linear-gradient(180deg,var(--panel),var(--card-b))',
        boxShadow: 'inset 0 0 0 1px var(--line)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** Encabezado de página del admin: título display + subtítulo + acciones. */
export function AdminPageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="font-display text-[26px] text-cream lg:text-[30px]">{title}</h1>
        {subtitle && <div className="mt-1 text-[13.5px] text-tan-dim">{subtitle}</div>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </header>
  );
}

/** Tarjeta de métrica del dashboard. */
export function StatCard({
  icon,
  value,
  label,
  delta,
  up = true,
}: {
  icon: IconName;
  value: string | number;
  label: string;
  delta?: string;
  up?: boolean;
}) {
  const I = Icon[icon];
  return (
    <Panel style={{ padding: '20px 22px' }}>
      <div className="flex items-start justify-between">
        <span
          className="flex h-[42px] w-[42px] items-center justify-center rounded-[12px] text-gold"
          style={{ background: 'rgba(216,162,62,.12)' }}
        >
          <I style={{ width: 21, height: 21 }} />
        </span>
        {delta && (
          <span
            className="text-[12px] font-bold"
            style={{ color: up ? '#5bbd7a' : 'var(--tan-dim)' }}
          >
            {delta}
          </span>
        )}
      </div>
      <div className="font-display mt-4 text-[30px] text-cream lg:text-[32px]">{value}</div>
      <div className="eyebrow mt-1">{label}</div>
    </Panel>
  );
}
