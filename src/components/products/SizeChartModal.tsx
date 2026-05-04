"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Image from 'next/image';

interface SizeChartModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SizeChartModal: React.FC<SizeChartModalProps> = ({ isOpen, onClose }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-10">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-background/80 backdrop-blur-xl"
                    />

                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="relative bg-white w-full max-w-3xl rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col border border-foreground/5"
                    >
                        {/* Close Button */}
                        <button 
                            onClick={onClose}
                            className="absolute top-6 right-6 z-50 text-black/40 hover:text-black transition-colors p-2 bg-black/5 backdrop-blur-md rounded-full hover:bg-black/10"
                        >
                            <X size={20} />
                        </button>

                        <div className="relative w-full aspect-[3/2] sm:aspect-video">
                            <Image 
                                src="/sizeChart.jpeg"
                                alt="Size Chart"
                                fill
                                className="object-contain p-8 md:p-12"
                                priority
                            />
                        </div>
                        
                        <div className="bg-black/5 p-6 text-center">
                            <p className="text-[10px] font-black tracking-[0.3em] text-black/40 uppercase">
                                Cinematic Quality — Precision Fit
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default SizeChartModal;
