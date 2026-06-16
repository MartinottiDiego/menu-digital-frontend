import type { Metadata } from 'next';
import { NosotrosContent } from './NosotrosContent';

export const metadata: Metadata = {
  title: 'Nosotros · MIINUTA. CARNES',
  description: 'Carniceros de tres generaciones. Carnicería de barrio en Junín.',
};

export default function NosotrosPage() {
  return <NosotrosContent />;
}
