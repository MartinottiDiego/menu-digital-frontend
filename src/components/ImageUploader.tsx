'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ImagePlus, Loader2, Upload, X } from 'lucide-react';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { Button } from '@/components/ui/Button';

export interface ImageUploaderProps {
  /** URL actual guardada en el formulario (p. ej. al editar). */
  value: string;
  onUploadSuccess: (secureUrl: string) => void;
  /** Limpia la URL en el formulario (quitar imagen). */
  onClear?: () => void;
  /** Para deshabilitar Guardar mientras sube a Cloudinary. */
  onUploadingChange?: (uploading: boolean) => void;
  disabled?: boolean;
}

const dropZoneBase =
  'relative flex min-h-[140px] flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed px-4 py-6 text-center transition-colors';
const dropZoneIdle = 'border-gold-300/30 bg-dark-700/50 hover:border-gold-300/50';
const dropZoneActive = 'border-gold-300 bg-gold-300/10';

export function ImageUploader({
  value,
  onUploadSuccess,
  onClear,
  onUploadingChange,
  disabled,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const onSuccessRef = useRef(onUploadSuccess);
  onSuccessRef.current = onUploadSuccess;
  const onUploadingChangeRef = useRef(onUploadingChange);
  onUploadingChangeRef.current = onUploadingChange;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    onUploadingChangeRef.current?.(uploading);
  }, [uploading]);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  const uploadFile = useCallback(async (file: File, signal?: AbortSignal) => {
    setUploading(true);
    setError(null);
    try {
      const secureUrl = await uploadToCloudinary(file);
      if (signal?.aborted) return;
      onSuccessRef.current(secureUrl);
      setSelectedFile(null);
    } catch (err) {
      if (signal?.aborted) return;
      setError(
        err instanceof Error ? err.message : 'No se pudo subir la imagen'
      );
    } finally {
      if (!signal?.aborted) setUploading(false);
    }
  }, []);

  /** Subida automática al elegir o soltar un archivo. */
  useEffect(() => {
    if (!selectedFile || disabled) return;
    const ac = new AbortController();
    void uploadFile(selectedFile, ac.signal);
    return () => {
      ac.abort();
      setUploading(false);
    };
  }, [selectedFile, disabled, uploadFile]);

  const pickFiles = useCallback((files: FileList | null) => {
    if (!files?.length) return;
    const file = files[0];
    if (!file.type.startsWith('image/')) {
      setError('Seleccioná solo archivos de imagen');
      return;
    }
    setError(null);
    setSelectedFile(file);
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled || uploading) return;
    pickFiles(e.dataTransfer.files);
  };

  const handleReplaceIntent = () => {
    setSelectedFile(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleClearAll = () => {
    handleReplaceIntent();
    onClear?.();
  };

  const showPendingPreview = selectedFile && previewUrl;
  const showFinalUrl = value && !selectedFile;

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        disabled={disabled || uploading}
        onChange={(e) => pickFiles(e.target.files)}
      />

      {error && (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}

      {showFinalUrl && (
        <div className="space-y-2">
          <p className="text-xs text-white/60">Imagen del producto</p>
          <div
            className="relative inline-block rounded-lg"
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!disabled && !uploading) pickFiles(e.dataTransfer.files);
            }}
          >
            <img
              src={value}
              alt="Imagen del producto"
              className="max-h-48 max-w-full rounded-lg border border-gold-300/20 object-contain"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="secondary"
              className="w-auto px-4 py-2 text-sm"
              disabled={disabled || uploading}
              onClick={() => inputRef.current?.click()}
            >
              <ImagePlus className="size-4" />
              Cambiar imagen
            </Button>
            {onClear && (
              <Button
                type="button"
                variant="ghost"
                className="w-auto px-4 py-2 text-sm text-red-300 hover:text-red-200"
                disabled={disabled || uploading}
                onClick={handleClearAll}
              >
                <X className="size-4" />
                Quitar imagen
              </Button>
            )}
          </div>
        </div>
      )}

      {showPendingPreview && (
        <div className="space-y-3">
          <p className="text-xs text-white/60">
            {uploading
              ? 'Subiendo imagen a Cloudinary…'
              : error
                ? 'No se pudo subir. Podés reintentar o elegir otra imagen.'
                : 'Preparando subida…'}
          </p>
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <div className="relative h-32 w-32">
              <img
                src={previewUrl}
                alt="Vista previa"
                className="h-32 w-32 rounded-lg border border-gold-300/20 object-cover"
              />
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50">
                  <Loader2 className="size-8 animate-spin text-gold-300" />
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {error && selectedFile && !uploading && (
                <Button
                  type="button"
                  variant="primary"
                  className="w-auto px-4 py-2 text-sm"
                  disabled={disabled}
                  onClick={() => void uploadFile(selectedFile)}
                >
                  <Upload className="size-4" />
                  Reintentar
                </Button>
              )}
              <Button
                type="button"
                variant="secondary"
                className="w-auto px-4 py-2 text-sm"
                disabled={disabled || uploading}
                onClick={handleReplaceIntent}
              >
                Elegir otra
              </Button>
            </div>
          </div>
        </div>
      )}

      {!showFinalUrl && !showPendingPreview && (
        <div
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              if (!disabled && !uploading) inputRef.current?.click();
            }
          }}
          onDragEnter={(e) => {
            e.preventDefault();
            if (!disabled && !uploading) setIsDragging(true);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
              setIsDragging(false);
            }
          }}
          onDrop={handleDrop}
          onClick={() => !disabled && !uploading && inputRef.current?.click()}
          className={`${dropZoneBase} ${isDragging ? dropZoneActive : dropZoneIdle} ${disabled || uploading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
        >
          {uploading ? (
            <Loader2 className="size-10 animate-spin text-gold-300" />
          ) : (
            <>
              <Upload className="size-10 text-gold-300/80" />
              <p className="text-sm text-white/80">
                Arrastrá una imagen aquí o elegí un archivo (se sube sola)
              </p>
              <Button
                type="button"
                variant="secondary"
                className="pointer-events-none w-auto px-4 py-2 text-sm"
                tabIndex={-1}
              >
                Seleccionar archivo
              </Button>
            </>
          )}
        </div>
      )}

      {Boolean(value) && selectedFile && previewUrl && (
        <p className="text-xs text-amber-200/90">
          Se reemplazará la imagen actual al terminar la subida.
        </p>
      )}
    </div>
  );
}
