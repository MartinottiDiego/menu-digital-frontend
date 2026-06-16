'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from '@hello-pangea/dnd';
import {
  GripVertical,
  ImageOff,
  Loader2,
} from 'lucide-react';
import type { Product } from '@/lib/types';
import { adminApi } from '@/lib/adminApi';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';

export interface ProductSortModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSuccess: () => void;
}

export function ProductSortModal({
  isOpen,
  onClose,
  products,
  onSuccess,
}: ProductSortModalProps) {
  const toast = useToast();
  const [orderedProducts, setOrderedProducts] = useState<Product[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setOrderedProducts(
        products.filter((p) => p.active).map((p) => ({ ...p }))
      );
    }
  }, [isOpen, products]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;

    setOrderedProducts((prev) => {
      const next = [...prev];
      const [removed] = next.splice(result.source.index, 1);
      next.splice(result.destination!.index, 0, removed);
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const items = orderedProducts.map((p, index) => ({
        _id: p._id,
        displayOrder: index,
      }));
      await adminApi.reorderProducts(items);
      toast.success('Orden guardado');
      onClose();
      onSuccess();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Error al guardar el orden'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-4"
          onClick={saving ? undefined : onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[90vh] w-full max-w-[500px] flex-col overflow-hidden rounded-xl border border-gold-300/30 bg-dark-800 shadow-2xl"
            role="dialog"
            aria-modal
            aria-labelledby="product-sort-title"
          >
            <div className="shrink-0 border-b border-gold-300/10 p-5 pb-4">
              <h2
                id="product-sort-title"
                className="text-xl font-bold text-gold-200 sm:text-2xl"
              >
                Ordenar productos
              </h2>
              <p className="mt-1 text-sm text-white/60">
                Arrastrá los productos para definir el orden en el menú.
              </p>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
              {orderedProducts.length === 0 ? (
                <p className="rounded-lg border border-gold-300/10 bg-dark-700 p-6 text-center text-white/70">
                  No hay productos activos para ordenar.
                </p>
              ) : (
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="product-sort-list">
                    {(droppableProvided) => (
                      <ul
                        ref={droppableProvided.innerRef}
                        {...droppableProvided.droppableProps}
                        className="space-y-2"
                      >
                        {orderedProducts.map((product, index) => (
                          <Draggable
                            key={product._id}
                            draggableId={product._id}
                            index={index}
                            isDragDisabled={saving}
                          >
                            {(draggableProvided, snapshot) => (
                              <li
                                ref={draggableProvided.innerRef}
                                {...draggableProvided.draggableProps}
                                style={draggableProvided.draggableProps.style}
                                className={`flex items-center gap-3 rounded-lg border p-3 transition-shadow ${
                                  snapshot.isDragging
                                    ? 'border-gold-300/30 bg-dark-700 shadow-lg'
                                    : 'border-gold-300/10 bg-dark-700'
                                }`}
                              >
                                <button
                                  type="button"
                                  {...draggableProvided.dragHandleProps}
                                  className="touch-none rounded p-1 text-gold-300/50 outline-none focus-visible:ring-2 focus-visible:ring-gold-300/40 disabled:opacity-40"
                                  aria-label={`Arrastrar ${product.name}`}
                                  disabled={saving}
                                >
                                  <GripVertical className="size-5 shrink-0" />
                                </button>
                                {product.imageUrl ? (
                                  <img
                                    src={product.imageUrl}
                                    alt=""
                                    className="size-10 shrink-0 rounded object-cover"
                                  />
                                ) : (
                                  <div className="flex size-10 shrink-0 items-center justify-center rounded bg-dark-800 text-gold-300/40">
                                    <ImageOff className="size-5" />
                                  </div>
                                )}
                                <div className="min-w-0 flex-1">
                                  <p className="truncate font-medium text-white">
                                    {product.name}
                                  </p>
                                  <p className="text-sm text-gold-300/70">
                                    {formatPrice(product.price)}
                                  </p>
                                </div>
                              </li>
                            )}
                          </Draggable>
                        ))}
                        {droppableProvided.placeholder}
                      </ul>
                    )}
                  </Droppable>
                </DragDropContext>
              )}
            </div>

            <div className="shrink-0 flex flex-col gap-3 border-t border-gold-300/10 p-4 sm:flex-row sm:p-5">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                className="flex-1 border-gold-300/30"
                disabled={saving}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={handleSave}
                className="flex-1"
                disabled={saving || orderedProducts.length === 0}
              >
                {saving ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  'Guardar orden'
                )}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
