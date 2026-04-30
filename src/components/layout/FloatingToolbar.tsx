"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Moon, Sun, Monitor, Share2, Info } from 'lucide-react';
import { useTheme } from 'next-themes';

export const FloatingToolbar: React.FC = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <div className="fixed left-6 bottom-6 z-[999] flex flex-col items-start gap-3">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: -20, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -20, scale: 0.9 }}
                        className="bg-background/80 backdrop-blur-xl border border-foreground/10 rounded-2xl p-2 shadow-2xl flex flex-col gap-2 mb-2"
                    >
                        <button
                            onClick={() => setTheme('light')}
                            className={`p-3 rounded-xl transition-all flex items-center gap-3 ${theme === 'light' ? 'bg-foreground text-background' : 'text-foreground/60 hover:bg-foreground/5 hover:text-foreground'}`}
                        >
                            <Sun size={18} />
                            <span className="text-[10px] font-black tracking-widest uppercase pr-2">Light</span>
                        </button>
                        <button
                            onClick={() => setTheme('dark')}
                            className={`p-3 rounded-xl transition-all flex items-center gap-3 ${theme === 'dark' ? 'bg-foreground text-background' : 'text-foreground/60 hover:bg-foreground/5 hover:text-foreground'}`}
                        >
                            <Moon size={18} />
                            <span className="text-[10px] font-black tracking-widest uppercase pr-2">Dark</span>
                        </button>
                        <button
                            onClick={() => setTheme('system')}
                            className={`p-3 rounded-xl transition-all flex items-center gap-3 ${theme === 'system' ? 'bg-foreground text-background' : 'text-foreground/60 hover:bg-foreground/5 hover:text-foreground'}`}
                        >
                            <Monitor size={18} />
                            <span className="text-[10px] font-black tracking-widest uppercase pr-2">Auto</span>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-4 rounded-full shadow-2xl transition-all duration-500 border border-foreground/10 flex items-center justify-center group ${isOpen ? 'bg-foreground text-background rotate-90' : 'bg-background text-foreground'}`}
            >
                <Settings size={20} className={isOpen ? '' : 'group-hover:rotate-45 transition-transform duration-500'} />
            </button>
        </div>
    );
};
