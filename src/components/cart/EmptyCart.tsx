import Link from 'next/link';
import { Icon } from '@/components/ui/Icons';

export function EmptyCart() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-12 text-center">
      <span
        className="mb-6 flex h-[88px] w-[88px] items-center justify-center rounded-full text-gold"
        style={{ background: 'rgba(216,162,62,.12)', boxShadow: 'inset 0 0 0 1px var(--line)' }}
      >
        <Icon.cart style={{ width: 38, height: 38 }} />
      </span>
      <h2 className="font-display text-[26px] text-cream">Tu carrito está vacío</h2>
      <p className="mt-2 text-tan-dim">
        Descubrí nuestros cortes y empezá a agregar.
      </p>
      <Link href="/menu" className="btn btn-gold mt-7 h-[50px] px-7 text-[14px]">
        <Icon.bag style={{ width: 17, height: 17 }} /> Ver catálogo
      </Link>
    </div>
  );
}
