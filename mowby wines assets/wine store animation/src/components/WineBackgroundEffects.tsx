"use client";

import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

export function WineBackgroundEffects() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Animated gradient background with wine colors */}
      <motion.div
        animate={{
          background: [
            "radial-gradient(circle at 20% 80%, rgba(147, 51, 234, 0.12) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(220, 38, 38, 0.12) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(236, 72, 153, 0.12) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.12) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(220, 38, 38, 0.12) 0%, transparent 50%), radial-gradient(circle at 60% 60%, rgba(236, 72, 153, 0.12) 0%, transparent 50%)",
            "radial-gradient(circle at 60% 60%, rgba(147, 51, 234, 0.12) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(220, 38, 38, 0.12) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(236, 72, 153, 0.12) 0%, transparent 50%)"
          ]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute inset-0"
      />
      
      {/* Floating ambient sparkles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          initial={{
            x: Math.random() * 1200,
            y: Math.random() * 800,
            scale: 0,
            opacity: 0
          }}
          animate={{
            x: [
              Math.random() * 1200,
              Math.random() * 1200,
              Math.random() * 1200
            ],
            y: [
              Math.random() * 800,
              Math.random() * 800,
              Math.random() * 800
            ],
            scale: [0, Math.random() * 0.6 + 0.3, 0],
            opacity: [0, Math.random() * 0.5 + 0.2, 0],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: Math.random() * 12 + 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 2.5
          }}
          className="absolute"
        >
          <Sparkles 
            className="w-3 h-3 text-purple-300/40" 
          />
        </motion.div>
      ))}
      
      {/* Floating light particles - wine colors */}
      {[...Array(25)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          initial={{
            x: Math.random() * 1200,
            y: 850,
            scale: 0
          }}
          animate={{
            x: [
              Math.random() * 1200,
              Math.random() * 1200 + (Math.random() - 0.5) * 200
            ],
            y: [
              850,
              -50
            ],
            scale: [0, Math.random() * 0.8 + 0.2, 0],
            opacity: [0, Math.random() * 0.4 + 0.1, 0]
          }}
          transition={{
            duration: Math.random() * 10 + 14,
            repeat: Infinity,
            ease: "easeOut",
            delay: i * 0.9
          }}
          className={`absolute w-1 h-1 rounded-full blur-sm ${
            i % 3 === 0 
              ? 'bg-purple-300/60' 
              : i % 3 === 1 
              ? 'bg-red-300/60' 
              : 'bg-pink-300/60'
          }`}
        />
      ))}
      
      {/* Subtle light rays with wine color */}
      <motion.div
        animate={{
          opacity: [0.06, 0.16, 0.06],
          scale: [0.8, 1.2, 0.8]
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-purple-200/20 via-red-200/10 to-transparent rounded-full blur-3xl"
      />

      {/* Additional ambient glow */}
      <motion.div
        animate={{
          opacity: [0.04, 0.12, 0.04],
          x: [-100, 100, -100],
          y: [-50, 50, -50]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/4 right-1/4 w-80 h-80 bg-gradient-radial from-pink-200/15 via-purple-200/8 to-transparent rounded-full blur-3xl"
      />
    </div>
  );
}
