'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { motion } from 'framer-motion';
import { Loader2, Plus, Pencil, Trash2 } from 'lucide-react';
import { adminApi } from '@/lib/adminApi';
import type { Combo } from '@/lib/types';
import { useToast } from '@/hooks/useToast';
import { useIsDesktop } from '@/hooks/useIsDesktop';
import { fmtPrice } from '@/lib/utils';
import { AdminPageHeader, Panel } from '@/components/admin/AdminUI';
import { Button } from '@/components/ui/Button';
import { ImageUploader } from '@/components/ImageUploader';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

const inputBase =
  'w-full rounded-lg border border-gold-300/20 bg-dark-700 px-4 py-3 text-white placeholder:text-white/40 focus:border-gold-300 focus:outline-none focus:ring-2 focus:ring-gold-300/50 transition-colors';

export default function AdminCombosPage() {
  const toast = useToast();
  const { data, mutate, isLoading } = useSWR('admin-combos', () =>
    adminApi.getAllCombos()
  );
  const combos = data?.data ?? [];
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Combo | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Combo | null>(null);

  const openNew = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (c: Combo) => {
    setEditing(c);
    setFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await adminApi.deleteCombo(deleteTarget._id);
      setDeleteTarget(null);
      await mutate();
      toast.success('Combo eliminado');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al eliminar');
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Combos"
        subtitle={combos.length > 0 ? `${combos.length} combos` : undefined}
        actions={
          <Button variant="primary" onClick={openNew}>
            <Plus className="size-5" />
            Nuevo combo
          </Button>
        }
      />

      {isLoading ? (
        <div className="h-40 animate-pulse rounded-[16px]" style={{ background: 'var(--panel)' }} />
      ) : combos.length === 0 ? (
        <Panel style={{ padding: 40 }}>
          <p className="text-center text-tan-dim">
            Todavía no cargaste combos. Tocá “Nuevo combo”.
          </p>
        </Panel>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {combos.map((c) => (
            <Panel key={c._id} className="overflow-hidden">
              <div className="relative h-[140px]">
                {c.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.imageUrl} alt={c.name} className="h-full w-full object-cover" />
                )}
                {!c.active && (
                  <span className="absolute left-2 top-2 rounded bg-black/70 px-2 py-1 text-xs text-white/80">
                    Inactivo
                  </span>
                )}
              </div>
              <div className="p-4">
                <div className="text-[12px] uppercase tracking-wide text-tan-dim">
                  {c.serves}
                </div>
                <div className="mt-1 text-[16px] font-bold text-cream">{c.name}</div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-[18px] font-extrabold text-gold-200">
                    {fmtPrice(c.price)}
                  </span>
                  {c.oldPrice && c.oldPrice > c.price && (
                    <span className="text-[13px] text-tan-dim line-through">
                      {fmtPrice(c.oldPrice)}
                    </span>
                  )}
                </div>
                <div className="mt-3 flex gap-2">
                  <Button
                    variant="secondary"
                    className="flex-1 py-2 text-sm"
                    onClick={() => openEdit(c)}
                  >
                    <Pencil className="size-4" />
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    className="px-3 py-2 text-sm text-red-300 hover:text-red-200"
                    onClick={() => setDeleteTarget(c)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            </Panel>
          ))}
        </div>
      )}

      {formOpen && (
        <ComboFormModal
          combo={editing}
          onClose={() => setFormOpen(false)}
          onSaved={() => {
            setFormOpen(false);
            mutate();
          }}
        />
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Eliminar combo"
        message={`¿Eliminar "${deleteTarget?.name}"? No se puede deshacer.`}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        variant="danger"
      />
    </div>
  );
}

function ComboFormModal({
  combo,
  onClose,
  onSaved,
}: {
  combo: Combo | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const toast = useToast();
  const isDesktop = useIsDesktop();
  const isEdit = !!combo;
  const [name, setName] = useState('');
  const [serves, setServes] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [oldPrice, setOldPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [itemsText, setItemsText] = useState('');
  const [active, setActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (combo) {
      setName(combo.name);
      setServes(combo.serves ?? '');
      setDescription(combo.description ?? '');
      setPrice(String(combo.price));
      setOldPrice(combo.oldPrice ? String(combo.oldPrice) : '');
      setImageUrl(combo.imageUrl ?? '');
      setItemsText((combo.items ?? []).join('\n'));
      setActive(combo.active);
    }
  }, [combo]);

  const handleSave = async () => {
    if (!name.trim() || !price || Number(price) <= 0) {
      toast.error('Nombre y precio (mayor a 0) son obligatorios');
      return;
    }
    setSaving(true);
    const payload = {
      name: name.trim(),
      serves: serves.trim() || undefined,
      description: description.trim() || undefined,
      price: Number(price),
      oldPrice: oldPrice.trim() ? Number(oldPrice) : undefined,
      imageUrl: imageUrl.trim() || undefined,
      items: itemsText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
    };
    try {
      if (isEdit && combo) {
        await adminApi.updateCombo(combo._id, { ...payload, active });
        toast.success('Combo actualizado');
      } else {
        await adminApi.createCombo(payload);
        toast.success('Combo creado');
      }
      onSaved();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <motion.div
        initial={isDesktop ? { x: '100%' } : { opacity: 0, scale: 0.95 }}
        animate={isDesktop ? { x: 0 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className={
          isDesktop
            ? 'fixed right-0 top-0 z-[60] h-full w-[50vw] min-w-[560px] overflow-y-auto border-l border-gold-300/30 bg-dark-800 p-6 shadow-2xl'
            : 'fixed left-1/2 top-1/2 z-[60] max-h-[90vh] w-[calc(100%-2rem)] max-w-[600px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl border border-gold-300/30 bg-dark-800 p-6 shadow-2xl'
        }
      >
        <h2 className="text-2xl font-bold text-gold-200">
          {isEdit ? 'Editar combo' : 'Nuevo combo'}
        </h2>
        <div className="mt-6 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gold-200">Nombre *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Combo Asado" className={inputBase} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-gold-200">Para cuántos / etiqueta</label>
            <input value={serves} onChange={(e) => setServes(e.target.value)} placeholder="Ej: 8 a 10 personas" className={inputBase} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gold-200">Precio *</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="48000" min={0.01} step={0.01} className={inputBase} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-gold-200">Precio anterior (tachado)</label>
              <input type="number" value={oldPrice} onChange={(e) => setOldPrice(e.target.value)} placeholder="56000 (opcional)" min={0} step={0.01} className={inputBase} />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-gold-200">
              Qué incluye (uno por línea)
            </label>
            <textarea
              value={itemsText}
              onChange={(e) => setItemsText(e.target.value)}
              placeholder={'2 kg de asado de tira\n1 kg de vacío\n6 chorizos parrilleros'}
              rows={4}
              className={`${inputBase} resize-none`}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-gold-200">Descripción (opcional)</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className={`${inputBase} resize-none`} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-gold-200">Imagen</label>
            <ImageUploader
              value={imageUrl}
              onUploadSuccess={setImageUrl}
              onClear={() => setImageUrl('')}
              onUploadingChange={setUploading}
              disabled={saving}
            />
          </div>
          {isEdit && (
            <label className="flex items-center gap-3 text-sm text-white/90">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="size-5 rounded border-gold-300/30 bg-dark-700 text-gold-300"
              />
              Activo (visible en la tienda)
            </label>
          )}
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" className="flex-1" onClick={onClose} disabled={saving}>
              Cancelar
            </Button>
            <Button variant="primary" className="flex-1" onClick={handleSave} disabled={saving || uploading}>
              {saving ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Guardando…
                </>
              ) : (
                'Guardar'
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
