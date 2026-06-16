'use client';

import { motion } from 'framer-motion';
import type { Category } from '@/lib/types';

interface CategoryFilterProps {
  categories: Category[];
  selected: string | null;
  onSelect: (categoryId: string | null) => void;
}

export function CategoryFilter({
  categories,
  selected,
  onSelect,
}: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-track-dark-800 scrollbar-thumb-gold-300/30">
      <motion.button
        type="button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onSelect(null)}
        className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
          selected === null
            ? 'bg-gold-200 text-dark-900'
            : 'border border-gold-300/50 text-gold-200 hover:bg-gold-200/10'
        }`}
      >
        Todas
      </motion.button>
      {categories.map((cat) => (
        <motion.button
          key={cat._id}
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(cat._id)}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
            selected === cat._id
              ? 'bg-gold-200 text-dark-900'
              : 'border border-gold-300/50 text-gold-200 hover:bg-gold-200/10'
          }`}
        >
          {cat.name}
        </motion.button>
      ))}
    </div>
  );
}
