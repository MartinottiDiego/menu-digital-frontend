import { API_URL } from './constants';

/** Configuración del negocio editable desde el admin. */
export interface Settings {
  businessName: string;
  address: string;
  phone: string;
  whatsappNumber: string;
  whatsappMessage: string;
  email: string;
  instagram: string;
  deliveryZone: string;
  hours: string;
  announcementText: string;
  deliveryEnabled: boolean;
  pickupEnabled: boolean;
  // Ubicación en el mapa (coordenadas exactas del local)
  lat: number | null;
  lng: number | null;
  mapZoom: number;
  // Nosotros
  aboutTitle: string;
  aboutText: string;
  aboutImageUrl: string;
  aboutValues: { title: string; desc: string }[];
  aboutStats: { value: string; label: string }[];
}

/** Defaults de fallback: si el backend no responde, el sitio igual muestra algo válido. */
export const DEFAULT_SETTINGS: Settings = {
  businessName: 'MIINUTA. CARNES',
  address: 'Av. San Martín 1234, Junín (B)',
  phone: '+549 2364 26-1926',
  whatsappNumber: '+5492364261926',
  whatsappMessage: 'Hola! Quiero hacer un pedido 🔥',
  email: 'hola@miinuta.com.ar',
  instagram: '@miinuta.carnes',
  deliveryZone: 'Junín (B) y alrededores',
  hours: 'Lun a Sáb · 08–22 h · Dom cerrado',
  announcementText: 'Delivery en Junín (B) y alrededores · Lun a Sáb 08–22h',
  deliveryEnabled: true,
  pickupEnabled: true,
  lat: -34.6405,
  lng: -60.994833,
  mapZoom: 16,
  aboutTitle: 'Carniceros de tres generaciones',
  aboutText:
    'MIINUTA nació como una carnicería de barrio en Junín y sigue siéndolo. Lo que cambió es que ahora llegamos a tu casa con la misma calidad de siempre.\n\nElegimos cada corte, elaboramos las milanesas todos los días y atendemos como nos gusta que nos atiendan: de frente y sin vueltas.',
  aboutImageUrl:
    'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=800&q=75&auto=format&fit=crop',
  aboutValues: [
    { title: 'Selección estricta', desc: 'Trabajamos con proveedores de confianza y elegimos cada media res a mano.' },
    { title: 'Oficio de carnicero', desc: 'Cortes a pedido, como los hacía el abuelo. Nada de góndola.' },
    { title: 'Del barrio a tu casa', desc: 'Delivery propio en Junín. Lo que ves en el mostrador, llega fresco.' },
  ],
  aboutStats: [
    { value: '+30', label: 'años en el barrio' },
    { value: '15', label: 'cortes distintos' },
    { value: '100%', label: 'elaboración propia' },
    { value: '4.9★', label: 'en reseñas' },
  ],
};

export async function fetchSettings(): Promise<Settings> {
  const res = await fetch(`${API_URL}/settings`);
  if (!res.ok) throw new Error('No se pudo cargar la configuración');
  const data = await res.json();
  // Merge con defaults por si falta algún campo.
  return { ...DEFAULT_SETTINGS, ...data };
}
