'use client';

import { Icon, type IconName } from '@/components/ui/Icons';
import { getWhatsAppUrl } from '@/lib/utils';
import { unsplash } from '@/lib/brand';
import { useSettings } from '@/components/layout/SettingsProvider';

const MAP = unsplash('photo-1524661135-423995f22d0b', 800);
const MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;

export function ContactoContent() {
  const settings = useSettings();
  const whatsappUrl = getWhatsAppUrl(
    settings.whatsappNumber,
    settings.whatsappMessage
  );

  // Mapa real si hay coordenadas cargadas. Con API key usamos la Maps Embed API
  // en vista SATELITAL (ideal para una quinta rural: se ve el terreno). Sin key,
  // caemos al iframe keyless (mapa de calles), y si tampoco hay coords, al fondo
  // decorativo.
  const hasCoords = settings.lat != null && settings.lng != null;
  const coords = `${settings.lat},${settings.lng}`;
  const zoom = settings.mapZoom || 16;
  let mapSrc = '';
  if (hasCoords && MAPS_KEY) {
    mapSrc = `https://www.google.com/maps/embed/v1/place?key=${MAPS_KEY}&q=${coords}&zoom=${zoom}&maptype=satellite`;
  } else if (hasCoords) {
    mapSrc = `https://www.google.com/maps?q=${coords}&z=${zoom}&output=embed`;
  }
  const hasMap = !!mapSrc;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coords}`;

  const rows: [IconName, string, string][] = [
    ['mapPin', 'Dirección', settings.address],
    ['phone', 'Teléfono / WhatsApp', settings.phone],
    ['clock', 'Horario', settings.hours],
    ['mail', 'Email', settings.email],
    ['instagram', 'Instagram', settings.instagram],
  ];

  return (
    <div className="mx-auto max-w-[1440px] px-[18px] pb-12 pt-6 lg:px-14 lg:pb-[52px] lg:pt-11">
      <div className="eyebrow" style={{ color: 'var(--gold)' }}>
        Estamos cerca
      </div>
      <h1 className="font-display my-3 mb-7 text-[30px] text-cream lg:text-[48px]">
        Contacto y pedidos
      </h1>

      <div className="grid grid-cols-1 gap-7 lg:grid-cols-[1fr_1.15fr]">
        {/* Filas de contacto */}
        <div className="flex flex-col gap-3.5">
          {rows.map(([ic, t, v]) => {
            const I = Icon[ic];
            return (
              <div
                key={t}
                className="flex items-center gap-4 rounded-[14px] p-[18px_22px]"
                style={{
                  background: 'linear-gradient(180deg,var(--card-a),var(--card-b))',
                  boxShadow: 'inset 0 0 0 1px var(--line)',
                }}
              >
                <span
                  className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-[12px] text-gold"
                  style={{ background: 'rgba(216,162,62,.12)' }}
                >
                  <I style={{ width: 22, height: 22 }} />
                </span>
                <div>
                  <div className="eyebrow">{t}</div>
                  <div className="mt-[3px] text-[16px] font-bold text-cream">{v}</div>
                </div>
              </div>
            );
          })}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-gold mt-1 h-[54px] text-[15px]"
          >
            <Icon.whatsapp style={{ width: 18, height: 18 }} /> Escribinos por
            WhatsApp
          </a>
        </div>

        {/* Mapa */}
        <div>
          <div
            className="relative h-[320px] overflow-hidden rounded-[18px] lg:h-auto lg:min-h-[480px]"
            style={{ boxShadow: 'var(--shadow)', background: '#1a2620' }}
          >
            {hasMap ? (
              <iframe
                title={`Ubicación de ${settings.businessName}`}
                src={mapSrc}
                className="absolute inset-0 h-full w-full"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={MAP}
                  alt="Mapa"
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ opacity: 0.55 }}
                />
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(180deg,rgba(12,8,5,.2),rgba(12,8,5,.75))' }}
                />
                <div className="absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2 text-gold">
                  <Icon.mapPin style={{ width: 52, height: 52 }} />
                </div>
              </>
            )}

            {/* Overlay con nombre/dirección — SOLO desktop. En mobile taparía
                el mapa, así que ahí va debajo (ver tarjeta lg:hidden). */}
            <div
              className="pointer-events-none absolute inset-x-6 bottom-6 hidden items-center justify-between gap-3 rounded-[14px] p-[18px_22px] lg:flex"
              style={{
                background: 'rgba(20,13,8,.82)',
                backdropFilter: 'blur(6px)',
                boxShadow: 'inset 0 0 0 1px var(--line)',
              }}
            >
              <div>
                <div className="font-display text-[22px] text-cream">
                  {settings.businessName}
                </div>
                <div className="mt-1 text-[14px] text-tan">{settings.address}</div>
              </div>
              {hasMap && (
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-gold pointer-events-auto h-[44px] shrink-0 px-5 text-[14px]"
                >
                  <Icon.mapPin style={{ width: 16, height: 16 }} /> Cómo llegar
                </a>
              )}
            </div>
          </div>

          {/* En mobile la tarjeta va DEBAJO del mapa, sin taparlo. */}
          <div
            className="mt-3 flex flex-col gap-3 rounded-[14px] p-[16px_18px] lg:hidden"
            style={{
              background: 'linear-gradient(180deg,var(--card-a),var(--card-b))',
              boxShadow: 'inset 0 0 0 1px var(--line)',
            }}
          >
            <div>
              <div className="font-display text-[20px] text-cream">
                {settings.businessName}
              </div>
              <div className="mt-1 text-[14px] text-tan">{settings.address}</div>
            </div>
            {hasMap && (
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-gold h-[48px] text-[14px]"
              >
                <Icon.mapPin style={{ width: 16, height: 16 }} /> Cómo llegar
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
