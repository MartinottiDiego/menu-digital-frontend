'use client';

import { Logo } from '@/components/ui/Logo';
import { Icon } from '@/components/ui/Icons';
import { LoginForm } from '@/components/admin/LoginForm';

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-4">
      <div
        className="w-full max-w-[420px] rounded-[20px] p-8"
        style={{
          background: 'linear-gradient(180deg,var(--panel),var(--card-b))',
          boxShadow: 'inset 0 0 0 1px var(--line), var(--shadow)',
        }}
      >
        <div className="mb-6 flex flex-col items-center gap-4">
          <span
            className="flex h-[54px] w-[54px] items-center justify-center rounded-[14px] text-gold"
            style={{ background: 'rgba(216,162,62,.12)', boxShadow: 'inset 0 0 0 1px var(--line)' }}
          >
            <Icon.lock style={{ width: 26, height: 26 }} />
          </span>
          <Logo />
          <div className="text-center">
            <div className="eyebrow" style={{ color: 'var(--gold)' }}>
              Panel de administración
            </div>
            <p className="mt-1.5 text-[13px] text-tan-dim">
              Acceso solo para el equipo. No visible para clientes.
            </p>
          </div>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
