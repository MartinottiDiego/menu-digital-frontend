'use client';

import { motion } from 'framer-motion';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'warning';
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = 'default',
}: MetricCardProps) {
  const borderClass =
    variant === 'warning'
      ? 'border-orange-400/40 hover:border-orange-400/60'
      : 'border-gold-300/20 hover:border-gold-300/40';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border bg-dark-800 p-6 transition-colors ${borderClass}`}
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium uppercase tracking-wide text-white/70">
            {title}
          </p>
          <p className="mt-2 truncate text-3xl font-bold text-gold-200">
            {value}
          </p>
          {subtitle && (
            <p className="mt-1 text-xs text-white/50">{subtitle}</p>
          )}
          {trend && (
            <p
              className={`mt-2 flex items-center gap-1 text-xs font-medium ${
                trend.isPositive ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        {icon && (
          <div className="ml-2 shrink-0 opacity-50">{icon}</div>
        )}
      </div>
    </motion.div>
  );
}
