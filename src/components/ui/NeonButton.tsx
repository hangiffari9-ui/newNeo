import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
}

export const NeonButton: React.FC<NeonButtonProps> = ({ className, variant = 'primary', ...props }) => {
  const variants = {
    primary: "bg-primary text-black hover:shadow-neon border-transparent",
    secondary: "bg-secondary text-black hover:shadow-neon border-transparent",
    danger: "bg-red-500/20 text-red-400 border-red-500/50 hover:bg-red-500/30",
    outline: "bg-transparent border-white/20 text-white hover:bg-white/5"
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      className={twMerge(
        clsx(
          "px-4 py-3 rounded-xl font-semibold transition-all duration-300 border flex items-center justify-center gap-2",
          variants[variant],
          className
        )
      )}
      {...props}
    />
  );
};
