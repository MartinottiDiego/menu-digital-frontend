'use client';

import { motion } from 'framer-motion';
import { forwardRef } from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', children }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileHover={{
          boxShadow: '0 0 25px rgba(212, 175, 55, 0.15)',
          borderColor: 'rgba(212, 175, 55, 0.4)',
        }}
        transition={{ duration: 0.2 }}
        className={`bg-dark-800 border border-gold-300/20 rounded-xl p-6 transition-all duration-200 ${className}`}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';
