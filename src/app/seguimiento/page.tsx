'use client';

import { useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Logo } from '@/components/ui/Logo';
import { Icon } from '@/components/ui/Icons';
import { PageTransition } from '@/components/layout/PageTransition';

export default function RecoverTrackingPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      // No revela si el email existe: siempre mostramos el mismo mensaje.
      await api.recoverTracking(email.trim()).catch(() => {});
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <header
        className="flex items-center justify-between px-[20px] py-5 lg:px-14"
        style={{ boxShadow: 'inset 0 -1px 0 var(--line)' }}
      >
        <Link href="/" aria-label="Inicio">
          <Logo className="scale-90 lg:scale-100" />
        </Link>
        <Link href="/menu" className="btn btn-ghost h-[42px] px-5 text-[13px]">
          Catálogo
        </Link>
      </header>

      <section className="mx-auto max-w-[460px] px-[22px] pb-16 pt-12 lg:pt-16">
        {sent ? (
          <div className="text-center">
            <div
              className="mx-auto inline-flex h-[60px] w-[60px] items-center justify-center rounded-full text-[#2a1c08]"
              style={{ background: 'linear-gradient(180deg,var(--gold-lite),var(--gold))' }}
            >
              <Icon.mail style={{ width: 28, height: 28 }} />
            </div>
            <h1 className="font-display mt-4 text-[26px] text-cream">Revisá tu correo</h1>
            <p className="mt-2 text-[14.5px] text-tan-dim">
              Si tenés pedidos recientes con ese email, te enviamos los links de
              seguimiento. Mirá también la carpeta de spam.
            </p>
            <button
              onClick={() => {
                setSent(false);
                setEmail('');
              }}
              className="mt-6 text-[13px] font-semibold text-tan-dim underline-offset-4 hover:underline"
            >
              Usar otro email
            </button>
          </div>
        ) : (
          <>
            <h1 className="font-display text-[28px] text-cream lg:text-[34px]">
              Seguí tu pedido
            </h1>
            <p className="mt-2 mb-7 text-[14.5px] text-tan-dim">
              Ingresá el email con el que compraste y te reenviamos el link de
              seguimiento de tus pedidos recientes.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="field">
                <span className="field-lbl">Email</span>
                <div className="field-input">
                  <Icon.mail />
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="btn btn-gold h-[52px] text-[14.5px]"
                style={loading || !email.trim() ? { opacity: 0.55, cursor: 'not-allowed' } : undefined}
              >
                {loading ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#2a1c08] border-t-transparent" />
                    Enviando…
                  </>
                ) : (
                  'Enviarme el link'
                )}
              </button>
            </form>
          </>
        )}
      </section>
    </PageTransition>
  );
}
