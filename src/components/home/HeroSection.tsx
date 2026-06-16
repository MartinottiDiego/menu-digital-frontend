'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import {
  SITE_LANDING_IMAGE_URL,
  WHATSAPP_NUMBER,
  WHATSAPP_MESSAGE,
  WHATSAPP_MESSAGE_DELIVERY,
} from '@/lib/constants';
import { getWhatsAppUrl } from '@/lib/utils';
import { trackEvent } from '@/lib/analytics';
import { MapPin } from 'lucide-react';

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export function HeroSection() {
  const whatsappUrl = getWhatsAppUrl(WHATSAPP_NUMBER, WHATSAPP_MESSAGE);
  const whatsappDeliveryUrl = getWhatsAppUrl(
    WHATSAPP_NUMBER,
    WHATSAPP_MESSAGE_DELIVERY
  );

  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-hidden px-4">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${SITE_LANDING_IMAGE_URL})` }}
        aria-hidden
      />
      {/* Dark blur overlay for contrast */}
      <div
        className="absolute inset-0 backdrop-blur-[4px] bg-black/80"
        aria-hidden
      />

      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-5xl font-bold tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] [text-shadow:0_0_20px_rgba(0,0,0,0.8),0_2px_8px_rgba(0,0,0,0.9)] sm:text-6xl md:text-7xl"
        >
          miinuta
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          className="mt-4 max-w-md text-lg text-white/95 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] sm:text-xl"
        >
          La verdadera milanesa artesanal. Crujiente por fuera, increíble por dentro.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
          className="mt-10"
        >
          <Link href="/menu">
            <Button variant="primary" className="text-lg px-8 py-4">
              Ver Menú
            </Button>
          </Link>
        </motion.div>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 flex flex-col items-center gap-4 text-sm text-white/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] sm:flex-row sm:gap-8"
        >
          <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('whatsapp_click', { useBeacon: true })}
            className="flex flex-1 min-w-0 sm:flex-initial sm:min-w-[240px] items-center justify-center gap-2 rounded-lg border border-gold-300/30 bg-dark-800/50 px-4 py-2 transition-all hover:border-gold-300/60 hover:bg-dark-800"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <WhatsAppIcon className="h-5 w-5 shrink-0 text-[#25D366]" />
            <span className="font-medium text-gold-100">
              ¡Hacé tu pedido por WhatsApp!
            </span>
          </motion.a>
          <motion.a
            href={whatsappDeliveryUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('whatsapp_click', { useBeacon: true })}
            className="flex flex-1 min-w-0 sm:flex-initial sm:min-w-[240px] items-center justify-center gap-2 rounded-lg border border-gold-300/30 bg-dark-800/50 px-4 py-2 transition-all hover:border-gold-300/60 hover:bg-dark-800"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MapPin className="h-5 w-5 shrink-0 text-gold-200" />
            <span className="font-medium text-gold-100">
              Delivery: Averigua si llegamos a tu zona
            </span>
          </motion.a>
        </motion.footer>
      </div>
    </section>
  );
}
