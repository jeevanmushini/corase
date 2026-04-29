"use client";

import React from 'react';
import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-black z-[9999] flex flex-col items-center justify-center">
      <div className="relative">
        {/* Animated Brand Pulse */}
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 1, 0.3]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-4xl md:text-6xl font-black font-syncopate text-brand-red uppercase tracking-tighter italic select-none"
        >
          CORASE
        </motion.div>
        
        {/* Progress Bar */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-white/10 overflow-hidden">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              ease: "linear"
            }}
            className="w-full h-full bg-brand-red"
          />
        </div>
      </div>
      
      <div className="mt-16 overflow-hidden">
        <motion.p
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          className="text-[8px] font-black tracking-[0.5em] text-white/30 uppercase"
        >
          Accessing Archive...
        </motion.p>
      </div>
    </div>
  );
}
