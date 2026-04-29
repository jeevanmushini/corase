"use client";

import React from 'react';
import { motion } from 'framer-motion';
import AboutSection from '@/components/home/AboutSection';
import Image from 'next/image';

const values = [
    {
        number: "01",
        title: "PREMIUM FABRIC",
        desc: "250gsm core-spun cotton, pre-washed for a lived-in feel that only improves over time.",
    },
    {
        number: "02",
        title: "LIMITED DROPS",
        desc: "Every release is tightly controlled. Once it's gone, it's gone. No restocks, no compromises.",
    },
    {
        number: "03",
        title: "ETHICAL CRAFT",
        desc: "Made in small batches by artisan print houses that share our obsession with quality.",
    },
    {
        number: "04",
        title: "ARCHIVE FOREVER",
        desc: "Every piece becomes part of the CORASE archive — a permanent record of a moment in time.",
    },
];

export default function AboutPage() {
    const [settings, setSettings] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch("/api/admin/settings");
                const data = await res.json();
                setSettings(data);
            } catch (error) {
                console.error("Failed to fetch settings:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const aboutValues = settings?.aboutValues || values;

    return (
        <div className="bg-background text-foreground min-h-screen">
            {/* Hero */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-foreground opacity-5 blur-[200px] rounded-full scale-150 pointer-events-none" />
                <div className="absolute inset-0 bg-[url('/products/cyber-tee.png')] bg-center bg-cover opacity-5 grayscale pointer-events-none" />

                <div className="relative z-10 text-center max-w-4xl mx-auto px-6 pt-24">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-foreground font-syncopate text-[10px] md:text-xs tracking-[0.3em] md:tracking-[0.5em] font-bold mb-8"
                    >
                        EST. 2024 — THE <span className="text-brand-red">CORASE</span> STORY
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="text-3xl sm:text-6xl md:text-9xl font-black font-syncopate tracking-tighter uppercase italic leading-[0.85] mb-12 text-brand-red"
                    >
                        WE ARE<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground to-[#ff0000]">
                            CORASE
                        </span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="text-foreground/40 font-bold tracking-[0.2em] uppercase text-[10px] md:text-xs leading-relaxed md:leading-loose max-w-lg mx-auto"
                    >
                        {settings?.aboutTagline || "A streetwear brand born from the intersection of art, architecture and the urban underground."}
                    </motion.p>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-3 opacity-30">
                    <div className="w-px h-16 bg-foreground animate-pulse" />
                    <span className="text-[8px] tracking-[0.5em] font-bold text-foreground uppercase">Scroll</span>
                </div>
            </section>

            {/* About Section Component */}
            <AboutSection settings={settings} />

            {/* Values Section */}
            <section className="py-20 md:py-32 px-6 lg:px-12 max-w-screen-xl mx-auto">
                <div className="mb-20">
                    <span className="text-foreground font-syncopate text-xs tracking-[0.5em] font-bold">OUR PILLARS</span>
                    <h2 className="text-3xl md:text-7xl font-black font-syncopate tracking-tighter uppercase mt-4 leading-tight">
                        WHAT WE<br />STAND FOR
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-16">
                    {aboutValues.map((v: any, i: number) => (
                        <motion.div
                            key={v.number || i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: i * 0.1 }}
                            className="border-t border-foreground/10 pt-8 group"
                        >
                            <div className="flex items-start space-x-4 md:space-x-6">
                                <span className="text-4xl md:text-5xl font-black text-foreground/20 font-syncopate group-hover:text-foreground/40 transition-colors duration-500">
                                    {String(i + 1).padStart(2, '0')}
                                </span>
                                <div>
                                    <h3 className="text-xl font-black font-syncopate tracking-tight uppercase mb-3 group-hover:text-foreground transition-colors duration-500">
                                        {v.title}
                                    </h3>
                                    <p className="text-foreground/40 text-sm leading-relaxed font-bold tracking-wide">
                                        {v.desc}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 md:py-32 px-6 text-center border-t border-foreground/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-foreground opacity-5 blur-[150px] pointer-events-none" />
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative z-10"
                >
                    <h2 className="text-3xl md:text-8xl font-black font-syncopate tracking-tighter uppercase italic mb-8">
                        {settings?.aboutCtaHeading || "WEAR THE ARCHIVE"}
                    </h2>
                    <a
                        href="/collections"
                        className="inline-flex items-center space-x-3 bg-foreground text-background px-12 py-5 rounded-full font-black font-syncopate text-xs tracking-widest uppercase hover:scale-105 hover:shadow-[0_20px_60px_rgba(255,159,67,0.3)] transition-all duration-500"
                    >
                        <span>{settings?.aboutCtaButton || "EXPLORE COLLECTION"}</span>
                    </a>
                </motion.div>
            </section>
        </div>
    );
}
