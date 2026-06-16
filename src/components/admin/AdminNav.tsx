'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';
import { LogOut, Menu, X, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/auth';
import { useToast } from '@/hooks/useToast';
import { Logo } from '@/components/ui/Logo';

const navLinks: readonly {
  href: string;
  label: string;
  Icon?: LucideIcon;
}[] = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/products', label: 'Productos' },
  { href: '/admin/categories', label: 'Categorías' },
  { href: '/admin/orders', label: 'Pedidos' },
  { href: '/admin/analytics', label: 'Analíticas', Icon: BarChart3 },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const toast = useToast();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    setMobileOpen(false);
    useAuthStore.getState().logout();
    toast.success('Sesión cerrada');
    router.push('/admin/login');
  };

  const linkClass = (isActive: boolean) =>
    `block text-sm font-medium uppercase tracking-wide transition-colors ${
      isActive
        ? 'border-l-2 border-gold-300 text-gold-200'
        : 'text-white/70 hover:text-white'
    }`;

  return (
    <nav className="sticky top-0 z-50 border-b border-gold-300/20 bg-dark-800">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-2.5"
          onClick={() => setMobileOpen(false)}
        >
          <Logo className="scale-[0.7]" />
          <span className="eyebrow" style={{ color: 'var(--gold)' }}>
            Panel
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map(({ href, label, Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 text-sm font-medium uppercase tracking-wide transition-colors ${
                  isActive
                    ? 'border-b-2 border-gold-300 text-gold-200'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {Icon ? <Icon className="size-4 shrink-0 opacity-90" /> : null}
                {label}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-dark-700 hover:text-white"
            aria-label="Cerrar sesión"
          >
            <LogOut className="size-4" />
            Cerrar sesión
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 text-white/70 transition-colors hover:bg-dark-700 hover:text-white md:hidden"
          aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-gold-300/10 md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {navLinks.map(({ href, label, Icon }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={`${linkClass(isActive)} flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-dark-700/50`}
                  >
                    {Icon ? <Icon className="size-4 shrink-0 opacity-90" /> : null}
                    {label}
                  </Link>
                );
              })}
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-3 text-left text-sm font-medium text-white/70 transition-colors hover:bg-dark-700/50 hover:text-white rounded-lg"
              >
                <LogOut className="size-4" />
                Cerrar sesión
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
