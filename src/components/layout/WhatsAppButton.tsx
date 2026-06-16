'use client';

import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { getWhatsAppUrl } from '@/lib/utils';
import { WHATSAPP_NUMBER, WHATSAPP_MESSAGE } from '@/lib/constants';
import { trackEvent } from '@/lib/analytics';

export function WhatsAppButton() {
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) return null;

  const whatsappUrl = getWhatsAppUrl(WHATSAPP_NUMBER, WHATSAPP_MESSAGE);

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent('whatsapp_click', { useBeacon: true })}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg hover:bg-[#20bd5a]"
      style={{ boxShadow: '0 4px 20px rgba(37, 211, 102, 0.4)' }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1 }}
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="h-7 w-7" strokeWidth={2} />
    </motion.a>
  );
}
