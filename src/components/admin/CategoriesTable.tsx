'use client';

import { Edit, Trash2 } from 'lucide-react';
import type { Category } from '@/lib/types';

interface CategoriesTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${
        active
          ? 'border-green-400/30 bg-green-600/20 text-green-400'
          : 'border-red-400/30 bg-red-600/20 text-red-400'
      }`}
    >
      {active ? 'Activa' : 'Inactiva'}
    </span>
  );
}

function truncate(str: string, maxLen: number) {
  if (!str) return '—';
  return str.length <= maxLen ? str : str.slice(0, maxLen) + '…';
}

export function CategoriesTable({
  categories,
  onEdit,
  onDelete,
}: CategoriesTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gold-300/20 bg-dark-800">
      {/* Desktop table */}
      <table className="hidden w-full min-w-[500px] md:table">
        <thead>
          <tr className="border-b border-white/10 bg-dark-700">
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gold-200">
              Nombre
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gold-200">
              Descripción
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gold-200">
              Estado
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gold-200">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr
              key={category._id}
              className="border-b border-white/10 transition-colors hover:bg-dark-700/50"
            >
              <td className="px-4 py-3">
                <span className="font-semibold text-gold-200">
                  {category.name}
                </span>
              </td>
              <td className="max-w-[200px] px-4 py-3 text-white/70">
                {truncate(category.description || '', 60)}
              </td>
              <td className="px-4 py-3">
                <StatusBadge active={category.active} />
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(category)}
                    className="rounded-lg p-2 text-white/70 transition-colors hover:bg-gold-300/10 hover:text-gold-200"
                    aria-label="Editar"
                  >
                    <Edit className="size-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(category)}
                    className="rounded-lg p-2 text-white/70 transition-colors hover:bg-red-500/10 hover:text-red-400"
                    aria-label="Eliminar"
                  >
                    <Trash2 className="size-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile cards */}
      <div className="space-y-4 p-4 md:hidden">
        {categories.map((category) => (
          <div
            key={category._id}
            className="rounded-lg border border-white/10 bg-dark-700/50 p-4"
          >
            <span className="block text-lg font-semibold text-gold-200">
              {category.name}
            </span>
            <p className="mt-1 line-clamp-2 text-sm text-white/70">
              {category.description || '—'}
            </p>
            <div className="mt-3 flex items-center justify-between">
              <StatusBadge active={category.active} />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onEdit(category)}
                  className="flex items-center gap-2 rounded-lg border border-gold-300/30 px-3 py-2 text-sm text-gold-200 transition-colors hover:bg-gold-300/10"
                >
                  <Edit className="size-4" />
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(category)}
                  className="flex items-center gap-2 rounded-lg border border-red-400/30 px-3 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/10"
                >
                  <Trash2 className="size-4" />
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
