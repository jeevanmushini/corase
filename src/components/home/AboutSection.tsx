"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

interface AboutSectionProps {
  settings?: any;
}

export default function AboutSection({ settings }: AboutSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-100, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen md:min-h-[120vh] bg-background text-foreground overflow-hidden py-20 md:py-32 flex items-center"
    >
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-foreground rounded-full blur-[180px] opacity-10 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-16 lg:gap-32">
        
        {/* Left Typography Column */}
        <motion.div style={{ y: y1, opacity }} className="flex-1 space-y-10">
          <div className="space-y-4">
            <h3 className="text-foreground font-syncopate text-sm md:text-md tracking-[0.3em] font-bold">
              THE VISION
            </h3>
            <h2 className="text-3xl md:text-7xl font-black font-syncopate tracking-tighter uppercase leading-[0.9]">
              STREETWEAR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground to-gray-600">
                EVOLVED.
              </span>
            </h2>
          </div>
          
          <div className="space-y-6 max-w-xl">
            <p className="text-gray-400 font-sans text-lg leading-relaxed">
              {settings?.aboutDescription || "Designed for the bold, the restless, and the visionaries. CORASE is more than a brand; it's a movement towards minimal excellence in urban fashion."}
            </p>
            <p className="text-gray-500 font-sans text-md leading-relaxed">
              {settings?.aboutVision || "We source the heaviest, most premium core-spun cotton to create silhouettes that drape perfectly. Every stitch, every print, and every distress mark is calculated to absolute perfection. Welcome to the future of the archive."}
            </p>
          </div>

          <div className="pt-8 flex gap-8 border-t border-foreground/10">
            <div>
              <p className="text-3xl font-syncopate font-bold text-foreground mb-1">01</p>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Premium Fabrics</p>
            </div>
            <div>
              <p className="text-3xl font-syncopate font-bold text-foreground mb-1">02</p>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Limited Drops</p>
            </div>
          </div>
        </motion.div>

        {/* Right Imagery Column */}
        <motion.div style={{ y: y2, opacity }} className="flex-1 relative w-full aspect-[4/5] md:aspect-square">
          <div className="absolute inset-0 border border-foreground/10 rounded-3xl overflow-hidden group">
            <Image 
              src="/products/cyber-tee.png"
              alt="Corase Fabric"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover scale-[1.02] group-hover:scale-110 transition-transform duration-[2s] ease-out opacity-40 grayscale group-hover:grayscale-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
          </div>
          
          {/* Floating badge - refined for mobile */}
          <div className="absolute -bottom-6 -left-6 md:-bottom-10 md:-left-10 w-28 h-28 md:w-40 md:h-40 border border-foreground/20 rounded-full flex items-center justify-center backdrop-blur-md bg-background/40 rotate-12 z-20">
            <div className="text-center">
              <p className="text-foreground font-syncopate text-lg md:text-2xl font-black">100%</p>
              <p className="text-[7px] md:text-[8px] tracking-[0.2em] font-bold text-foreground uppercase mt-1">Authentic</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
