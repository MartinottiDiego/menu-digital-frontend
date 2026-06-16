import type { Metadata } from 'next';
import { ContactoContent } from './ContactoContent';

export const metadata: Metadata = {
  title: 'Contacto · MIINUTA. CARNES',
  description: 'Dónde estamos y cómo hacer tu pedido en Junín (B).',
};

export default function ContactoPage() {
  return <ContactoContent />;
}
