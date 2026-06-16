'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingCart, CheckCircle, Info, Package, Scale } from 'lucide-react';
import type { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  isLoading?: boolean;
  cartQuantity?: number;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onUpdateQuantity?: (productId: string, quantity: number) => void;
  onShowToast: (message: string) => void;
  mode?: 'add' | 'edit';
  initialQuantity?: number;
}

export function ProductModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onUpdateQuantity,
  onShowToast,
  mode = 'add',
  initialQuantity = 1,
  isLoading = false,
  cartQuantity = 0,
}: ProductModalProps) {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [justAdded, setJustAdded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setQuantity(mode === 'edit' ? initialQuantity : 1);
    setJustAdded(false);
    setImageError(false);
  }, [product?._id, mode, initialQuantity]);

  useEffect(() => {
    if (!isOpen) setJustAdded(false);
  }, [isOpen]);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const showContent = product && !isLoading;
  const availableStock = product
    ? product.stock - (mode === 'add' ? cartQuantity : 0)
    : 0;
  const exceedsStock =
    mode === 'add' && product && quantity + cartQuantity > product.stock;

  const handleSubmit = () => {
    if (!product) return;
    if (exceedsStock) return;
    const maxQty = mode === 'add' ? availableStock : product.stock;
    const qty = Math.min(Math.max(1, quantity), maxQty);
    if (product.stock <= 0 && mode === 'add') return;

    if (mode === 'edit' && onUpdateQuantity) {
      onUpdateQuantity(product._id, qty);
      onShowToast('Cantidad actualizada');
      onClose();
    } else {
      onAddToCart(product, qty);
      onShowToast('Producto agregado al carrito');
      onClose();
    }
  };

  const clampedQty = product
    ? Math.min(
        Math.max(1, quantity),
        mode === 'add' ? availableStock : product.stock
      )
    : 1;
  const isEdit = mode === 'edit';
  const displayStock = mode === 'add' ? availableStock : (product?.stock ?? 0);
  const canAdd = product && displayStock > 0 && !exceedsStock;

  // Determinar el estado del stock
  const stockStatus = displayStock > 10
    ? { color: 'bg-emerald-500', text: 'En stock', textColor: 'text-emerald-400' }
    : displayStock > 0
    ? { color: 'bg-amber-500', text: 'Pocas unidades', textColor: 'text-amber-400' }
    : { color: 'bg-red-500', text: 'Sin stock', textColor: 'text-red-400' };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md"
            aria-hidden
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-5 max-[380px]:p-6 sm:p-5 md:p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{
                type: 'spring',
                damping: 30,
                stiffness: 300,
              }}
              className="relative flex w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-gold-300/20 bg-dark-800 shadow-2xl sm:rounded-3xl md:h-auto md:max-h-[85vh] md:flex-row"
              role="dialog"
              aria-modal="true"
              aria-labelledby="product-title"
              aria-describedby="product-description"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button - esquina superior derecha del modal */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="absolute right-3 top-3 z-20 rounded-full border border-white/10 bg-dark-800/95 p-2 text-white/70 backdrop-blur-sm transition-colors hover:bg-dark-700 hover:text-white sm:right-4 sm:top-4"
                aria-label="Cerrar modal"
              >
                <X className="h-5 w-5" />
              </motion.button>

              {!showContent ? (
                // Loading State
                <div className="flex w-full animate-pulse flex-col md:flex-row md:h-[500px]">
                  <div className="h-48 shrink-0 bg-dark-700 sm:h-64 md:h-full md:w-[45%]" />
                  <div className="flex flex-1 flex-col gap-4 p-6">
                    <div className="h-8 w-3/4 rounded-lg bg-dark-700" />
                    <div className="h-4 w-1/3 rounded bg-dark-700" />
                    <div className="h-20 w-full rounded-lg bg-dark-700" />
                    <div className="h-12 w-2/3 rounded-lg bg-dark-700" />
                  </div>
                </div>
              ) : (
                <>
                  {/* Left Side - Image - Proporción fija */}
                  <div className="relative flex h-56 shrink-0 overflow-hidden bg-dark-900 sm:h-72 md:h-auto md:w-[45%]">
                    {/* Stock Badge */}
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute left-3 top-3 z-10 flex items-center gap-2 rounded-full border border-white/10 bg-dark-800/90 px-3 py-1.5 backdrop-blur-sm sm:left-4 sm:top-4"
                    >
                      <div className={`h-2 w-2 animate-pulse rounded-full ${stockStatus.color}`} />
                      <span className={`text-xs font-medium ${stockStatus.textColor}`}>
                        {stockStatus.text}
                      </span>
                    </motion.div>

                    {/* Image/Video */}
                    {product.videoUrl ? (
                      <video
                        src={product.videoUrl}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="h-full w-full object-cover"
                      />
                    ) : product.imageUrl && !imageError ? (
                      <motion.img
                        src={product.imageUrl}
                        alt={product.name}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4 }}
                        className="h-full w-full object-cover"
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center bg-dark-900 text-white/20">
                        <Package className="mb-2 h-12 w-12 sm:h-16 sm:w-16" />
                        <span className="text-sm">Sin imagen</span>
                      </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>

                  {/* Right Side - Content - Grid layout sin scroll */}
                  <div className="flex flex-1 flex-col p-5 sm:p-6 md:p-7">
                    {/* Header - Fixed */}
                    <div className="mb-3 shrink-0 sm:mb-4">
                      {product.category?.name && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="mb-2 inline-block rounded-full border border-gold-300/20 bg-gold-300/10 px-3 py-1 text-xs font-medium text-gold-200"
                        >
                          {product.category.name}
                        </motion.span>
                      )}
                      <motion.h2
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        id="product-title"
                        className="text-xl font-bold leading-tight text-gold-100 sm:text-2xl"
                      >
                        {product.name}
                      </motion.h2>
                    </div>

                    {/* Description - Fixed, 2 lines max */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="mb-3 shrink-0 sm:mb-4"
                    >
                      <p
                        id="product-description"
                        className="line-clamp-2 text-sm leading-snug text-white/70 sm:text-base sm:leading-relaxed"
                        title={product.description || 'Sin descripción disponible'}
                      >
                        {product.description || 'Sin descripción disponible'}
                      </p>
                    </motion.div>

                    {/* Info Cards - Compact (40% más pequeño) */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="mb-2 grid shrink-0 grid-cols-2 gap-1.5 sm:mb-3 sm:gap-2"
                    >
                      {/* Weight */}
                      <div className="flex items-center gap-1.5 rounded-md border border-white/5 bg-dark-700/30 px-2 py-1.5 sm:gap-2 sm:px-2.5 sm:py-2">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-gold-300/10 sm:h-7 sm:w-7">
                          <Scale className="h-3 w-3 text-gold-300 sm:h-4 sm:w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[9px] leading-tight text-white/50 sm:text-[10px]">Presentación</p>
                          <p className="text-[10px] font-semibold leading-tight text-white sm:text-xs">1kg</p>
                        </div>
                      </div>

                      {/* Stock */}
                      <div className="flex items-center gap-1.5 rounded-md border border-white/5 bg-dark-700/30 px-2 py-1.5 sm:gap-2 sm:px-2.5 sm:py-2">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-gold-300/10 sm:h-7 sm:w-7">
                          <Package className="h-3 w-3 text-gold-300 sm:h-4 sm:w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[9px] leading-tight text-white/50 sm:text-[10px]">Disponibles</p>
                          <p className={`text-[10px] font-semibold leading-tight sm:text-xs ${stockStatus.textColor}`}>
                            {displayStock} u.
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Divider */}
                    <div className="mb-3 h-px shrink-0 bg-gradient-to-r from-transparent via-white/10 to-transparent sm:mb-4" />

                    {/* Price - Adaptive size */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 }}
                      className="mb-3 shrink-0 sm:mb-4"
                    >
                      <p className="mb-1 text-[10px] text-white/50 sm:text-xs">Precio total</p>
                      <div className="flex items-baseline gap-2 sm:gap-3">
                        <motion.div
                          key={quantity}
                          initial={{ scale: 1.05 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', damping: 15 }}
                          className="bg-gradient-to-br from-gold-200 to-gold-400 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl"
                        >
                          {formatPrice(product.price * quantity)}
                        </motion.div>
                        {quantity > 1 && (
                          <span className="text-xs text-white/40 sm:text-sm">
                            {formatPrice(product.price)} c/u
                          </span>
                        )}
                      </div>
                    </motion.div>

                    {/* Error message */}
                    {exceedsStock && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-3 flex shrink-0 items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-2.5 sm:mb-4"
                      >
                        <Info className="h-4 w-4 shrink-0 text-red-400" />
                        <p className="text-xs text-red-400">
                          Solo hay {availableStock} unidades disponibles
                        </p>
                      </motion.div>
                    )}

                    {/* Spacer - grows to push controls to bottom */}
                    <div className="min-h-2 flex-1" aria-hidden />

                    {/* Controls - Always at bottom */}
                    <div className="shrink-0 space-y-3">
                      {/* Quantity Selector (30% más pequeño) */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <label className="mb-1 block text-[10px] font-medium text-white/60 sm:text-xs">
                          Cantidad
                        </label>
                        <div className="flex items-center gap-2 rounded-lg border border-gold-300/20 bg-dark-700/30 p-1 sm:gap-2.5 sm:p-1.5">
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                            disabled={quantity <= 1}
                            className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gold-300/50 sm:h-9 sm:w-9 ${
                              quantity <= 1
                                ? 'cursor-not-allowed text-white/20'
                                : 'text-gold-200 hover:bg-gold-300/10'
                            }`}
                            aria-label="Disminuir cantidad"
                          >
                            <Minus className="h-4 w-4" />
                          </motion.button>

                          <div className="flex-1 text-center">
                            <motion.span
                              key={quantity}
                              initial={{ scale: 1.15, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="text-lg font-bold text-gold-100 sm:text-xl"
                            >
                              {quantity}
                            </motion.span>
                          </div>

                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() =>
                              setQuantity((q) =>
                                Math.min(
                                  mode === 'add' ? availableStock : product.stock,
                                  q + 1
                                )
                              )
                            }
                            disabled={
                              quantity >= (mode === 'add' ? availableStock : product.stock)
                            }
                            className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gold-300/50 sm:h-9 sm:w-9 ${
                              quantity >= (mode === 'add' ? availableStock : product.stock)
                                ? 'cursor-not-allowed text-white/20'
                                : 'text-gold-200 hover:bg-gold-300/10'
                            }`}
                            aria-label="Aumentar cantidad"
                          >
                            <Plus className="h-4 w-4" />
                          </motion.button>
                        </div>
                      </motion.div>

                      {/* CTA Button */}
                      <motion.button
                        type="button"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        whileHover={canAdd && !justAdded ? { scale: 1.01 } : {}}
                        whileTap={canAdd && !justAdded ? { scale: 0.99 } : {}}
                        onClick={handleSubmit}
                        disabled={
                          justAdded ||
                          (product.stock <= 0 && !isEdit) ||
                          exceedsStock ||
                          availableStock <= 0
                        }
                        className={`relative w-full overflow-hidden rounded-xl py-4 text-base font-bold transition-all focus:outline-none focus:ring-2 focus:ring-gold-300/50 focus:ring-offset-2 focus:ring-offset-dark-800 ${
                          (product.stock <= 0 && !isEdit) || exceedsStock || availableStock <= 0
                            ? 'cursor-not-allowed bg-gray-700 text-gray-500'
                            : justAdded
                            ? 'bg-emerald-500 text-white'
                            : 'bg-gold-300 text-dark-900 shadow-md shadow-gold-300/15 hover:bg-gold-200 hover:shadow-lg hover:shadow-gold-300/25'
                        }`}
                      >
                        {isEdit ? (
                          <span className="flex items-center justify-center gap-2">
                            <ShoppingCart className="h-5 w-5" />
                            Actualizar ({clampedQty})
                          </span>
                        ) : justAdded ? (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex items-center justify-center gap-2"
                          >
                            <CheckCircle className="h-5 w-5" />
                            ¡Agregado!
                          </motion.span>
                        ) : product.stock <= 0 ? (
                          'Sin stock'
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            <ShoppingCart className="h-5 w-5" />
                            Agregar al carrito
                          </span>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}