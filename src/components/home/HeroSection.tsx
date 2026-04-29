"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Edit3 } from 'lucide-react';

interface HeroSectionProps {
    settings: any;
    isAdmin?: boolean;
    onEdit?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ settings, isAdmin, onEdit }) => {
    const [imgError, setImgError] = React.useState(false);
    const heroImg = settings?.heroImage || "https://res.cloudinary.com/dg0juhz7e/image/upload/v1776746875/corase/products/acid-tee.jpg";

    return (
        <section className="relative w-full bg-background pt-8 md:pt-12">
            {/* Image Area - 85% of viewport */}
            <div className="relative h-[85vh] w-full overflow-hidden">
                {/* Background Layer with Parallax-ish Zoom */}
                <motion.div
                    initial={{ scale: 1.1, filter: 'blur(20px)', opacity: 0 }}
                    animate={{ scale: 1, filter: 'blur(0px)', opacity: 1 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className="absolute inset-0 z-0"
                >
                    {!imgError ? (
                        <Image
                            src={heroImg}
                            alt="CORASE Hero"
                            fill
                            className="object-cover object-top w-full h-full brightness-[0.7] grayscale-[0.2]"
                            priority
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-background via-foreground/10 to-background opacity-50" />
                    )}

                    {/* Watermark Overlay Text */}
                    <div className="absolute inset-0 flex items-center justify-center z-10 overflow-hidden pointer-events-none">
                        <motion.h2
                            initial={{ opacity: 0, scale: 0.9, y: 50 }}
                            animate={{ opacity: 0.1, scale: 1, y: 0 }}
                            transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
                            className="text-[30vw] font-black font-syncopate text-brand-red tracking-tighter uppercase italic leading-none select-none blur-[1px]"
                        >
                            {settings?.heroOverlayText || "CORASE"}
                        </motion.h2>
                    </div>

                    {/* Central Hero Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-6 text-center">
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 1 }}
                            className="text-[10px] md:text-xs font-black tracking-[0.6em] text-white/50 uppercase mb-4"
                        >
                            {settings?.heroSubtitle || "DRIP, DETAIL, DOMINANCE"}
                        </motion.p>
                        
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.2, delay: 1.2 }}
                            className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black font-syncopate text-white tracking-tighter uppercase leading-[0.95] max-w-4xl"
                        >
                            {settings?.heroTitle || "The New Standard"}
                        </motion.h1>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, delay: 1.5 }}
                            className="mt-10 flex flex-col md:flex-row items-center gap-4 md:gap-6"
                        >
                            <Link
                                href={settings?.heroButtonLink || "/shop"}
                                className="group relative inline-flex items-center justify-center gap-4 bg-brand-red text-white px-10 md:px-14 py-5 md:py-6 rounded-full font-black text-[10px] md:text-[11px] tracking-[0.4em] uppercase hover:bg-white hover:text-black transition-all duration-500 shadow-[0_20px_50px_rgba(235,50,50,0.3)] hover:shadow-white/20"
                            >
                                {settings?.heroButtonText || "Explore Collection"}
                                <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform duration-500" />
                            </Link>

                            <Link
                                href="/collections"
                                className="text-[10px] md:text-[11px] font-black tracking-[0.4em] uppercase text-white/40 hover:text-white transition-all duration-500 border-b border-white/10 pb-2 hover:border-brand-red"
                            >
                                Full Lookbook
                            </Link>
                        </motion.div>
                    </div>

                    {/* Gradient Fade to Content */}
                    <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-background via-background/50 to-transparent z-10" />
                </motion.div>
            </div>
        </section>
    );
};
