'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp } from 'lucide-react';

const THRESHOLD = 500;

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > THRESHOLD);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          onClick={scrollToTop}
          className="fixed bottom-6 left-1/2 z-40 flex size-12 -translate-x-1/2 items-center justify-center rounded-full bg-gold-300 text-dark-900 shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-shadow hover:shadow-[0_0_25px_rgba(212,175,55,0.5)] sm:left-auto sm:right-8 sm:translate-x-0"
          aria-label="Volver arriba"
        >
          <ChevronUp className="size-6" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
