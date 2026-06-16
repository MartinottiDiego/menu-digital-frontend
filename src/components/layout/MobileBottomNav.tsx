'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/store/cart';
import { Icon } from '@/components/ui/Icons';
import { cn } from '@/lib/utils';

const TABS = [
  { id: 'inicio', label: 'Inicio', icon: Icon.home, href: '/' },
  { id: 'catalogo', label: 'Catálogo', icon: Icon.grid, href: '/menu' },
  { id: 'carrito', label: 'Carrito', icon: Icon.cart, href: '/cart' },
  { id: 'pedidos', label: 'Pedidos', icon: Icon.clipboard, href: '/mis-pedidos' },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const itemCount = useCartStore((s) =>
    s.items.reduce((sum, i) => sum + i.quantity, 0)
  );

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  // El detalle de producto tiene su propia barra fija de "Agregar": ocultamos
  // la tab bar para que no se solapen.
  if (pathname.startsWith('/producto')) return null;

  return (
    <nav className="m-tabs sticky bottom-0 z-40 lg:hidden" aria-label="Navegación inferior">
      {TABS.map(({ id, label, icon: I, href }) => (
        <Link key={id} href={href} className={cn('m-tab', isActive(href) && 'active')}>
          <span className="relative">
            <I />
            {id === 'carrito' && itemCount > 0 && (
              <span className="badge-count tnum" style={{ top: -6, right: -8 }}>
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </span>
          <span className="tl">{label}</span>
        </Link>
      ))}
    </nav>
  );
}
