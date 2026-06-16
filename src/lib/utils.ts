/**
 * Genera URL de WhatsApp con mensaje predefinido.
 * Usa api.whatsapp.com en vez de wa.me para evitar que los emojis se corrompan en desktop/web.
 */
export function getWhatsAppUrl(phone: string, message: string): string {
  const cleanPhone = phone.replace(/[^0-9+]/g, '').replace(/^\+/, '');
  const encodedMessage = encodeURIComponent(message.normalize('NFC'));
  return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedMessage}`;
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(value);
}

/**
 * Formato de precio de marca: "$12.900" (sin decimales), como en el diseño.
 */
export function fmtPrice(value: number): string {
  return '$' + Math.round(value).toLocaleString('es-AR');
}

/**
 * Une clases condicionalmente (filtra falsy). Versión liviana de clsx.
 */
export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(' ');
}
