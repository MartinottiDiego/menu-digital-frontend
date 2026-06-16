'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  id?: string;
}

export function Select({
  value,
  onChange,
  options,
  placeholder = 'Seleccionar',
  className = '',
  id,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value);
  const displayValue = selectedOption?.label ?? placeholder;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (opt: SelectOption) => {
    onChange(opt.value);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        id={id}
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full min-w-0 items-center justify-between gap-2 rounded-xl border border-gold-300/20 bg-dark-800 px-4 py-3 text-left text-white focus:border-gold-300/50 focus:outline-none focus:ring-2 focus:ring-gold-300/20"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={id ? `${id}-label` : undefined}
      >
        <span className="truncate">{displayValue}</span>
        <ChevronDown
          className={`size-4 shrink-0 text-white/70 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          className="absolute left-0 right-0 top-full z-50 mt-1 max-h-[min(200px,50vh)] overflow-y-auto rounded-xl border border-gold-300/20 bg-dark-800 py-1 shadow-xl"
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              role="option"
              type="button"
              onClick={() => handleSelect(opt)}
              aria-selected={value === opt.value}
              className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                value === opt.value
                  ? 'bg-gold-300/20 font-medium text-gold-200'
                  : 'text-white hover:bg-dark-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
