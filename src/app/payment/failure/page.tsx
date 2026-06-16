'use client';

import Link from 'next/link';
import { Icon } from '@/components/ui/Icons';
import { PageTransition } from '@/components/layout/PageTransition';

export default function PaymentFailurePage() {
  return (
    <PageTransition>
      <section className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-12 text-center">
        <span
          className="mb-6 flex h-[76px] w-[76px] items-center justify-center rounded-full"
          style={{ background: 'rgba(212,121,107,.14)', color: '#d4796b' }}
        >
          <Icon.lock style={{ width: 34, height: 34 }} />
        </span>
        <h1 className="font-display text-[30px] text-cream lg:text-[40px]">
          Pago rechazado
        </h1>
        <p className="mt-3 max-w-md text-tan">
          Hubo un problema con el pago. Podés intentar nuevamente o escribirnos.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link href="/cart" className="btn btn-gold h-[50px] px-7 text-[14px]">
            Reintentar
          </Link>
          <Link href="/" className="btn btn-ghost h-[50px] px-7 text-[14px]">
            Volver al inicio
          </Link>
        </div>
      </section>
    </PageTransition>
  );
}
