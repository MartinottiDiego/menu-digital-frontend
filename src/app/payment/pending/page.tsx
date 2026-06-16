'use client';

import Link from 'next/link';
import { Icon } from '@/components/ui/Icons';
import { PageTransition } from '@/components/layout/PageTransition';

export default function PaymentPendingPage() {
  return (
    <PageTransition>
      <section className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-12 text-center">
        <span
          className="mb-6 flex h-[76px] w-[76px] items-center justify-center rounded-full text-gold"
          style={{ background: 'rgba(216,162,62,.14)' }}
        >
          <Icon.clock style={{ width: 34, height: 34 }} />
        </span>
        <h1 className="font-display text-[30px] text-cream lg:text-[40px]">
          Pago pendiente
        </h1>
        <p className="mt-3 max-w-md text-tan">
          Estamos esperando la confirmación del pago. Te avisamos por WhatsApp
          cuando se procese.
        </p>
        <Link href="/" className="btn btn-gold mt-7 h-[50px] px-7 text-[14px]">
          Volver al inicio
        </Link>
      </section>
    </PageTransition>
  );
}
