'use client';

import { Edit, Trash2 } from 'lucide-react';
import type { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils';

interface ProductsTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
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
      {active ? 'Activo' : 'Inactivo'}
    </span>
  );
}

export function ProductsTable({
  products,
  onEdit,
  onDelete,
}: ProductsTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gold-300/20 bg-dark-800">
      {/* Desktop table */}
      <table className="hidden w-full min-w-[700px] md:table">
        <thead>
          <tr className="border-b border-white/10 bg-dark-700">
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gold-200">
              Imagen
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gold-200">
              Nombre
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gold-200">
              Categoría
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gold-200">
              Precio
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gold-200">
              Stock
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
          {products.map((product) => (
            <tr
              key={product._id}
              className="border-b border-white/10 transition-colors hover:bg-dark-700/50"
            >
              <td className="px-4 py-3">
                <div className="flex size-[50px] items-center justify-center overflow-hidden rounded-lg bg-dark-600">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt=""
                      className="size-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-white/40">—</span>
                  )}
                </div>
              </td>
              <td className="px-4 py-3">
                <span className="font-semibold text-gold-200">
                  {product.name}
                </span>
              </td>
              <td className="px-4 py-3 text-white/80">
                {typeof product.category === 'object'
                  ? product.category.name
                  : '—'}
              </td>
              <td className="px-4 py-3 text-white/90">
                {formatPrice(product.price)}
              </td>
              <td className="px-4 py-3 text-white/90">{product.stock}</td>
              <td className="px-4 py-3">
                <StatusBadge active={product.active} />
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(product)}
                    className="rounded-lg p-2 text-white/70 transition-colors hover:bg-gold-300/10 hover:text-gold-200"
                    aria-label="Editar"
                  >
                    <Edit className="size-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(product)}
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
        {products.map((product) => (
          <div
            key={product._id}
            className="rounded-lg border border-white/10 bg-dark-700/50 p-4"
          >
            <div className="flex gap-4">
              <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-dark-600">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt=""
                    className="size-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-white/40">—</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <span className="font-semibold text-gold-200">
                  {product.name}
                </span>
                <p className="mt-0.5 text-sm text-white/70">
                  {typeof product.category === 'object'
                    ? product.category.name
                    : '—'}
                </p>
                <p className="mt-1 text-white/90">{formatPrice(product.price)}</p>
                <div className="mt-2 flex items-center gap-3">
                  <StatusBadge active={product.active} />
                  <span className="text-sm text-white/70">Stock: {product.stock}</span>
                </div>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => onEdit(product)}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gold-300/30 py-2 text-gold-200 transition-colors hover:bg-gold-300/10"
              >
                <Edit className="size-4" />
                Editar
              </button>
              <button
                type="button"
                onClick={() => onDelete(product)}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-400/30 py-2 text-red-400 transition-colors hover:bg-red-500/10"
              >
                <Trash2 className="size-4" />
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
