import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className, noPadding = false, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={twMerge(
        clsx(
          "bg-surface/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass overflow-hidden",
          // Responsive padding: p-4 on mobile, p-5 on larger screens
          !noPadding && "p-4 md:p-5",
          className
        )
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};
