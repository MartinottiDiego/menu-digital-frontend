import type { Metadata } from 'next';
import { CombosContent } from './CombosContent';

export const metadata: Metadata = {
  title: 'Combos · MIINUTA. CARNES',
  description: 'Packs pensados para la parrilla del finde. Más cantidad, mejor precio.',
};

export default function CombosPage() {
  return <CombosContent />;
}
