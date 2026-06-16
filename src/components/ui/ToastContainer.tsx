'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  XCircle,
  Info,
  AlertTriangle,
} from 'lucide-react';
import { useToastStore, type ToastItem, type ToastType } from '@/store/toast';

const AUTO_DISMISS_MS = 3000;

const typeConfig: Record<
  ToastType,
  { bg: string; icon: typeof CheckCircle }
> = {
  success: { bg: 'bg-green-600/90', icon: CheckCircle },
  error: { bg: 'bg-red-600/90', icon: XCircle },
  info: { bg: 'bg-gold-300/90', icon: Info },
  warning: { bg: 'bg-orange-600/90', icon: AlertTriangle },
};

function ToastItemComponent({ toast }: { toast: ToastItem }) {
  const hideToast = useToastStore((s) => s.hideToast);
  const config = typeConfig[toast.type];
  const Icon = config.icon;

  useEffect(() => {
    const timer = setTimeout(() => hideToast(toast.id), AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [toast.id, hideToast]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
      className={`flex items-center gap-3 rounded-lg px-4 py-3 shadow-lg backdrop-blur-sm ${config.bg} text-white`}
    >
      <Icon className="size-5 shrink-0" />
      <span className="font-medium">{toast.message}</span>
    </motion.div>
  );
}

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div
      className="fixed right-4 top-20 z-[60] flex max-w-sm flex-col gap-2 sm:right-6 sm:top-20 md:right-8"
      role="region"
      aria-label="Notificaciones"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItemComponent key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  );
}
