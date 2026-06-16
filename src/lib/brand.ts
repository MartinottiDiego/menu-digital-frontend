/* MIINUTA. CARNES — datos de marca estáticos (no provienen del backend).
   Categorías destacadas, features, combos y contacto, portados del diseño. */
import type { IconName } from '@/components/ui/Icons';

export interface BrandCategory {
  id: string;
  label: string;
  icon: IconName;
  href: string;
}

/** Accesos rápidos fijos de la home: 3 categorías (filtran el catálogo por
 *  nombre; si la categoría no existe aún, el catálogo queda vacío) + Combos. */
export const BRAND_CATEGORIES: BrandCategory[] = [
  { id: 'carnes', label: 'Carnes', icon: 'steak', href: '/menu?cat=Carnes' },
  { id: 'milanesas', label: 'Milanesas', icon: 'mila', href: '/menu?cat=Milanesas' },
  { id: 'congelados', label: 'Congelados', icon: 'snow', href: '/menu?cat=Congelados' },
  { id: 'combos', label: 'Combos', icon: 'flame', href: '/combos' },
];

export interface BrandFeature {
  icon: IconName;
  title: string;
  desc: string;
}

export const BRAND_FEATURES: BrandFeature[] = [
  { icon: 'steak', title: 'Cortes seleccionados', desc: 'La mejor calidad en cada elección' },
  { icon: 'cleaver', title: 'Elaboración diaria', desc: 'Milanesas frescas todos los días' },
  { icon: 'snow', title: 'Productos congelados', desc: 'Conservá calidad y sabor' },
  { icon: 'truck', title: 'Delivery a domicilio', desc: 'Rápido, seguro y confiable' },
];

export interface Combo {
  id: string;
  name: string;
  serves: string;
  price: number;
  old: number;
  img: string;
  items: string[];
}

const IMG = (id: string, w = 800) =>
  `https://images.unsplash.com/${id}?w=${w}&q=75&auto=format&fit=crop`;

export const COMBOS: Combo[] = [
  {
    id: 'c-asado',
    name: 'Combo Asado',
    serves: '8 a 10 personas',
    price: 48000,
    old: 56000,
    img: IMG('photo-1558030006-450675393462'),
    items: ['2 kg de asado de tira', '1 kg de vacío', '6 chorizos parrilleros', '500 g de mollejas'],
  },
  {
    id: 'c-milas',
    name: 'Combo Milanesas',
    serves: 'Familiar',
    price: 22000,
    old: 25500,
    img: IMG('photo-1562967914-608f82629710'),
    items: ['2 kg de milanesa de ternera', '1 kg de milanesa de pollo', '1 kg de papas bastón'],
  },
  {
    id: 'c-premium',
    name: 'Combo Parrilla Premium',
    serves: '6 personas',
    price: 59000,
    old: 68000,
    img: IMG('photo-1613454320437-0c228c8b1723'),
    items: ['2 bifes de chorizo', '1 entraña', '500 g de mollejas', '4 chorizos'],
  },
];

export const NOSOTROS_VALUES: { icon: IconName; t: string; d: string }[] = [
  { icon: 'steak', t: 'Selección estricta', d: 'Trabajamos con proveedores de confianza y elegimos cada media res a mano.' },
  { icon: 'cleaver', t: 'Oficio de carnicero', d: 'Cortes a pedido, como los hacía el abuelo. Nada de góndola.' },
  { icon: 'truck', t: 'Del barrio a tu casa', d: 'Delivery propio en Junín. Lo que ves en el mostrador, llega fresco.' },
];

export const NOSOTROS_STATS: [string, string][] = [
  ['+30', 'años en el barrio'],
  ['15', 'cortes distintos'],
  ['100%', 'elaboración propia'],
  ['4.9★', 'en reseñas'],
];

export interface StatusMeta {
  label: string;
  color: string;
  bg: string;
}

/** Meta visual de estados de pedido (alineado con OrderStatus del backend). */
export const STATUS_META: Record<string, StatusMeta> = {
  pending: { label: 'Pendiente', color: '#e0a93a', bg: 'rgba(224,169,58,.14)' },
  paid: { label: 'Pagado', color: '#5bbd7a', bg: 'rgba(91,189,122,.14)' },
  preparing: { label: 'En preparación', color: '#e0a93a', bg: 'rgba(224,169,58,.14)' },
  delivered: { label: 'Entregado', color: '#8ea6c4', bg: 'rgba(142,166,196,.14)' },
  cancelled: { label: 'Cancelado', color: '#d4796b', bg: 'rgba(212,121,107,.14)' },
};

export interface MyOrder {
  id: string;
  date: string;
  items: string;
  total: number;
  status: string;
}

/** Pedidos de ejemplo para "Mis pedidos" (demo; sin backend de lookup aún). */
export const MY_ORDERS: MyOrder[] = [
  { id: '1042', date: 'Hoy · 12:48', items: 'Milanesa de ternera, Bife de chorizo, Asado tira', total: 32400, status: 'preparing' },
  { id: '1021', date: '2 jun · 19:30', items: 'Vacío, Chorizos parrilleros', total: 18700, status: 'delivered' },
  { id: '0998', date: '24 may · 11:15', items: 'Milanesa de pollo, Hamburguesas caseras', total: 17100, status: 'delivered' },
];

export const CONTACT_INFO = {
  address: 'Av. San Martín 1234, Junín (B)',
  hours: 'Lun a Sáb · 08–22 h · Dom cerrado',
  instagram: '@miinuta.carnes',
  email: 'hola@miinuta.com.ar',
};

export { IMG as unsplash };
