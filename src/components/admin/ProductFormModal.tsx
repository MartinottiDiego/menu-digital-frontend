'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loader2,
  Plus,
  Hash,
  Scale,
  Layers,
  Trash2,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import type { Product, SellMode } from '@/lib/types';
import { adminApi } from '@/lib/adminApi';
import { productMode, availablePieces } from '@/lib/product';
import { fmtPrice } from '@/lib/utils';
import { useToast } from '@/hooks/useToast';
import { useIsDesktop } from '@/hooks/useIsDesktop';
import { Button } from '@/components/ui/Button';
import { ImageUploader } from '@/components/ImageUploader';
import { InfoTip } from '@/components/ui/InfoTip';

export interface CategoryOption {
  _id: string;
  name: string;
}

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  onSuccess: () => void;
  categories?: CategoryOption[];
}

interface PieceField {
  weightKg: string;
}

interface FormData {
  name: string;
  description: string;
  sellMode: SellMode;
  price: string;
  stock: string;
  minWeightKg: string;
  stepWeightKg: string;
  wholeThresholdKg: string;
  pieces: PieceField[];
  imageUrl: string;
  videoUrl: string;
  category: string;
  active: boolean;
  featured: boolean;
}

interface FormErrors {
  name?: string;
  description?: string;
  price?: string;
  stock?: string;
  minWeightKg?: string;
  stepWeightKg?: string;
  pieces?: string;
  category?: string;
}

interface NewCategoryErrors {
  name?: string;
  description?: string;
}

/** Los 3 modos de venta, en idioma del dueño. */
const SELL_MODES: {
  value: SellMode;
  title: string;
  icon: typeof Hash;
  short: string;
  tip: string;
}[] = [
  {
    value: 'unit',
    title: 'Por unidad',
    icon: Hash,
    short: 'Precio fijo, se vende de a uno',
    tip: 'Para lo que se vende de a uno con precio fijo. Ej: una bandeja de hamburguesas, bastoncitos. Cargás cuántas unidades tenés.',
  },
  {
    value: 'bulk',
    title: 'Por peso (granel)',
    icon: Scale,
    short: 'Tenés X kilos, el cliente elige cuántos',
    tip: 'Tenés una cantidad de kilos y el cliente elige cuántos llevar (desde un mínimo). Ej: milanesas, picada, o un vacío que vas cortando en porciones. El stock baja por kilos.',
  },
  {
    value: 'pieces',
    title: 'Por pieza',
    icon: Layers,
    short: 'Piezas enteras, cada una con su peso',
    tip: 'Piezas enteras, cada una con su peso distinto. El cliente elige cuál se lleva y el precio sale solo (peso × precio por kilo). Ej: matambres, costillar entero.',
  },
];

function mergeCategoryOptions(
  fromProps: CategoryOption[],
  local: CategoryOption[]
): CategoryOption[] {
  const ids = new Set(fromProps.map((c) => c._id));
  return [...fromProps, ...local.filter((c) => !ids.has(c._id))];
}

function validateNewCategoryFields(
  name: string,
  description: string
): NewCategoryErrors {
  const errors: NewCategoryErrors = {};
  const trimmed = name.trim();
  if (!trimmed) errors.name = 'Nombre requerido';
  else if (trimmed.length < 3) errors.name = 'Mínimo 3 caracteres';
  else if (trimmed.length > 100) errors.name = 'Máximo 100 caracteres';
  if (description.length > 500) errors.description = 'Máximo 500 caracteres';
  return errors;
}

const initialFormData: FormData = {
  name: '',
  description: '',
  sellMode: 'unit',
  price: '',
  stock: '0',
  minWeightKg: '0.5',
  stepWeightKg: '0.5',
  wholeThresholdKg: '0',
  pieces: [{ weightKg: '' }],
  imageUrl: '',
  videoUrl: '',
  category: '',
  active: true,
  featured: false,
};

/**
 * Parsea números aceptando coma o punto como separador decimal (es-AR).
 * Atajo: si empieza con "0" seguido de dígitos y sin separador, lo toma como
 * decimal — "05" → 0,5; "025" → 0,25. Los enteros (6, 60, 24500) no se tocan.
 */
function toNum(s: string): number {
  let v = String(s).trim().replace(',', '.');
  if (/^0\d+$/.test(v)) v = '0.' + v.slice(1);
  return Number(v);
}

