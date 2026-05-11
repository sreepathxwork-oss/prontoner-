import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Sparkles, Cpu, Brain, Layers, Palette } from 'lucide-react';

interface NeuralLoadingProps {
  progress: number;
  message: string;
  prompt: string;
}

const NeuralLoading: React.FC<NeuralLoadingProps> = ({ progress, message, prompt }) => {
  // Generate random particles for the swirling effect
  const particles = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
      radius: Math.random() * 100 + 100,
      color: i % 2 === 0 ? '#FF2A85' : '#00D2D3',
    }));
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-black/80 backdrop-blur-xl">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,42,133,0.1)_0%,transparent_70%)] animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(0,210,211,0.05)_0%,transparent_50%)]" />
      </div>

      <div className="relative w-96 h-96 flex items-center justify-center">
        {/* Swirling Particles */}
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
            }}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              rotate: {
                duration: p.duration,
                repeat: Infinity,
                ease: "linear",
                delay: p.delay,
              },
              scale: {
                duration: p.duration / 2,
                repeat: Infinity,
                ease: "easeInOut",
              },
              opacity: {
                duration: p.duration / 2,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
          >
            <div 
              className="absolute" 
              style={{ transform: `translateX(${p.radius}px)` }} 
            />
          </motion.div>
        ))}

        {/* Central Neural Hub */}
        <div className="relative z-10">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-32 h-32 rounded-full flex items-center justify-center glass shadow-[0_0_60px_rgba(255,42,133,0.4)] border border-primary/30"
          >
            <div className="relative">
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Brain className="w-16 h-16 text-primary" />
              </motion.div>
              
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0, 1, 0]
                }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
              >
                <Sparkles className="w-6 h-6 text-secondary" />
              </motion.div>
            </div>
          </motion.div>

          {/* Orbiting Icons */}
          {[Zap, Cpu, Layers, Palette].map((Icon, i) => (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              animate={{ rotate: 360 }}
              transition={{ duration: 8 + i * 2, repeat: Infinity, ease: "linear" }}
            >
              <div 
                className="w-10 h-10 rounded-full glass flex items-center justify-center border border-white/10"
                style={{ transform: `translateX(${80 + i * 20}px) rotate(-${360}deg)` }}
              >
                <Icon className="w-5 h-5 text-white/70" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Circular Progress Ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx="192"
            cy="192"
            r="160"
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="4"
          />
          <motion.circle
            cx="192"
            cy="192"
            r="160"
            fill="none"
            stroke="url(#progressGradient)"
            strokeWidth="4"
            strokeDasharray="1005"
            animate={{ strokeDashoffset: 1005 - (1005 * progress) / 100 }}
            transition={{ duration: 0.5, ease: "linear" }}
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF2A85" />
              <stop offset="100%" stopColor="#00D2D3" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Text Content */}
      <div className="mt-12 text-center max-w-lg px-6 z-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={message}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <h3 className="text-3xl font-display tracking-[0.2em] text-glow uppercase">
              {message}
            </h3>
            
            <div className="flex items-center justify-center gap-2 text-white/40 font-mono text-sm">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              PROMPT: {prompt.length > 60 ? prompt.substring(0, 60) + '...' : prompt}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Progress Percentage */}
        <div className="mt-8 flex flex-col items-center">
          <div className="text-5xl font-display text-white/20 tabular-nums">
            {Math.round(progress)}%
          </div>
          <div className="w-64 h-1 bg-white/5 rounded-full mt-4 overflow-hidden glass">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-secondary"
              animate={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeuralLoading;
