'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/store/cart';
import { Logo } from '@/components/ui/Logo';
import { Icon } from '@/components/ui/Icons';
import { cn, getWhatsAppUrl } from '@/lib/utils';
import { useSettings } from './SettingsProvider';

const NAV = [
  { label: 'Inicio', href: '/' },
  { label: 'Catálogo', href: '/menu' },
  { label: 'Combos', href: '/combos' },
  { label: 'Nosotros', href: '/nosotros' },
  { label: 'Contacto', href: '/contacto' },
  { label: 'Mis pedidos', href: '/mis-pedidos' },
];

/** Sello de marca: la cuchilla dentro del anillo dorado (PNG transparente local). */
const LOGO_BADGE = '/logo-mark.png';

export function Header() {
  const pathname = usePathname();
  const settings = useSettings();
  const [menuOpen, setMenuOpen] = useState(false);
  const itemCount = useCartStore((s) =>
    s.items.reduce((sum, i) => sum + i.quantity, 0)
  );
  const whatsappUrl = getWhatsAppUrl(
    settings.whatsappNumber,
    settings.whatsappMessage
  );

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  // Cierra el drawer al navegar (cambia la ruta), pase lo que pase.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Bloquea el scroll del fondo mientras el drawer está abierto.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 bg-bg/95 backdrop-blur-md">
        {/* Barra de aviso */}
        <div className="announce">
          <span>{settings.announcementText}</span>
          <Icon.truck style={{ width: 16, height: 16 }} />
        </div>

        {/* ---------- Desktop ---------- */}
        <div className="mx-auto hidden max-w-[1440px] items-center justify-between px-8 py-5 lg:flex">
          <Link href="/" aria-label="Inicio" className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={LOGO_BADGE}
              alt="MIINUTA. CARNES"
              width={80}
              height={80}
              className="h-20 w-20 object-contain"
            />
            <Logo />
          </Link>
          <nav className="flex items-center gap-[34px]" aria-label="Navegación principal">
            {NAV.slice(0, 5).map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={cn('nav-link', isActive(n.href) && 'active')}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/mis-pedidos" className="icon-btn" title="Mis pedidos">
              <Icon.clipboard />
            </Link>
            <Link href="/cart" className="icon-btn" aria-label={`Carrito (${itemCount})`}>
              <Icon.cart />
              {itemCount > 0 && (
                <span className="badge-count tnum">{itemCount > 99 ? '99+' : itemCount}</span>
              )}
            </Link>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-gold ml-1.5"
              style={{ height: 42, padding: '0 18px', fontSize: 13 }}
            >
              <Icon.whatsapp style={{ width: 16, height: 16 }} /> Pedí ahora
            </a>
          </div>
        </div>

        {/* ---------- Mobile topbar ---------- */}
        <div className="m-topbar lg:hidden">
          <div className="flex w-14">
            <button
              className="icon-btn"
              aria-label="Menú"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
            >
              <Icon.menu />
            </button>
          </div>
          <Link
            href="/"
            className="flex flex-1 items-center justify-center gap-2"
            aria-label="Inicio"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={LOGO_BADGE}
              alt="MIINUTA. CARNES"
              width={64}
              height={64}
              className="h-16 w-16 object-contain"
            />
            <Logo className="scale-[0.82]" />
          </Link>
          <div className="flex w-14 justify-end">
            <Link href="/cart" className="icon-btn" aria-label={`Carrito (${itemCount})`}>
              <Icon.cart />
              {itemCount > 0 && (
                <span className="badge-count tnum">{itemCount > 99 ? '99+' : itemCount}</span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* ---------- Drawer lateral (mobile) ----------
          IMPORTANTE: va FUERA del <header>. El header tiene `backdrop-blur`, que
          crea un containing block y rompe el `position: fixed` de sus hijos
          (el panel no cubría la página). Como hermano del header, el fixed se
          posiciona respecto al viewport y cubre toda la pantalla. */}
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-[55] bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden',
          menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={() => setMenuOpen(false)}
        aria-hidden
      />
      {/* Panel */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-[60] flex w-[82%] max-w-[320px] flex-col transition-transform duration-300 ease-out lg:hidden',
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        style={{
          background: 'linear-gradient(180deg, #241810, #1a110a)',
          boxShadow: 'inset -1px 0 0 var(--line), 24px 0 60px rgba(0,0,0,.6)',
        }}
        aria-label="Menú de navegación"
        aria-hidden={!menuOpen}
      >
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ boxShadow: 'inset 0 -1px 0 var(--line-soft)' }}
        >
          <Link href="/" className="flex items-center gap-2.5" aria-label="Inicio">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO_BADGE} alt="" width={48} height={48} className="h-12 w-12 object-contain" />
            <Logo className="scale-[0.8]" />
          </Link>
          <button
            className="icon-btn"
            onClick={() => setMenuOpen(false)}
            aria-label="Cerrar menú"
          >
            <Icon.plus style={{ transform: 'rotate(45deg)' }} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-4 py-4" aria-label="Navegación móvil">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setMenuOpen(false)}
              className={cn('nav-link py-3.5 text-[14px]', isActive(n.href) && 'active')}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div
          className="px-4 pb-7 pt-3"
          style={{ boxShadow: 'inset 0 1px 0 var(--line-soft)' }}
        >
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-gold h-[50px] w-full text-[14px]"
          >
            <Icon.whatsapp style={{ width: 17, height: 17 }} /> Pedí por WhatsApp
          </a>
        </div>
      </aside>
    </>
  );
}