/**
 * Input decimal con flechitas (▲▼) para sumar/restar. Muestra coma, acepta coma
 * o punto al tipear, y al salir del campo lo normaliza (ej: "0.5" → "0,5").
 */
function DecimalStepper({
  value,
  onChange,
  step = 0.5,
  min = 0,
  placeholder,
  disabled,
  hasError,
}: {
  value: string;
  onChange: (v: string) => void;
  step?: number;
  min?: number;
  placeholder?: string;
  disabled?: boolean;
  hasError?: boolean;
}) {
  const fmt = (n: number) => String(+n.toFixed(2)).replace('.', ',');
  const bump = (dir: 1 | -1) => {
    const cur = toNum(value);
    const base = Number.isFinite(cur) ? cur : min;
    onChange(fmt(Math.max(min, +(base + dir * step).toFixed(2))));
  };
  return (
    <div
      className={`flex items-stretch overflow-hidden rounded-lg border bg-dark-700 transition-colors focus-within:border-gold-300 focus-within:ring-2 focus-within:ring-gold-300/50 ${
        hasError ? 'border-red-400' : 'border-gold-300/20'
      }`}
    >
      <input
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/[^0-9.,]/g, ''))}
        onBlur={() => {
          const n = toNum(value);
          if (value.trim() !== '' && Number.isFinite(n)) onChange(fmt(n));
        }}
        placeholder={placeholder}
        disabled={disabled}
        className="min-w-0 flex-1 bg-transparent px-4 py-3 text-white placeholder:text-white/40 focus:outline-none"
      />
      <div className="flex flex-col">
        <button
          type="button"
          tabIndex={-1}
          onClick={() => bump(1)}
          disabled={disabled}
          aria-label="Subir"
          className="flex flex-1 items-center justify-center border-l border-gold-300/20 px-2.5 text-gold-300 transition-colors hover:bg-gold-300/15 disabled:opacity-40"
        >
          <ChevronUp className="size-3.5" />
        </button>
        <button
          type="button"
          tabIndex={-1}
          onClick={() => bump(-1)}
          disabled={disabled}
          aria-label="Bajar"
          className="flex flex-1 items-center justify-center border-l border-t border-gold-300/20 px-2.5 text-gold-300 transition-colors hover:bg-gold-300/15 disabled:opacity-40"
        >
          <ChevronDown className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

function validateForm(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.name.trim()) errors.name = 'Nombre requerido';
  else if (data.name.trim().length < 3) errors.name = 'Mínimo 3 caracteres';
  if (!data.price || toNum(data.price) <= 0)
    errors.price = 'Precio requerido (mayor a 0)';
  if (!data.category) errors.category = 'Categoría requerida';
  if (data.description.length > 1000) errors.description = 'Máximo 1000 caracteres';

  if (data.sellMode === 'unit' || data.sellMode === 'bulk') {
    if (data.stock === '' || toNum(data.stock) < 0)
      errors.stock =
        data.sellMode === 'bulk' ? 'Poné los kilos (0 o más)' : 'Poné el stock (0 o más)';
  }
  if (data.sellMode === 'bulk') {
    if (!data.minWeightKg || toNum(data.minWeightKg) <= 0)
      errors.minWeightKg = 'Mínimo mayor a 0';
    if (!data.stepWeightKg || toNum(data.stepWeightKg) <= 0)
      errors.stepWeightKg = 'Paso mayor a 0';
  }
  if (data.sellMode === 'pieces') {
    const valid = data.pieces.filter(
      (p) => p.weightKg.trim() && toNum(p.weightKg) > 0
    );
    if (valid.length === 0) errors.pieces = 'Agregá al menos una pieza con su peso';
  }
  return errors;
}

