import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

export const BubbleBackground = () => {
  const [bubbles, setBubbles] = useState<{ id: number, x: number, y: number, size: number, delay: number }[]>([]);

  useEffect(() => {
    const newBubbles = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 10 + 5,
      delay: Math.random() * 10
    }));
    setBubbles(newBubbles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {bubbles.map(b => (
        <motion.div
          key={b.id}
          className="bubble"
          initial={{ y: "110vh", x: `${b.x}vw`, opacity: 0 }}
          animate={{ 
            y: "-10vh", 
            opacity: [0, 0.3, 0],
            x: [`${b.x}vw`, `${b.x + (Math.random() * 10 - 5)}vw`]
          }}
          transition={{ 
            duration: 15 + Math.random() * 10, 
            repeat: Infinity, 
            delay: b.delay,
            ease: "linear"
          }}
          style={{
            width: b.size,
            height: b.size,
            left: 0,
            top: 0
          }}
        />
      ))}
    </div>
  );
};
