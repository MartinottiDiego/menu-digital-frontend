'use client';

import { Icon, type IconName } from '@/components/ui/Icons';
import { useSettings } from '@/components/layout/SettingsProvider';

// Íconos fijos que rotan para las tarjetas de valores (el texto es editable).
const VALUE_ICONS: IconName[] = ['steak', 'cleaver', 'truck', 'snow', 'check'];

export function NosotrosContent() {
  const settings = useSettings();
  const paragraphs = settings.aboutText
    .split('\n')
    .map((p) => p.trim())
    .filter(Boolean);
  const values = settings.aboutValues ?? [];
  const stats = settings.aboutStats ?? [];
  const hero = settings.aboutImageUrl;

  return (
    <div className="mx-auto max-w-[1440px]">
      {/* ---------- Mobile: header con foto ---------- */}
      <div className="lg:hidden">
        <div className="relative h-[196px] overflow-hidden">
          {hero && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={hero} alt="Carnicería" className="h-full w-full object-cover" />
          )}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(180deg,rgba(12,8,5,.1),var(--bg))' }}
          />
          <div className="absolute inset-x-[22px] bottom-4">
            <div className="eyebrow" style={{ color: 'var(--gold)' }}>
              Nuestra historia
            </div>
            <h1 className="font-display mt-[6px] text-[26px] leading-none text-cream">
              {settings.aboutTitle}
            </h1>
          </div>
        </div>
        <div className="space-y-3 px-[22px] py-[18px]">
          {paragraphs.map((p, i) => (
            <p
              key={i}
              className={
                i === 0
                  ? 'text-[14px] leading-[1.6] text-tan'
                  : 'text-[13.5px] leading-[1.6] text-tan-dim'
              }
            >
              {p}
            </p>
          ))}
        </div>
      </div>

      {/* ---------- Desktop: split texto + foto ---------- */}
      <section className="hidden items-center gap-12 px-14 pb-5 pt-12 lg:grid lg:grid-cols-2">
        <div>
          <div className="eyebrow" style={{ color: 'var(--gold)' }}>
            Nuestra historia
          </div>
          <h1 className="font-display mb-5 mt-[14px] text-[50px] leading-[0.98] text-cream">
            {settings.aboutTitle}
          </h1>
          <div className="space-y-4">
            {paragraphs.map((p, i) => (
              <p
                key={i}
                className={
                  i === 0
                    ? 'text-[16px] leading-[1.65] text-tan'
                    : 'text-[15px] leading-[1.65] text-tan-dim'
                }
              >
                {p}
              </p>
            ))}
          </div>
        </div>
        <div
          className="h-[380px] overflow-hidden rounded-[20px]"
          style={{ boxShadow: 'var(--shadow)' }}
        >
          {hero && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={hero} alt="Carnicería" className="h-full w-full object-cover" />
          )}
        </div>
      </section>

      {/* ---------- Valores ---------- */}
      {values.length > 0 && (
        <section className="grid grid-cols-1 gap-3 px-[22px] py-2 sm:grid-cols-3 lg:gap-[18px] lg:px-14 lg:pb-[18px] lg:pt-7">
          {values.map((v, i) => {
            const I = Icon[VALUE_ICONS[i % VALUE_ICONS.length]];
            return (
              <div
                key={i}
                className="flex items-center gap-3.5 rounded-[16px] p-[14px_16px] sm:flex-col sm:items-start sm:p-[28px_26px]"
                style={{
                  background: 'linear-gradient(180deg,var(--card-a),var(--card-b))',
                  boxShadow: 'inset 0 0 0 1px var(--line)',
                }}
              >
                <span className="inline-flex shrink-0 text-gold">
                  <I style={{ width: 30, height: 30, strokeWidth: 1.5 }} />
                </span>
                <div>
                  <div className="font-bold text-cream sm:mb-2 sm:mt-4 sm:text-[18px]">
                    {v.title}
                  </div>
                  <div className="text-[12.5px] leading-[1.55] text-tan-dim sm:text-[14px]">
                    {v.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      )}

      {/* ---------- Stats (desktop) ---------- */}
      {stats.length > 0 && (
        <section className="hidden px-14 pb-[52px] pt-[30px] lg:block">
          <div
            className="grid gap-4 rounded-[16px] p-[34px_8px]"
            style={{
              gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))`,
              background: 'linear-gradient(180deg,var(--panel),var(--card-b))',
              boxShadow: 'inset 0 0 0 1px var(--line)',
            }}
          >
            {stats.map((s, i) => (
              <div
                key={i}
                className="text-center"
                style={
                  i < stats.length - 1
                    ? { boxShadow: 'inset -1px 0 0 var(--line-soft)' }
                    : undefined
                }
              >
                <div className="font-display text-[38px] text-gold">{s.value}</div>
                <div className="eyebrow mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