export function ProductFormModal({
  isOpen,
  onClose,
  product,
  onSuccess,
  categories = [],
}: ProductFormModalProps) {
  const toast = useToast();
  const isDesktop = useIsDesktop();
  const [data, setData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [localCategories, setLocalCategories] = useState<CategoryOption[]>([]);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [newCategoryErrors, setNewCategoryErrors] = useState<NewCategoryErrors>(
    {}
  );
  const [creatingCategory, setCreatingCategory] = useState(false);
  const prevIsOpenRef = useRef(false);

  const isEdit = !!product;

  useEffect(() => {
    if (isOpen) {
      setImageUploading(false);
      const justOpened = !prevIsOpenRef.current;
      prevIsOpenRef.current = true;
      if (justOpened) {
        setLocalCategories([...categories]);
        setShowCategoryForm(false);
        setNewCategoryName('');
        setNewCategoryDescription('');
        setNewCategoryErrors({});
        setCreatingCategory(false);
      } else {
        setLocalCategories((prev) => mergeCategoryOptions(categories, prev));
      }
      if (product) {
        const mode = productMode(product);
        const piecesFields = availablePieces(product).map((p) => ({
          weightKg: String(p.weightKg),
        }));
        setData({
          name: product.name,
          description: product.description || '',
          sellMode: mode,
          price: String(product.price),
          stock: String(product.stock),
          minWeightKg: product.minWeightKg ? String(product.minWeightKg) : '0.5',
          stepWeightKg: product.stepWeightKg
            ? String(product.stepWeightKg)
            : '0.5',
          wholeThresholdKg: product.wholeThresholdKg
            ? String(product.wholeThresholdKg)
            : '0',
          pieces: piecesFields.length ? piecesFields : [{ weightKg: '' }],
          imageUrl: product.imageUrl || '',
          videoUrl: product.videoUrl || '',
          category:
            typeof product.category === 'object'
              ? product.category._id
              : product.category,
          active: product.active,
          featured: product.featured ?? false,
        });
      } else {
        setData(initialFormData);
      }
      setErrors({});
    } else {
      prevIsOpenRef.current = false;
    }
  }, [isOpen, product, categories]);

  const handleCancelNewCategory = () => {
    setShowCategoryForm(false);
    setNewCategoryName('');
    setNewCategoryDescription('');
    setNewCategoryErrors({});
  };

  const handleCreateCategory = async () => {
    const fieldErrors = validateNewCategoryFields(
      newCategoryName,
      newCategoryDescription
    );
    setNewCategoryErrors(fieldErrors);
    if (Object.values(fieldErrors).some(Boolean)) return;

    setCreatingCategory(true);
    try {
      const created = await adminApi.createCategory({
        name: newCategoryName.trim(),
        description: newCategoryDescription.trim() || undefined,
      });
      toast.success('Categoría creada');
      setLocalCategories((prev) => {
        if (prev.some((c) => c._id === created._id)) return prev;
        return [...prev, { _id: created._id, name: created.name }];
      });
      setData((prev) => ({ ...prev, category: created._id }));
      setErrors((prev) => ({ ...prev, category: undefined }));
      setShowCategoryForm(false);
      setNewCategoryName('');
      setNewCategoryDescription('');
      setNewCategoryErrors({});
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Error al crear categoría'
      );
    } finally {
      setCreatingCategory(false);
    }
  };

  // ---- piezas ----
  const addPiece = () =>
    setData((prev) => ({ ...prev, pieces: [...prev.pieces, { weightKg: '' }] }));
  const updatePiece = (i: number, value: string) =>
    setData((prev) => ({
      ...prev,
      pieces: prev.pieces.map((p, idx) => (idx === i ? { weightKg: value } : p)),
    }));
  const removePiece = (i: number) =>
    setData((prev) => ({
      ...prev,
      pieces:
        prev.pieces.length <= 1
          ? prev.pieces
          : prev.pieces.filter((_, idx) => idx !== i),
    }));

  const setMode = (mode: SellMode) =>
    setData((prev) => ({ ...prev, sellMode: mode }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (imageUploading || creatingCategory) return;
    const formErrors = validateForm(data);
    setErrors(formErrors);
    if (Object.values(formErrors).some(Boolean)) return;

    setLoading(true);
    try {
      const price = toNum(data.price);
      const base = {
        name: data.name.trim(),
        description: data.description.trim() || undefined,
        price,
        sellMode: data.sellMode,
        imageUrl: data.imageUrl.trim() || undefined,
        videoUrl: data.videoUrl.trim() || undefined,
        category: data.category,
        featured: data.featured,
      };

      let modeFields: Record<string, unknown>;
      if (data.sellMode === 'unit') {
        modeFields = {
          sellBy: 'unit' as const,
          stock: toNum(data.stock),
          unitWeightKg: undefined,
          minWeightKg: undefined,
          stepWeightKg: undefined,
          wholeThresholdKg: undefined,
          pieces: undefined,
        };
      } else if (data.sellMode === 'bulk') {
        modeFields = {
          sellBy: 'weight' as const,
          stock: toNum(data.stock),
          minWeightKg: toNum(data.minWeightKg),
          stepWeightKg: toNum(data.stepWeightKg),
          wholeThresholdKg: toNum(data.wholeThresholdKg),
          unitWeightKg: undefined,
          pieces: undefined,
        };
      } else {
        const pieces = data.pieces
          .filter((p) => p.weightKg.trim() && toNum(p.weightKg) > 0)
          .map((p) => ({ weightKg: toNum(p.weightKg), available: true }));
        modeFields = {
          sellBy: 'weight' as const,
          pieces,
          stock: pieces.length,
          unitWeightKg: undefined,
          minWeightKg: undefined,
          stepWeightKg: undefined,
          wholeThresholdKg: undefined,
        };
      }

      const payload = {
        ...base,
        ...modeFields,
        active: data.active,
      };

      if (isEdit && product) {
        await adminApi.updateProduct(product._id, payload);
        toast.success('Producto actualizado');
      } else {
        await adminApi.createProduct(
          payload as Parameters<typeof adminApi.createProduct>[0]
        );
        toast.success('Producto creado');
      }
      onClose();
      onSuccess();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Error al guardar producto'
      );
    } finally {
      setLoading(false);
    }
  };

  const inputBase =
    'w-full rounded-lg border bg-dark-700 px-4 py-3 text-white placeholder:text-white/40 focus:border-gold-300 focus:outline-none focus:ring-2 focus:ring-gold-300/50 transition-colors';
  const inputError = 'border-red-400 focus:border-red-400 focus:ring-red-400/20';
  const labelCls =
    'mb-2 flex items-center font-semibold text-gold-200';

  const priceNum = toNum(data.price) || 0;
  const validPieces = data.pieces.filter(
    (p) => p.weightKg.trim() && toNum(p.weightKg) > 0
  );

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
                ? 'fixed right-0 top-0 z-[60] h-full w-[50vw] min-w-[560px] overflow-y-auto border-l border-gold-300/30 bg-dark-800 p-6 shadow-2xl'
                : 'fixed left-1/2 top-1/2 z-[60] max-h-[90vh] w-[calc(100%-2rem)] max-w-[620px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl border border-gold-300/30 bg-dark-800 p-6 shadow-2xl'
            }
          >
            <h2 className="text-2xl font-bold text-gold-200">
              {isEdit ? 'Editar producto' : 'Nuevo producto'}
            </h2>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              {/* Nombre */}
              <div>
                <label className={labelCls}>Nombre *</label>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      name: e.target.value.slice(0, 100),
                    }))
                  }
                  placeholder="Ej: Matambre"
                  maxLength={100}
                  disabled={loading}
                  className={`${inputBase} ${errors.name ? inputError : 'border-gold-300/20'}`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-400">{errors.name}</p>
                )}
              </div>

              {/* Descripción */}
              <div>
                <label className={labelCls}>Descripción</label>
                <textarea
                  value={data.description}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      description: e.target.value.slice(0, 1000),
                    }))
                  }
                  placeholder="Descripción del producto"
                  rows={2}
                  maxLength={1000}
                  disabled={loading}
                  className={`${inputBase} resize-none border-gold-300/20`}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-400">{errors.description}</p>
                )}
              </div>

              {/* ---- Modo de venta (3 tarjetas) ---- */}
              <div>
                <label className={labelCls}>
                  ¿Cómo se vende?
                  <InfoTip text="Elegí la forma en que vendés este producto. Cada opción cambia los datos que tenés que cargar abajo." />
                </label>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                  {SELL_MODES.map((m) => {
                    const Icon = m.icon;
                    const selected = data.sellMode === m.value;
                    return (
                      <button
                        key={m.value}
                        type="button"
                        onClick={() => setMode(m.value)}
                        disabled={loading}
                        className={`flex flex-col items-start gap-1.5 rounded-xl border p-3 text-left transition-colors ${
                          selected
                            ? 'border-gold-300 bg-gold-300/10'
                            : 'border-gold-300/20 bg-dark-700 hover:border-gold-300/50'
                        }`}
                      >
                        <span className="flex items-center gap-2 text-gold-200">
                          <Icon className="size-4 shrink-0" aria-hidden />
                          <span className="font-bold">{m.title}</span>
                          <InfoTip text={m.tip} />
                        </span>
                        <span className="text-[12px] leading-snug text-white/60">
                          {m.short}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ---- Precio + campos según el modo ---- */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelCls}>
                    {data.sellMode === 'unit'
                      ? 'Precio por unidad *'
                      : 'Precio por kilo ($/kg) *'}
                    <InfoTip
                      text={
                        data.sellMode === 'unit'
                          ? 'Lo que sale UNA unidad.'
                          : 'Lo que sale 1 kilo. El sistema multiplica por los kilos para dar el precio final.'
                      }
                    />
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={data.price}
                    onChange={(e) =>
                      setData((prev) => ({ ...prev, price: e.target.value }))
                    }
                    placeholder="0"
                    min={0}
                    step={1}
                    disabled={loading}
                    className={`${inputBase} ${errors.price ? inputError : 'border-gold-300/20'}`}
                  />
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-400">{errors.price}</p>
                  )}
                </div>

                {/* Stock: unidades (unit) o kilos (bulk). En piezas se calcula solo. */}
                {data.sellMode === 'unit' && (
                  <div>
                    <label className={labelCls}>
                      Stock (unidades) *
                      <InfoTip text="Cuántas unidades tenés para vender. Baja sola con cada venta." />
                    </label>
                    <input
                      type="number"
                      value={data.stock}
                      onChange={(e) =>
                        setData((prev) => ({ ...prev, stock: e.target.value }))
                      }
                      placeholder="0"
                      min={0}
                      disabled={loading}
                      className={`${inputBase} ${errors.stock ? inputError : 'border-gold-300/20'}`}
                    />
                    {errors.stock && (
                      <p className="mt-1 text-sm text-red-400">{errors.stock}</p>
                    )}
                  </div>
                )}
                {data.sellMode === 'bulk' && (
                  <div>
                    <label className={labelCls}>
                      Kilos disponibles *
                      <InfoTip text="Cuántos kilos tenés en total para vender. Cuando alguien compra, se descuenta solo (ej: tenés 5 kg, venden 1,5 → quedan 3,5)." />
                    </label>
                    <DecimalStepper
                      value={data.stock}
                      onChange={(v) =>
                        setData((prev) => ({ ...prev, stock: v }))
                      }
                      step={0.5}
                      min={0}
                      placeholder="Ej: 6"
                      disabled={loading}
                      hasError={!!errors.stock}
                    />
                    {errors.stock && (
                      <p className="mt-1 text-sm text-red-400">{errors.stock}</p>
                    )}
                  </div>
                )}
              </div>

              {/* ---- Granel: mínimo y paso ---- */}
              {data.sellMode === 'bulk' && (
                <div className="grid grid-cols-1 gap-4 rounded-xl border border-gold-300/15 bg-dark-700/40 p-4 sm:grid-cols-2">
                  <div>
                    <label className={labelCls}>
                      Mínimo de compra (kg) *
                      <InfoTip text="Lo menos que alguien puede llevar. Ej: 1,5 kg. Así evitás pedidos de 100 gramos." />
                    </label>
                    <DecimalStepper
                      value={data.minWeightKg}
                      onChange={(v) =>
                        setData((prev) => ({ ...prev, minWeightKg: v }))
                      }
                      step={0.5}
                      min={0}
                      placeholder="Ej: 1,5"
                      disabled={loading}
                      hasError={!!errors.minWeightKg}
                    />
                    {errors.minWeightKg && (
                      <p className="mt-1 text-sm text-red-400">
                        {errors.minWeightKg}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className={labelCls}>
                      Sube de a (kg) *
                      <InfoTip text="De a cuánto sube el peso cuando el cliente toca el botón +. Ej: 0,5 kg → 1,5 / 2 / 2,5..." />
                    </label>
                    <DecimalStepper
                      value={data.stepWeightKg}
                      onChange={(v) =>
                        setData((prev) => ({ ...prev, stepWeightKg: v }))
                      }
                      step={0.25}
                      min={0}
                      placeholder="Ej: 0,5"
                      disabled={loading}
                      hasError={!!errors.stepWeightKg}
                    />
                    {errors.stepWeightKg && (
                      <p className="mt-1 text-sm text-red-400">
                        {errors.stepWeightKg}
                      </p>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>
                      Llevar entero cuando queden (kg)
                      <InfoTip text="Si al corte le queda este kilaje o menos, el cliente debe llevarlo entero. Además, ninguna compra puede dejar un resto más chico que esto. Así no te quedan pedazos invendibles. 0 = desactivado." />
                    </label>
                    <DecimalStepper
                      value={data.wholeThresholdKg}
                      onChange={(v) =>
                        setData((prev) => ({ ...prev, wholeThresholdKg: v }))
                      }
                      step={0.5}
                      min={0}
                      placeholder="Ej: 1 (0 = desactivado)"
                      disabled={loading}
                    />
                    <p className="mt-1 text-xs text-white/50">
                      0 = sin tope. Ej: 1 → cuando quede 1 kg o menos, se lleva
                      entero.
                    </p>
                  </div>
                </div>
              )}

              {/* ---- Piezas ---- */}
              {data.sellMode === 'pieces' && (
                <div className="rounded-xl border border-gold-300/15 bg-dark-700/40 p-4">
                  <label className={labelCls}>
                    Piezas (peso de cada una) *
                    <InfoTip text="Cargá cada pieza con su peso en kilos. El cliente va a poder elegir cuál comprar; el precio de cada una sale solo (peso × precio por kilo)." />
                  </label>
                  <p className="mb-3 text-[12px] text-white/55">
                    Tenés <b className="text-gold-200">{validPieces.length}</b>{' '}
                    {validPieces.length === 1 ? 'pieza' : 'piezas'}. Ej: si tenés 4
                    matambres, cargá los 4 con su peso (3 / 2,8 / 3,2 / 2,5).
                  </p>
                  <div className="space-y-2">
                    {data.pieces.map((p, i) => {
                      const w = toNum(p.weightKg) || 0;
                      const linePrice = w > 0 && priceNum > 0 ? priceNum * w : 0;
                      return (
                        <div key={i} className="flex items-center gap-2">
                          <div className="flex-1">
                            <DecimalStepper
                              value={p.weightKg}
                              onChange={(v) => updatePiece(i, v)}
                              step={0.1}
                              min={0}
                              placeholder={`Pieza ${i + 1} — kg (ej: 3,2)`}
                              disabled={loading}
                            />
                          </div>
                          <span className="w-24 shrink-0 text-right text-[13px] font-semibold text-gold-200">
                            {linePrice > 0 ? fmtPrice(linePrice) : '—'}
                          </span>
                          <button
                            type="button"
                            onClick={() => removePiece(i)}
                            disabled={loading || data.pieces.length <= 1}
                            className="shrink-0 rounded-lg p-2 text-white/50 transition-colors hover:text-red-300 disabled:pointer-events-none disabled:opacity-30"
                            aria-label="Quitar pieza"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  <button
                    type="button"
                    onClick={addPiece}
                    disabled={loading}
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-gold-300 transition-colors hover:text-gold-200"
                  >
                    <Plus className="size-4 shrink-0" aria-hidden />
                    Agregar otra pieza
                  </button>
                  {errors.pieces && (
                    <p className="mt-2 text-sm text-red-400">{errors.pieces}</p>
                  )}
                </div>
              )}

              {/* Imagen */}
              <div>
                <label className={labelCls}>Imagen del producto</label>
                <ImageUploader
                  value={data.imageUrl}
                  onUploadSuccess={(secureUrl) =>
                    setData((prev) => ({ ...prev, imageUrl: secureUrl }))
                  }
                  onClear={() => setData((prev) => ({ ...prev, imageUrl: '' }))}
                  onUploadingChange={setImageUploading}
                  disabled={loading}
                />
              </div>

              {/* Video */}
              <div>
                <label className={labelCls}>URL de video (opcional)</label>
                <input
                  type="url"
                  value={data.videoUrl}
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, videoUrl: e.target.value }))
                  }
                  placeholder="https://..."
                  disabled={loading}
                  className={`${inputBase} border-gold-300/20`}
                />
              </div>

              {/* Categoría */}
              <div>
                <label className={labelCls}>Categoría *</label>
                <select
                  value={data.category}
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, category: e.target.value }))
                  }
                  disabled={loading || creatingCategory}
                  className={`${inputBase} ${errors.category ? inputError : 'border-gold-300/20'}`}
                >
                  <option value="">Seleccionar categoría</option>
                  {localCategories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-400">{errors.category}</p>
                )}
                {!showCategoryForm && (
                  <button
                    type="button"
                    onClick={() => setShowCategoryForm(true)}
                    disabled={loading || creatingCategory}
                    className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-gold-300 transition-colors hover:text-gold-200 disabled:pointer-events-none disabled:opacity-50"
                  >
                    <Plus className="size-4 shrink-0" aria-hidden />
                    Crear nueva categoría
                  </button>
                )}
                <AnimatePresence initial={false}>
                  {showCategoryForm && (
                    <motion.div
                      key="inline-new-category"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 space-y-3 rounded-lg border border-gold-300/20 bg-dark-700/40 p-4">
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-gold-200">
                            Nombre de la categoría *
                          </label>
                          <input
                            type="text"
                            value={newCategoryName}
                            onChange={(e) => {
                              setNewCategoryName(e.target.value.slice(0, 100));
                              if (newCategoryErrors.name) {
                                setNewCategoryErrors((prev) => ({
                                  ...prev,
                                  name: undefined,
                                }));
                              }
                            }}
                            placeholder="Ej: Cortes"
                            maxLength={100}
                            disabled={creatingCategory}
                            className={`${inputBase} ${newCategoryErrors.name ? inputError : 'border-gold-300/20'}`}
                          />
                          {newCategoryErrors.name && (
                            <p className="mt-1 text-sm text-red-400">
                              {newCategoryErrors.name}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-gold-200">
                            Descripción
                          </label>
                          <textarea
                            value={newCategoryDescription}
                            onChange={(e) => {
                              setNewCategoryDescription(
                                e.target.value.slice(0, 500)
                              );
                              if (newCategoryErrors.description) {
                                setNewCategoryErrors((prev) => ({
                                  ...prev,
                                  description: undefined,
                                }));
                              }
                            }}
                            placeholder="Opcional"
                            rows={2}
                            maxLength={500}
                            disabled={creatingCategory}
                            className={`${inputBase} resize-none ${newCategoryErrors.description ? inputError : 'border-gold-300/20'}`}
                          />
                          {newCategoryErrors.description && (
                            <p className="mt-1 text-sm text-red-400">
                              {newCategoryErrors.description}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2 pt-1">
                          <Button
                            type="button"
                            variant="secondary"
                            className="flex-1"
                            onClick={handleCancelNewCategory}
                            disabled={creatingCategory}
                          >
                            Cancelar
                          </Button>
                          <Button
                            type="button"
                            variant="primary"
                            className="flex-1"
                            onClick={handleCreateCategory}
                            disabled={creatingCategory}
                          >
                            {creatingCategory ? (
                              <>
                                <Loader2 className="size-5 animate-spin" />
                                Creando…
                              </>
                            ) : (
                              'Crear'
                            )}
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Destacado */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="featured"
                  checked={data.featured}
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, featured: e.target.checked }))
                  }
                  disabled={loading}
                  className="size-5 rounded border-gold-300/30 bg-dark-700 text-gold-300 focus:ring-gold-300/50"
                />
                <label
                  htmlFor="featured"
                  className="flex items-center font-medium text-gold-200"
                >
                  Destacado
                  <InfoTip text="Si lo marcás, aparece en la sección 'Destacados' del inicio del sitio." />
                </label>
              </div>

              {/* Activo (visible en crear y editar) */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="active"
                  checked={data.active}
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, active: e.target.checked }))
                  }
                  disabled={loading}
                  className="size-5 rounded border-gold-300/30 bg-dark-700 text-gold-300 focus:ring-gold-300/50"
                />
                <label
                  htmlFor="active"
                  className="flex items-center font-medium text-gold-200"
                >
                  Producto activo
                  <InfoTip text="Si está tildado, el producto se ve en el sitio. Destildalo para cargarlo sin publicarlo todavía (o para ocultarlo)." />
                </label>
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onClose}
                  className="flex-1"
                  disabled={loading || creatingCategory}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                  disabled={loading || imageUploading || creatingCategory}
                >
                  {loading ? (
                    <>
                      <Loader2 className="size-5 animate-spin" />
                      Guardando...
                    </>
                  ) : imageUploading ? (
                    <>
                      <Loader2 className="size-5 animate-spin" />
                      Subiendo imagen…
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
