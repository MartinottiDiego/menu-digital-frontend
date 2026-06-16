export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4001';

/** Public Key de MercadoPago (para tokenizar la tarjeta en el navegador / Brick).
 *  Debe ser de la MISMA cuenta/credenciales que el MP_ACCESS_TOKEN del back
 *  (ambas TEST-... o ambas APP_USR-...). */
export const MP_PUBLIC_KEY = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY ?? '';

/** Imagen del preview al compartir (WhatsApp, redes, etc.): el emblema/logo
 *  de la marca. Forzamos f_jpg para que los scrapers sociales lo rendericen
 *  sin problemas, cuadrado 1200px. */
export const SITE_LANDING_IMAGE_URL =
  'https://res.cloudinary.com/dmaciisvy/image/upload/f_jpg,q_auto,w_1200/v1781018089/WhatsApp_Image_2026-06-09_at_00.50.34_qowvpq.jpg';

export const SITE_NAME = 'miinuta';
export const CONTACT_PHONE = '+549 2364 26-1926';
export const DELIVERY_ZONE = 'Junín (B) y alrededores';
export const BUSINESS_HOURS = 'Lun-Sab 08:00-22:00';

export const WHATSAPP_NUMBER = '+5492364261926';
export const WHATSAPP_MESSAGE =
  'Hola! Me interesa pedir milanesas. ¿Están atendiendo ahora? 🔥';
export const WHATSAPP_MESSAGE_DELIVERY =
  'Hola miinuta! Quiero consultar por el delivery. 📍';
