'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface ToastProps {
  message: string | null;
  onClose: () => void;
  type?: 'success' | 'error';
}

export function Toast({ message, onClose, type = 'success' }: ToastProps) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className={`fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-xl px-6 py-3 font-medium shadow-lg ${
            type === 'error'
              ? 'bg-red-500/95 text-white'
              : 'bg-gold-200 text-dark-900'
          }`}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
