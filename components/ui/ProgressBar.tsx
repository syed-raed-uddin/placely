'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface ProgressBarProps {
  value: number;
  max?: number;
  colorClass?: string;
  bgClass?: string;
  heightClass?: string;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  colorClass = 'bg-[#FF7A00]',
  bgClass = 'bg-white/10',
  heightClass = 'h-2',
  className = '',
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div
      className={`w-full overflow-hidden rounded-full ${bgClass} ${heightClass} ${className}`}
    >
      <motion.div
        className={`h-full rounded-full ${colorClass}`}
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />
    </div>
  );
};

export default ProgressBar;
