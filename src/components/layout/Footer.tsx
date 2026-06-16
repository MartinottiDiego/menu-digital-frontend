'use client';

import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { Icon } from '@/components/ui/Icons';
import { getWhatsAppUrl } from '@/lib/utils';
import { useSettings } from './SettingsProvider';

const COLS: [string, { label: string; href: string }[]][] = [
  [
    'Tienda',
    [
      { label: 'Catálogo', href: '/menu' },
      { label: 'Combos', href: '/combos' },
      { label: 'Cortes premium', href: '/menu' },
      { label: 'Congelados', href: '/menu' },
    ],
  ],
  [
    'Empresa',
    [
      { label: 'Nosotros', href: '/nosotros' },
      { label: 'Sucursal', href: '/contacto' },
      { label: 'Contacto', href: '/contacto' },
    ],
  ],
  [
    'Ayuda',
    [
      { label: 'Cómo pedir', href: '/contacto' },
      { label: 'Zona de entrega', href: '/contacto' },
      { label: 'Mis pedidos', href: '/mis-pedidos' },
    ],
  ],
];

export function Footer() {
  const settings = useSettings();
  const whatsappUrl = getWhatsAppUrl(
    settings.whatsappNumber,
    settings.whatsappMessage
  );

  return (
    <footer className="mt-2 hidden border-t border-[var(--line)] px-8 pt-[46px] lg:block">
      <div className="mx-auto flex max-w-[1440px] justify-between gap-10 pb-10">
        <div className="max-w-[300px]">
          <Logo />
          <p className="mt-[18px] text-[13.5px] leading-[1.6] text-tan-dim">
            Carnicería de barrio en Junín. Cortes seleccionados y milanesas al
            día, del mostrador a tu casa.
          </p>
          <div className="mt-[18px] flex gap-2.5">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="icon-btn"
              style={{ boxShadow: 'inset 0 0 0 1px var(--line)' }}
            >
              <Icon.instagram />
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="icon-btn"
              style={{ boxShadow: 'inset 0 0 0 1px var(--line)' }}
            >
              <Icon.whatsapp style={{ width: 19, height: 19 }} />
            </a>
          </div>
        </div>

        {COLS.map(([heading, items]) => (
          <div key={heading}>
            <div className="eyebrow mb-4" style={{ color: 'var(--gold)' }}>
              {heading}
            </div>
            <div className="flex flex-col gap-[11px]">
              {items.map((i) => (
                <Link
                  key={i.label}
                  href={i.href}
                  className="text-[13.5px] text-tan transition-colors hover:text-cream"
                >
                  {i.label}
                </Link>
              ))}
            </div>
          </div>
        ))}

        <div>
          <div className="eyebrow mb-4" style={{ color: 'var(--gold)' }}>
            Contacto
          </div>
          <div className="flex flex-col gap-[11px] text-[13.5px] text-tan">
            <span className="flex items-center gap-[9px]">
              <Icon.mapPin style={{ width: 15, height: 15, color: 'var(--gold)' }} />{' '}
              {settings.deliveryZone}
            </span>
            <span className="flex items-center gap-[9px]">
              <Icon.phone style={{ width: 15, height: 15, color: 'var(--gold)' }} />{' '}
              {settings.phone}
            </span>
            <span className="flex items-center gap-[9px]">
              <Icon.clock style={{ width: 15, height: 15, color: 'var(--gold)' }} />{' '}
              {settings.hours}
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1440px] justify-between border-t border-[var(--line-soft)] py-[18px] pb-[22px] text-[12.5px] text-tan-dim">
        <span>© 2026 MIINUTA. CARNES · Junín, Buenos Aires</span>
        <span>Hecho con fuego 🔥 en el barrio</span>
      </div>
    </footer>
  );
}
