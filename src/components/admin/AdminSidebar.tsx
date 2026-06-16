'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { useToast } from '@/hooks/useToast';
import { Logo } from '@/components/ui/Logo';
import { Icon, type IconName } from '@/components/ui/Icons';
import { cn } from '@/lib/utils';

const NAV: { href: string; label: string; icon: IconName }[] = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: 'trending' },
  { href: '/admin/orders', label: 'Pedidos', icon: 'clipboard' },
  { href: '/admin/products', label: 'Productos', icon: 'box' },
  { href: '/admin/combos', label: 'Combos', icon: 'flame' },
  { href: '/admin/categories', label: 'Categorías', icon: 'grid' },
  { href: '/admin/analytics', label: 'Analíticas', icon: 'dollar' },
  { href: '/admin/settings', label: 'Configuración', icon: 'settings' },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const toast = useToast();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    setOpen(false);
    useAuthStore.getState().logout();
    toast.success('Sesión cerrada');
    router.push('/admin/login');
  };

  const NavItems = ({ onNavigate }: { onNavigate?: () => void }) => (
    <nav className="flex flex-col gap-[3px]">
      {NAV.map(({ href, label, icon }) => {
        const on = pathname === href;
        const I = Icon[icon];
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className="flex items-center gap-3 rounded-[11px] px-[13px] py-[11px] text-[14px] transition-colors"
            style={{
              background: on ? 'rgba(216,162,62,.13)' : 'transparent',
              boxShadow: on ? 'inset 0 0 0 1px var(--line)' : 'none',
              color: on ? 'var(--gold-lite)' : 'var(--tan)',
              fontWeight: on ? 700 : 600,
            }}
          >
            <I style={{ width: 19, height: 19 }} />
            {label}
          </Link>
        );
      })}
    </nav>
  );

  const UserCard = () => (
    <div
      className="flex items-center gap-3 rounded-[11px] px-[13px] py-3"
      style={{ boxShadow: 'inset 0 0 0 1px var(--line)' }}
    >
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-logo text-[16px] font-bold text-[#2a1c08]"
        style={{ background: 'linear-gradient(180deg,var(--gold-lite),var(--gold-deep))' }}
      >
        M
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-bold text-cream">Admin</div>
        <div className="text-[11.5px] text-tan-dim">MIINUTA</div>
      </div>
      <button onClick={handleLogout} className="text-tan-dim hover:text-gold" aria-label="Cerrar sesión">
        <Icon.logout style={{ width: 17, height: 17 }} />
      </button>
    </div>
  );

  return (
    <>
      {/* ---------- Sidebar desktop ---------- */}
      <aside
        className="sticky top-0 hidden h-screen w-[250px] shrink-0 flex-col p-[26px_18px] lg:flex"
        style={{ background: 'var(--bg-2)', boxShadow: 'inset -1px 0 0 var(--line)' }}
      >
        <Link href="/admin/dashboard" className="px-2 pb-2">
          <Logo className="scale-[0.78]" />
        </Link>
        <div className="eyebrow px-3 pb-2.5 pt-[22px]" style={{ color: 'var(--tan-dim)' }}>
          Gestión
        </div>
        <NavItems />
        <div className="mt-auto">
          <UserCard />
        </div>
      </aside>

      {/* ---------- Topbar mobile ---------- */}
      {/* En mobile NO usamos sticky: en Android (Samsung/Chrome) las barras
          sticky dejaban "fantasmas" de repintado al scrollear. Scrollea normal. */}
      <div
        className="relative z-50 flex items-center justify-between px-4 py-3 lg:hidden"
        style={{
          background: 'var(--bg-2)',
          boxShadow: 'inset 0 -1px 0 var(--line)',
        }}
      >
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <Logo className="scale-[0.7]" />
          <span className="eyebrow" style={{ color: 'var(--gold)' }}>
            Panel
          </span>
        </Link>
        <button className="icon-btn" onClick={() => setOpen((o) => !o)} aria-label="Menú">
          {open ? <Icon.plus style={{ transform: 'rotate(45deg)' }} /> : <Icon.menu />}
        </button>
      </div>

      {open && (
        <div
          className="relative z-40 flex flex-col gap-4 px-4 py-4 lg:hidden"
          style={{
            background: 'var(--bg-2)',
            boxShadow: 'inset 0 -1px 0 var(--line)',
          }}
        >
          <NavItems onNavigate={() => setOpen(false)} />
          <UserCard />
        </div>
      )}
    </>
  );
}
