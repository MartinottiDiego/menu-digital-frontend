'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { adminApi } from '@/lib/adminApi';
import { DEFAULT_SETTINGS, type Settings } from '@/lib/settings';
import { useToast } from '@/hooks/useToast';
import { AdminPageHeader, Panel } from '@/components/admin/AdminUI';
import { Button } from '@/components/ui/Button';
import { ImageUploader } from '@/components/ImageUploader';

const inputBase =
  'w-full rounded-lg border border-gold-300/20 bg-dark-700 px-4 py-3 text-white placeholder:text-white/40 focus:border-gold-300 focus:outline-none focus:ring-2 focus:ring-gold-300/50 transition-colors';

export default function AdminSettingsPage() {
  const toast = useToast();
  const [data, setData] = useState<Settings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imgUploading, setImgUploading] = useState(false);

  // Solo al montar. NO depende de `toast`: useToast() devuelve un objeto nuevo
  // en cada render, así que tenerlo como dependencia re-disparaba el fetch en
  // cada tecla y pisaba lo que el usuario estaba escribiendo.
  useEffect(() => {
    let active = true;
    adminApi
      .getSettings()
      .then((s) => active && setData({ ...DEFAULT_SETTINGS, ...s }))
      .catch(() => toast.error('No se pudo cargar la configuración'))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const set = <K extends keyof Settings>(key: K, value: Settings[K]) =>
    setData((prev) => ({ ...prev, [key]: value }));

  // Helpers para las listas de "Nosotros"
  const updValue = (i: number, k: 'title' | 'desc', v: string) =>
    setData((prev) => ({
      ...prev,
      aboutValues: prev.aboutValues.map((x, idx) =>
        idx === i ? { ...x, [k]: v } : x
      ),
    }));
  const addValue = () =>
    setData((prev) => ({
      ...prev,
      aboutValues: [...prev.aboutValues, { title: '', desc: '' }],
    }));
  const delValue = (i: number) =>
    setData((prev) => ({
      ...prev,
      aboutValues: prev.aboutValues.filter((_, idx) => idx !== i),
    }));

  const updStat = (i: number, k: 'value' | 'label', v: string) =>
    setData((prev) => ({
      ...prev,
      aboutStats: prev.aboutStats.map((x, idx) =>
        idx === i ? { ...x, [k]: v } : x
      ),
    }));
  const addStat = () =>
    setData((prev) => ({
      ...prev,
      aboutStats: [...prev.aboutStats, { value: '', label: '' }],
    }));
  const delStat = (i: number) =>
    setData((prev) => ({
      ...prev,
      aboutStats: prev.aboutStats.filter((_, idx) => idx !== i),
    }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const saved = await adminApi.updateSettings(data);
      setData({ ...DEFAULT_SETTINGS, ...saved });
      toast.success('Configuración guardada');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  // Función (no componente) → no remonta el input al tipear.
  const field = (
    label: string,
    k: keyof Settings,
    opts?: { placeholder?: string; textarea?: boolean }
  ) => (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gold-200">{label}</label>
      {opts?.textarea ? (
        <textarea
          value={String(data[k] ?? '')}
          onChange={(e) => set(k, e.target.value as Settings[typeof k])}
          placeholder={opts?.placeholder}
          rows={2}
          className={`${inputBase} resize-none`}
        />
      ) : (
        <input
          type="text"
          value={String(data[k] ?? '')}
          onChange={(e) => set(k, e.target.value as Settings[typeof k])}
          placeholder={opts?.placeholder}
          className={inputBase}
        />
      )}
    </div>
  );

  if (loading) {
    return (
      <div>
        <AdminPageHeader title="Configuración" subtitle="Datos del negocio" />
        <div className="h-64 animate-pulse rounded-[16px]" style={{ background: 'var(--panel)' }} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Configuración"
        subtitle="Datos del negocio que se muestran en el sitio"
        actions={
          <Button variant="primary" onClick={handleSave} disabled={saving || imgUploading}>
            {saving ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Guardando…
              </>
            ) : (
              'Guardar cambios'
            )}
          </Button>
        }
      />

      <Panel style={{ padding: 24 }}>
        <h3 className="mb-4 font-display text-[20px] text-cream">Negocio</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {field('Nombre del negocio', 'businessName')}
          {field('Dirección del local', 'address')}
          {field('Teléfono', 'phone')}
          {field('Email', 'email')}
          {field('WhatsApp (número)', 'whatsappNumber', { placeholder: '+5492364...' })}
          {field('Instagram', 'instagram')}
          <div className="sm:col-span-2">
            {field('Mensaje de WhatsApp prearmado', 'whatsappMessage', { textarea: true })}
          </div>
        </div>
      </Panel>

      <Panel style={{ padding: 24 }}>
        <h3 className="mb-4 font-display text-[20px] text-cream">Entrega</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {field('Zona de delivery', 'deliveryZone')}
          <div className="flex items-end gap-6">
            <label className="flex items-center gap-2 text-sm text-white/90">
              <input
                type="checkbox"
                checked={data.deliveryEnabled}
                onChange={(e) => set('deliveryEnabled', e.target.checked)}
                className="size-5 rounded border-gold-300/30 bg-dark-700 text-gold-300"
              />
              Delivery activo
            </label>
            <label className="flex items-center gap-2 text-sm text-white/90">
              <input
                type="checkbox"
                checked={data.pickupEnabled}
                onChange={(e) => set('pickupEnabled', e.target.checked)}
                className="size-5 rounded border-gold-300/30 bg-dark-700 text-gold-300"
              />
              Retiro en local activo
            </label>
          </div>
        </div>
      </Panel>

      <Panel style={{ padding: 24 }}>
        <h3 className="mb-4 font-display text-[20px] text-cream">Ubicación en el mapa</h3>
        <p className="mb-4 text-sm text-white/60">
          Coordenadas exactas del local (para que el mapa marque el punto justo,
          aunque la dirección sea difícil de encontrar). En Google Maps: click
          derecho sobre el lugar → se copian las coordenadas → pegalas acá.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gold-200">
              Latitud
            </label>
            <input
              type="number"
              step="any"
              value={data.lat ?? ''}
              onChange={(e) =>
                set('lat', e.target.value === '' ? null : Number(e.target.value))
              }
              placeholder="-34.591234"
              className={inputBase}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-gold-200">
              Longitud
            </label>
            <input
              type="number"
              step="any"
              value={data.lng ?? ''}
              onChange={(e) =>
                set('lng', e.target.value === '' ? null : Number(e.target.value))
              }
              placeholder="-60.961234"
              className={inputBase}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-gold-200">
              Zoom (1–21)
            </label>
            <input
              type="number"
              min={1}
              max={21}
              // Permite vaciar el campo mientras editás (NaN = vacío). Al salir
              // del campo se normaliza a un valor válido 1–21 (16 por defecto).
              value={Number.isFinite(data.mapZoom) ? data.mapZoom : ''}
              onChange={(e) =>
                set('mapZoom', e.target.value === '' ? NaN : Number(e.target.value))
              }
              onBlur={(e) => {
                const n = Number(e.target.value);
                set(
                  'mapZoom',
                  e.target.value === '' || Number.isNaN(n)
                    ? 16
                    : Math.min(21, Math.max(1, n))
                );
              }}
              className={inputBase}
            />
          </div>
        </div>
      </Panel>

      <Panel style={{ padding: 24 }}>
        <h3 className="mb-4 font-display text-[20px] text-cream">Horarios y aviso</h3>
        <div className="grid grid-cols-1 gap-4">
          {field('Horario (texto libre)', 'hours', {
            placeholder: 'Lun a Sáb · 08–22 h · Dom cerrado',
          })}
          {field('Texto de la barra de aviso (arriba del sitio)', 'announcementText', {
            textarea: true,
          })}
        </div>
      </Panel>

      <Panel style={{ padding: 24 }}>
        <h3 className="mb-4 font-display text-[20px] text-cream">Nosotros</h3>
        <div className="space-y-4">
          {field('Título', 'aboutTitle')}
          {field('Historia (un párrafo por línea)', 'aboutText', { textarea: true })}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gold-200">Foto</label>
            <ImageUploader
              value={data.aboutImageUrl}
              onUploadSuccess={(u) => set('aboutImageUrl', u)}
              onClear={() => set('aboutImageUrl', '')}
              onUploadingChange={setImgUploading}
              disabled={saving}
            />
          </div>

          {/* Valores */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-semibold text-gold-200">
                Valores (tarjetas)
              </label>
              <button
                type="button"
                onClick={addValue}
                className="text-sm font-medium text-gold-300 hover:text-gold-200"
              >
                + Agregar
              </button>
            </div>
            <div className="space-y-2">
              {data.aboutValues.map((v, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={v.title}
                    onChange={(e) => updValue(i, 'title', e.target.value)}
                    placeholder="Título"
                    className={`${inputBase} max-w-[200px]`}
                  />
                  <input
                    value={v.desc}
                    onChange={(e) => updValue(i, 'desc', e.target.value)}
                    placeholder="Descripción"
                    className={inputBase}
                  />
                  <button
                    type="button"
                    onClick={() => delValue(i)}
                    className="shrink-0 px-2 text-red-300 hover:text-red-200"
                    aria-label="Quitar"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Estadísticas */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-semibold text-gold-200">Estadísticas</label>
              <button
                type="button"
                onClick={addStat}
                className="text-sm font-medium text-gold-300 hover:text-gold-200"
              >
                + Agregar
              </button>
            </div>
            <div className="space-y-2">
              {data.aboutStats.map((s, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={s.value}
                    onChange={(e) => updStat(i, 'value', e.target.value)}
                    placeholder="+30"
                    className={`${inputBase} max-w-[120px]`}
                  />
                  <input
                    value={s.label}
                    onChange={(e) => updStat(i, 'label', e.target.value)}
                    placeholder="años en el barrio"
                    className={inputBase}
                  />
                  <button
                    type="button"
                    onClick={() => delStat(i)}
                    className="shrink-0 px-2 text-red-300 hover:text-red-200"
                    aria-label="Quitar"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}
