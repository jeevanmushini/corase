"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Ghost } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Cinematic Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-brand-red opacity-[0.03] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop')] bg-center bg-cover opacity-5 grayscale pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 text-center"
      >
        <motion.div
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ repeat: Infinity, duration: 2, repeatType: "reverse", ease: "easeInOut" }}
          className="mb-12 inline-block"
        >
          <h1 className="text-[12rem] md:text-[20rem] font-black font-syncopate text-white/5 leading-none select-none">
            404
          </h1>
        </motion.div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full">
          <h2 className="text-3xl md:text-5xl font-black font-syncopate text-brand-red uppercase tracking-tighter italic mb-6">
            Lost in the Archive
          </h2>
          <p className="text-white/40 font-bold tracking-[0.2em] uppercase text-[10px] md:text-xs mb-12 max-w-sm mx-auto leading-loose">
            The piece you are looking for has been moved or purged. <br className="hidden md:block" /> Return to headquarters.
          </p>
          
          <Link
            href="/"
            className="inline-flex items-center gap-3 bg-white text-black px-10 py-4 rounded-full font-black font-syncopate text-[10px] tracking-widest uppercase hover:scale-105 transition-all shadow-[0_20px_50px_rgba(255,255,255,0.15)]"
          >
            <ArrowLeft size={14} /> Back to Reality
          </Link>
        </div>
      </motion.div>

      {/* Watermark */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-10">
        <span className="text-[8px] font-black font-syncopate tracking-[0.8em] text-white uppercase italic">CORASE // SYSTEM FAILURE</span>
      </div>
    </div>
  );
}
