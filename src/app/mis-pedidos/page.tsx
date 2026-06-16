'use client';

import { useState } from 'react';
import { MY_ORDERS } from '@/lib/brand';
import { fmtPrice, cn } from '@/lib/utils';
import { Icon } from '@/components/ui/Icons';
import { StatusPill } from '@/components/ui/StatusPill';

export default function MisPedidosPage() {
  const [mode, setMode] = useState<'phone' | 'email'>('phone');
  const [value, setValue] = useState('');
  const [searched, setSearched] = useState(false);

  const results = searched ? MY_ORDERS : [];

  return (
    <div className="mx-auto max-w-[880px] px-[20px] pb-12 pt-6 lg:px-14 lg:pb-14 lg:pt-11">
      <div className="eyebrow" style={{ color: 'var(--gold)' }}>
        Seguí tu pedido
      </div>
      <h1 className="font-display my-3 mb-2.5 text-[30px] text-cream lg:text-[46px]">
        Mis pedidos
      </h1>
      <p className="mb-6 max-w-[560px] text-[14px] text-tan lg:text-[16px]">
        Ingresá tu teléfono o email y te mostramos el estado de tus pedidos. No
        hace falta registrarse.
      </p>

      {/* Toggle teléfono/email */}
      <div
        className="mb-3.5 flex w-full max-w-[260px] gap-1.5 rounded-[12px] p-1.5"
        style={{ background: 'var(--panel)', boxShadow: 'inset 0 0 0 1px var(--line)' }}
      >
        {(['phone', 'email'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={cn(
              'flex-1 rounded-[8px] py-[9px] text-[12.5px] font-bold transition-colors',
              mode === m ? 'text-[#2a1c08]' : 'text-tan'
            )}
            style={mode === m ? { background: 'var(--gold)', fontWeight: 800 } : undefined}
          >
            {m === 'phone' ? 'Teléfono' : 'Email'}
          </button>
        ))}
      </div>

      {/* Campo de búsqueda */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSearched(true);
        }}
        className="mb-6 flex flex-col gap-2.5 sm:flex-row sm:items-end"
      >
        <div className="field-input flex-1 sm:max-w-[320px]">
          {mode === 'phone' ? <Icon.phone /> : <Icon.mail />}
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={mode === 'phone' ? '236 555-1234' : 'tu@email.com'}
            inputMode={mode === 'phone' ? 'tel' : 'email'}
          />
        </div>
        <button type="submit" className="btn btn-gold h-[48px] px-6 text-[14px]">
          <Icon.search style={{ width: 17, height: 17 }} /> Buscar pedidos
        </button>
      </form>

      {searched && (
        <>
          <div className="eyebrow mb-3.5">
            {results.length} {results.length === 1 ? 'pedido encontrado' : 'pedidos encontrados'}
          </div>
          <div className="flex flex-col gap-3.5">
            {results.map((o) => (
              <div
                key={o.id}
                className="rounded-[16px] p-[16px_18px] lg:p-[20px_24px]"
                style={{
                  background: 'linear-gradient(180deg,var(--card-a),var(--card-b))',
                  boxShadow: 'inset 0 0 0 1px var(--line)',
                }}
              >
                {/* mobile */}
                <div className="lg:hidden">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="tnum text-[14px] font-extrabold text-gold">
                      #{o.id}
                    </span>
                    <StatusPill status={o.status} />
                  </div>
                  <div className="mb-2 text-[13px] leading-[1.4] text-tan">{o.items}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-tan-dim">{o.date}</span>
                    <span className="price tnum" style={{ fontSize: 16 }}>
                      {fmtPrice(o.total)}
                    </span>
                  </div>
                </div>
                {/* desktop */}
                <div className="hidden items-center gap-[22px] lg:flex">
                  <div className="min-w-[92px]">
                    <div className="tnum text-[17px] font-extrabold text-gold">
                      #{o.id}
                    </div>
                    <div className="mt-[3px] text-[12.5px] text-tan-dim">{o.date}</div>
                  </div>
                  <div className="min-w-0 flex-1 text-[14.5px] text-tan">{o.items}</div>
                  <StatusPill status={o.status} />
                  <span
                    className="price tnum min-w-[90px] text-right"
                    style={{ fontSize: 20 }}
                  >
                    {fmtPrice(o.total)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
