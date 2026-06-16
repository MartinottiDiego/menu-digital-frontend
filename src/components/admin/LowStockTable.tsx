'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { Product } from '@/lib/types';

interface LowStockTableProps {
  products: Product[];
}

export function LowStockTable({ products }: LowStockTableProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-gold-300/20 bg-dark-800 p-6">
        <h3 className="mb-4 font-semibold text-gold-200">
          Productos con stock bajo
        </h3>
        <p className="text-sm text-white/50">No hay productos con stock bajo.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gold-300/20 bg-dark-800 overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/10 bg-dark-700/50 px-4 py-3">
        <h3 className="font-semibold text-gold-200">
          Stock bajo ({products.length})
        </h3>
        <Link
          href="/admin/products"
          className="flex items-center gap-1 text-sm text-gold-200 transition-colors hover:text-gold-100"
        >
          Ver todos
          <ChevronRight className="size-4" />
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-gold-200/80">
              <th className="px-4 py-3">Producto</th>
              <th className="px-4 py-3 text-right">Stock</th>
              <th className="w-12 px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product._id}
                className="border-b border-white/5 transition-colors last:border-0 hover:bg-dark-700/50"
              >
                <td className="px-4 py-3 font-medium text-white">
                  {product.name}
                </td>
                <td className="px-4 py-3 text-right">
                  <span
                    className={
                      product.stock < 5
                        ? 'font-semibold text-red-400'
                        : 'text-orange-400'
                    }
                  >
                    {product.stock}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Link
                    href="/admin/products"
                    className="text-gold-200 transition-colors hover:text-gold-100"
                    aria-label={`Editar ${product.name}`}
                  >
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
