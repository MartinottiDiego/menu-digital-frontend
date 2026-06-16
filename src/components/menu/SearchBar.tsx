'use client';

import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative flex-1">
      <Search
        className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-white/50"
        aria-hidden
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar milanesas..."
        className="w-full rounded-xl border border-gold-300/20 bg-dark-800 py-3 pl-12 pr-12 text-white placeholder:text-white/50 focus:border-gold-300/50 focus:outline-none focus:ring-2 focus:ring-gold-300/20"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
          aria-label="Limpiar búsqueda"
        >
          <X className="size-5" />
        </button>
      )}
    </div>
  );
}
