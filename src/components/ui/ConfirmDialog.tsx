'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  isDestructive = false,
}: ConfirmDialogProps) {
  const handleConfirm = async () => {
    await onConfirm();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
            aria-hidden
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 top-1/2 z-[70] w-[calc(100%-2rem)] max-w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-gold-300/20 bg-dark-800 p-6 shadow-2xl"
          >
            <h3 className="text-xl font-bold text-gold-200">{title}</h3>
            <p className="mt-2 text-white/80">{message}</p>
            <div className="mt-6 flex gap-3">
              <Button variant="secondary" onClick={onClose} className="flex-1">
                {cancelText}
              </Button>
              <button
                type="button"
                onClick={() => void handleConfirm()}
                className={`flex-1 rounded-lg px-6 py-3 font-semibold transition-colors ${
                  isDestructive
                    ? 'bg-red-600 text-white hover:bg-red-500'
                    : 'bg-gold-200 text-dark-900 hover:bg-gold-100'
                }`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
