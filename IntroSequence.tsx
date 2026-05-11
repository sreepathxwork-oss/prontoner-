import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Zap } from 'lucide-react';
import { cn } from '../lib/utils';

import { Logo } from './Logo';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  angle: number;
  distance: number;
  orbitSpeed: number;
}

export const IntroSequence = ({ onComplete }: { onComplete: () => void, key?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<'hook' | 'evolution' | 'reveal' | 'settle'>('hook');
  const phaseRef = useRef<'hook' | 'evolution' | 'reveal' | 'settle'>('hook');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let width = window.innerWidth;
    let height = window.innerHeight;
    let cx = width / 2;
    let cy = height / 2;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      cx = width / 2;
      cy = height / 2;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', resize);
    resize();

    const colors = ['#FF2A85', '#7A00FF', '#FF9900', '#ffffff'];

    // Create particles
    for (let i = 0; i < 400; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 100 + 20;
      particles.push({
        x: cx + Math.cos(angle) * distance,
        y: cy + Math.sin(angle) * distance,
        vx: (Math.random() - 0.5) * 50,
        vy: (Math.random() - 0.5) * 50,
        size: Math.random() * 2.5 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        angle,
        distance,
        orbitSpeed: (Math.random() - 0.5) * 0.1
      });
    }

    let startTime = Date.now();
    let flashAlpha = 0;

    const draw = () => {
      const elapsed = Date.now() - startTime;
      
      // Update phase
      let currentPhase = phaseRef.current;
      if (elapsed < 1200) currentPhase = 'hook';
      else if (elapsed < 3000) currentPhase = 'evolution';
      else if (elapsed < 4200) currentPhase = 'reveal';
      else currentPhase = 'settle';

      if (currentPhase !== phaseRef.current) {
        phaseRef.current = currentPhase;
        setPhase(currentPhase);
        if (currentPhase === 'reveal') {
            flashAlpha = 1; // Trigger flash
        }
      }

      // Clear canvas for transparency
      ctx.clearRect(0, 0, width, height);

      ctx.globalCompositeOperation = 'lighter';

      // Draw particles
      particles.forEach((p, i) => {
        if (currentPhase === 'hook') {
          // Explosion
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.92;
          p.vy *= 0.92;
        } else if (currentPhase === 'evolution') {
          // Swirl into a vortex
          p.angle += p.orbitSpeed;
          p.distance -= 0.5; // pull inward
          if (p.distance < 10) p.distance = 10;
          
          const targetX = cx + Math.cos(p.angle) * (p.distance * (1 + Math.sin(elapsed * 0.005 + i) * 0.5));
          const targetY = cy + Math.sin(p.angle) * (p.distance * (1 + Math.cos(elapsed * 0.005 + i) * 0.5));
          
          p.x += (targetX - p.x) * 0.1;
          p.y += (targetY - p.y) * 0.1;

          // Draw connections
          if (i % 5 === 0) {
              for(let j = 0; j < 5; j++) {
                  const other = particles[(i + j) % particles.length];
                  const dx = p.x - other.x;
                  const dy = p.y - other.y;
                  const dist = Math.sqrt(dx*dx + dy*dy);
                  if (dist < 60) {
                      ctx.beginPath();
                      ctx.strokeStyle = `rgba(255, 42, 133, ${0.15 * (1 - dist/60)})`;
                      ctx.lineWidth = 0.5;
                      ctx.moveTo(p.x, p.y);
                      ctx.lineTo(other.x, other.y);
                      ctx.stroke();
                  }
              }
          }

        } else if (currentPhase === 'reveal') {
          // Implode rapidly
          p.x += (cx - p.x) * 0.2;
          p.y += (cy - p.y) * 0.2;
        } else if (currentPhase === 'settle') {
           // Gentle floating background dust
           p.x += Math.sin(elapsed * 0.001 + i) * 0.5;
           p.y += Math.cos(elapsed * 0.001 + i) * 0.5;
           p.size *= 0.98; // fade out
        }

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0, p.size), 0, Math.PI * 2);
        ctx.fill();
      });

      // Flash effect
      if (flashAlpha > 0) {
          ctx.globalCompositeOperation = 'source-over';
          ctx.fillStyle = `rgba(255, 255, 255, ${flashAlpha})`;
          ctx.fillRect(0, 0, width, height);
          flashAlpha *= 0.9;
      }

      if (elapsed < 6000) {
        animationFrameId = requestAnimationFrame(draw);
      } else {
        onComplete();
      }
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      
      <AnimatePresence>
        {(phase === 'reveal' || phase === 'settle') && (
          <motion.div 
            initial={{ opacity: 0, scale: 2, filter: 'blur(20px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 text-center flex flex-col items-center justify-center"
          >
            <motion.div
              animate={phase === 'settle' ? { 
                y: [0, -5, 0, 5, 0],
                x: [0, 2, -2, 0]
              } : {}}
              transition={{ duration: 0.2, repeat: phase === 'settle' ? 2 : 0 }}
            >
              <Logo size="xl" className="mb-2" />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "100%" }}
              transition={{ delay: 0.5, duration: 1 }}
              className="h-px bg-gradient-to-r from-transparent via-primary to-transparent w-full max-w-md my-4"
            />

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="font-mono text-sm uppercase tracking-[0.5em] text-primary drop-shadow-[0_0_10px_rgba(255,42,133,0.8)]"
            >
              Neural Synthesis Engine v2.0
            </motion.p>
          </motion.div>
        )}

        {phase === 'settle' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-12 left-0 right-0 px-12 flex justify-between items-end"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-primary font-mono text-[10px] uppercase tracking-widest">
                <Activity className="w-3 h-3 animate-pulse" /> System Online
              </div>
              <div className="h-1 w-48 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.5 }}
                  className="h-full bg-primary shadow-[0_0_10px_#FF2A85]"
                />
              </div>
            </div>
            
            <div className="text-right space-y-1">
              <p className="font-mono text-[10px] text-white/20 uppercase tracking-widest">Initialization Complete</p>
              <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest">Ready for Neural Link</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Atmospheric Overlays */}
      <div className="absolute inset-0 pointer-events-none mix-blend-screen">
        <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent opacity-50" />
        <div className="scanline opacity-30" />
      </div>
    </div>
  );
};

