import React from 'react';
import { motion } from 'framer-motion';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  reduceMotion?: boolean;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  reduceMotion = false,
}) => {
  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  // Minimal subtle offset for lightning-fast responsiveness
  const offset = 12;
  const initialVariants = {
    up: { opacity: 0, y: offset },
    down: { opacity: 0, y: -offset },
    left: { opacity: 0, x: offset },
    right: { opacity: 0, x: -offset },
    none: { opacity: 0 },
  };

  return (
    <motion.div
      initial={initialVariants[direction]}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{
        duration: 0.25, // Snappy fast response
        delay: Math.min(delay, 0.08),
        ease: 'easeOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
