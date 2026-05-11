import React from 'react';
import { motion } from 'motion/react';
import { Hexagon, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
}

export const Logo = ({ className, size = 'md', animated = false }: LogoProps) => {
  const sizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl',
    xl: 'text-6xl md:text-8xl'
  };

  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
    xl: 'w-16 h-16 md:w-24 md:h-24'
  };

  const content = (
    <div className={cn("flex items-center justify-center gap-3 font-display tracking-[0.2em]", className)}>
      <div className="relative flex items-center justify-center">
        <Hexagon className={cn("text-primary drop-shadow-[0_0_15px_rgba(255,42,133,0.8)]", iconSizes[size])} strokeWidth={1.5} />
        <Sparkles className={cn("absolute text-white", size === 'xl' ? 'w-8 h-8' : 'w-3 h-3')} strokeWidth={2} />
      </div>
      <div className="flex flex-col">
        <span className={cn("text-white mix-blend-difference drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] leading-none", sizes[size])}>
          PROMTONER<span className="text-primary">X</span>
        </span>
      </div>
    </div>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
};
