'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import type { Category } from '@/lib/types';
import { adminApi } from '@/lib/adminApi';
import { useToast } from '@/hooks/useToast';
import { useIsDesktop } from '@/hooks/useIsDesktop';
import { Button } from '@/components/ui/Button';

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: Category | null;
  onSuccess: () => void;
}

interface FormData {
  name: string;
  description: string;
  active: boolean;
}

interface FormErrors {
  name?: string;
  description?: string;
}

const initialFormData: FormData = {
  name: '',
  description: '',
  active: true,
};

function validateForm(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.name.trim()) errors.name = 'Nombre requerido';
  else if (data.name.trim().length < 3)
    errors.name = 'Mínimo 3 caracteres';
  if (data.name.length > 100) errors.name = 'Máximo 100 caracteres';
  if (data.description.length > 500)
    errors.description = 'Máximo 500 caracteres';
  return errors;
}

export function CategoryFormModal({
  isOpen,
  onClose,
  category,
  onSuccess,
}: CategoryFormModalProps) {
  const toast = useToast();
  const isDesktop = useIsDesktop();
  const [data, setData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const isEdit = !!category;

  useEffect(() => {
    if (isOpen) {
      if (category) {
        setData({
          name: category.name,
          description: category.description || '',
          active: category.active,
        });
      } else {
        setData(initialFormData);
      }
      setErrors({});
    }
  }, [isOpen, category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formErrors = validateForm(data);
    setErrors(formErrors);
    if (Object.values(formErrors).some(Boolean)) return;

    setLoading(true);
    try {
      if (isEdit && category) {
        await adminApi.updateCategory(category._id, {
          name: data.name.trim(),
          description: data.description.trim() || undefined,
          active: data.active,
        });
        toast.success('Categoría actualizada');
      } else {
        await adminApi.createCategory({
          name: data.name.trim(),
          description: data.description.trim() || undefined,
        });
        toast.success('Categoría creada');
      }
      onClose();
      onSuccess();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Error al guardar categoría'
      );
    } finally {
      setLoading(false);
    }
  };

  const inputBase =
    'w-full rounded-lg border bg-dark-700 px-4 py-3 text-white placeholder:text-white/40 focus:border-gold-300 focus:outline-none focus:ring-2 focus:ring-gold-300/50 transition-colors';
  const inputError =
    'border-red-400 focus:border-red-400 focus:ring-red-400/20';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            aria-hidden
          />
          <motion.div
            initial={isDesktop ? { x: '100%' } : { opacity: 0, scale: 0.95 }}
            animate={isDesktop ? { x: 0 } : { opacity: 1, scale: 1 }}
            exit={isDesktop ? { x: '100%' } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={
              isDesktop
                ? 'fixed right-0 top-0 z-[60] h-full w-[50vw] min-w-[520px] overflow-y-auto border-l border-gold-300/30 bg-dark-800 p-6 shadow-2xl'
                : 'fixed left-1/2 top-1/2 z-[60] max-h-[90vh] w-[calc(100%-2rem)] max-w-[500px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl border border-gold-300/30 bg-dark-800 p-6 shadow-2xl'
            }
          >
            <h2 className="text-2xl font-bold text-gold-200">
              {isEdit ? 'Editar categoría' : 'Nueva categoría'}
            </h2>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block font-semibold text-gold-200">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      name: e.target.value.slice(0, 100),
                    }))
                  }
                  placeholder="Ej: Milanesas"
                  maxLength={100}
                  disabled={loading}
                  className={`${inputBase} ${errors.name ? inputError : 'border-gold-300/20'}`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-400">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block font-semibold text-gold-200">
                  Descripción
                </label>
                <textarea
                  value={data.description}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      description: e.target.value.slice(0, 500),
                    }))
                  }
                  placeholder="Descripción breve de la categoría"
                  rows={3}
                  maxLength={500}
                  disabled={loading}
                  className={`${inputBase} resize-none ${errors.description ? inputError : 'border-gold-300/20'}`}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.description}
                  </p>
                )}
              </div>

              {isEdit && (
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="category-active"
                    checked={data.active}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        active: e.target.checked,
                      }))
                    }
                    disabled={loading}
                    className="size-5 rounded border-gold-300/30 bg-dark-700 text-gold-300 focus:ring-gold-300/50"
                  />
                  <label
                    htmlFor="category-active"
                    className="font-medium text-gold-200"
                  >
                    Categoría activa (visible en el menú)
                  </label>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onClose}
                  className="flex-1"
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="size-5 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    'Guardar'
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
