'use client';

import { motion } from 'framer-motion';
import { Minus, Plus, Trash2 } from 'lucide-react';
import type { CartItem as CartItemType } from '@/store/cart';
import { formatPrice } from '@/lib/utils';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  onProductClick?: (productId: string) => void;
}

export function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
  onProductClick,
}: CartItemProps) {
  const subtotal = item.price * item.quantity;

  const handleDecrease = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.productId, item.quantity - 1);
    }
  };

  const handleIncrease = () => {
    onUpdateQuantity(item.productId, item.quantity + 1);
  };

  const handleProductClick = () => {
    onProductClick?.(item.productId);
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="flex gap-4 rounded-xl border border-gold-300/20 bg-dark-800 p-4"
    >
      {/* Thumbnail - clickeable */}
      <button
        type="button"
        onClick={handleProductClick}
        className="size-20 shrink-0 overflow-hidden rounded-lg bg-dark-700 transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-gold-300/50"
        aria-label={`Ver detalles de ${item.name}`}
      >
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageUrl}
            alt={item.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-white/30">
            —
          </div>
        )}
      </button>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <button
          type="button"
          onClick={handleProductClick}
          className="text-left text-lg font-semibold text-gold-200 transition-colors hover:text-gold-100 focus:outline-none focus:ring-2 focus:ring-gold-300/50 focus:ring-offset-2 focus:ring-offset-dark-800 rounded"
        >
          {item.name}
        </button>
        <p className="text-sm text-white/70">{formatPrice(item.price)} c/u</p>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center rounded-lg border border-gold-300/30 bg-dark-700">
            <button
              type="button"
              onClick={handleDecrease}
              disabled={item.quantity <= 1}
              className="rounded-l-lg p-2 text-white/80 transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-gold-300/50 focus:ring-inset"
              aria-label="Disminuir cantidad"
            >
              <Minus className="size-4" />
            </button>
            <span className="min-w-[2.5rem] py-2 text-center text-sm font-medium text-white">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={handleIncrease}
              className="rounded-r-lg p-2 text-white/80 transition-colors hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-gold-300/50 focus:ring-inset"
              aria-label="Aumentar cantidad"
            >
              <Plus className="size-4" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-base font-semibold text-gold-100">
              {formatPrice(subtotal)}
            </span>
            <button
              type="button"
              onClick={() => onRemove(item.productId)}
              className="rounded-lg p-2 text-white/50 transition-colors hover:bg-red-500/10 hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-400/50"
              aria-label={`Eliminar ${item.name} del carrito`}
            >
              <Trash2 className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
