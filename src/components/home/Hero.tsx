"use client";

import React, { useRef } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

const Hero: React.FC = () => {
    const titleWords = ["CORASE"];
    const containerRef = useRef<HTMLDivElement>(null);
    
    // Mouse Parallax Logic
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    
    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        mouseX.set((clientX / innerWidth) - 0.5);
        mouseY.set((clientY / innerHeight) - 0.5);
    };

    const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
    const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });

    const x = useTransform(springX, [-0.5, 0.5], [-50, 50]);
    const y = useTransform(springY, [-0.5, 0.5], [-50, 50]);

    return (
        <section 
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-liquid"
        >
            {/* Floating Particles (C-logo dust) */}
            {[{p: 1, top: '15%', left: '20%'}, {p: 2, top: '65%', left: '80%'}, {p: 3, top: '85%', left: '30%'}, {p: 4, top: '25%', left: '70%'}, {p: 5, top: '45%', left: '50%'}].map(({p, top, left}) => (
                <motion.div
                    key={p}
                    style={{ x: useTransform(springX, [-0.5, 0.5], [-100 * p, 100 * p]), y: useTransform(springY, [-0.5, 0.5], [-100 * p, 100 * p]) }}
                    className="absolute opacity-[0.03] pointer-events-none"
                    initial={{ top, left }}
                >
                    <div className="w-20 h-20 border-2 border-white rotate-45 flex items-center justify-center font-syncopate text-4xl text-white">C</div>
                </motion.div>
            ))}

            {/* Content with Mouse Parallax */}
            <motion.div 
                style={{ x, y }}
                className="relative z-10 text-center px-4"
            >
                <div className="flex justify-center space-x-1 md:space-x-4 mb-6">
                    {titleWords.map((word, i) => (
                        <motion.span
                            key={i}
                            initial={{ opacity: 0, y: 100, rotateX: -90, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }}
                            transition={{ 
                                duration: 1.5, 
                                delay: 0.2 + (i * 0.1), 
                                ease: [0.16, 1, 0.3, 1] 
                            }}
                            className="text-[18vw] md:text-[12vw] font-bold font-syncopate tracking-tighter text-brand-red leading-none inline-block origin-bottom brand-glow italic"
                        >
                            {word}
                        </motion.span>
                    ))}
                </div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8, duration: 1 }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-3 pointer-events-none"
            >
                <div className="w-px h-12 bg-gradient-to-b from-white/0 via-white/50 to-white/0" />
                <span className="text-[8px] font-black tracking-[0.5em] text-white/40 uppercase">Scroll</span>
                <motion.div
                    animate={{ y: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                >
                    <ArrowDown size={12} className="text-white/40" />
                </motion.div>
            </motion.div>

            {/* Visual Accents */}
            <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-white to-transparent z-10" />
            <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-white to-transparent z-10" />
        </section>
    );
};

export default Hero;
