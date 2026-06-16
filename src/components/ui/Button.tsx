'use client';

import { motion } from 'framer-motion';
import { ComponentProps, forwardRef } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends ComponentProps<'button'> {
  variant?: ButtonVariant;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-gold-200 text-dark-900 hover:bg-gold-100 hover:shadow-[0_0_20px_rgba(244,196,48,0.3)] border border-gold-200',
  secondary:
    'bg-transparent text-gold-200 border-2 border-gold-200 hover:bg-gold-200/10 hover:shadow-[0_0_15px_rgba(244,196,48,0.2)]',
  ghost:
    'bg-transparent text-white hover:bg-white/5 border border-transparent',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', className = '', children, ...props }, ref) => {
    return (
      <motion.span
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
        className="inline-block"
      >
        <button
          ref={ref}
          className={`inline-flex items-center justify-center gap-2 w-full px-6 py-3 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${className}`}
          {...props}
        >
          {children}
        </button>
      </motion.span>
    );
  }
);

Button.displayName = 'Button';
