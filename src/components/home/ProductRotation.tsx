"use client";

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Product } from '@/context/CartContext';
import Image from 'next/image';
import { ShoppingBag, ArrowRight } from 'lucide-react';

interface ProductRotationProps {
    products: Product[];
    onSelectProduct: (product: Product) => void;
}

const ProductRotation: React.FC<ProductRotationProps> = ({ products, onSelectProduct }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const smooth = useSpring(scrollYProgress, { stiffness: 50, damping: 18, restDelta: 0.001 });
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        return smooth.on("change", v => setActiveIndex(v > 0.5 ? 1 : 0));
    }, [smooth]);

    if (!products || products.length < 2) return null;

    const p0 = products[0];
    const p1 = products[1];

    return (
        <div ref={containerRef} className="relative h-[180vh] bg-background">
            {/* Sticky viewport */}
            <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
                {/* Background gradient pulse */}
                <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: useTransform(smooth, [0, 1], [
                            "radial-gradient(ellipse at 65% 40%, rgba(255,220,120,0.4) 0%, transparent 65%)",
                            "radial-gradient(ellipse at 35% 40%, rgba(255,140,40,0.4) 0%, transparent 65%)",
                        ])
                    }}
                />

                {/* Section label */}
                <div className="absolute top-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20">
                    <p className="text-sm font-black text-foreground/60 tracking-[0.5em] uppercase">
                        Featured Drops
                    </p>
                    <div className="flex gap-2">
                        {[0, 1].map(i => (
                            <div
                                key={i}
                                className={`rounded-full transition-all duration-500 ${
                                    activeIndex === i ? 'w-8 h-1.5 bg-foreground' : 'w-1.5 h-1.5 bg-foreground/30'
                                }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Cards */}
                <div className="relative w-full h-full flex items-center justify-center">
                    <Card product={p0} progress={smooth} isFirst={true} onSelect={onSelectProduct} />
                    <Card product={p1} progress={smooth} isFirst={false} onSelect={onSelectProduct} />
                </div>

                {/* Product info at bottom */}
                <div className="absolute bottom-12 inset-x-0 flex flex-col items-center z-30 pointer-events-none px-4">
                    <Info p0={p0} p1={p1} progress={smooth} onSelect={onSelectProduct} />
                </div>

                {/* Scroll hint */}
                <motion.div
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
                    style={{ opacity: useTransform(smooth, [0, 0.12], [1, 0]) }}
                >
                    <div className="w-px h-8 bg-foreground/50 animate-pulse" />
                    <span className="text-[8px] tracking-[0.4em] text-foreground/50 font-bold uppercase">Scroll</span>
                </motion.div>
            </div>
        </div>
    );
};

// ── Card ──────────────────────────────────────────────────────────
interface CardProps {
    product: Product;
    progress: any;
    isFirst: boolean;
    onSelect: (p: Product) => void;
}

const Card = ({ product, progress, isFirst, onSelect }: CardProps) => {
    const [hovered, setHovered] = useState(false);

    const x = useTransform(
        progress,
        [0, 0.4, 0.6, 1],
        isFirst
            ? ["0vw", "-15vw", "-42vw", "-55vw"]
            : ["55vw", "30vw", "10vw", "0vw"]
    );

    const scale = useTransform(
        progress,
        [0, 0.45, 0.55, 1],
        isFirst ? [1, 0.9, 0.78, 0.72] : [0.72, 0.82, 0.95, 1]
    );

    const opacity = useTransform(
        progress,
        [0, 0.35, 0.55, 1],
        isFirst ? [1, 0.85, 0.4, 0.2] : [0.5, 0.7, 0.95, 1]
    );

    const rotateY = useTransform(
        progress,
        [0, 0.5, 1],
        isFirst ? [0, -6, -14] : [14, 6, 0]
    );

    const zIndex = useTransform(
        progress,
        [0, 0.49, 0.51, 1],
        isFirst ? [10, 10, 4, 4] : [4, 4, 10, 10]
    );

    return (
        <motion.div
            style={{ x, scale, opacity, zIndex, rotateY }}
            className="absolute will-change-transform cursor-pointer"
            onClick={() => onSelect(product)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div
                style={{ perspective: '1200px' }}
                className="relative w-[55vw] h-[55vw] sm:w-[320px] sm:h-[420px] md:w-[360px] md:h-[460px]"
            >
                {/* Card background */}
                <div className={`absolute inset-0 rounded-3xl transition-all duration-500 ${
                    hovered ? 'bg-foreground/15' : 'bg-foreground/5'
                } backdrop-blur-sm border border-foreground/20`} />

                {/* Product image */}
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 55vw, (max-width: 768px) 320px, 360px"
                    className="object-contain p-6 drop-shadow-[0_30px_60px_rgba(0,0,0,0.3)]"
                    priority={isFirst}
                    quality={90}
                />

                {/* Hover CTA */}
                <motion.div
                    animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 8 }}
                    transition={{ duration: 0.25 }}
                    className="absolute inset-x-4 bottom-4 bg-background/70 backdrop-blur-sm rounded-2xl flex items-center justify-center gap-2 py-3 pointer-events-none"
                >
                    <ShoppingBag size={14} className="text-foreground" />
                    <span className="text-xs font-black text-foreground tracking-widest uppercase">Quick View</span>
                </motion.div>
            </div>
        </motion.div>
    );
};

// ── Info ──────────────────────────────────────────────────────────
const Info = ({ p0, p1, progress, onSelect }: {
    p0: Product; p1: Product; progress: any; onSelect: (p: Product) => void;
}) => {
    const op0 = useTransform(progress, [0, 0.3, 0.45], [1, 0.6, 0]);
    const y0  = useTransform(progress, [0, 0.35, 0.45], [0, -6, -18]);

    const op1 = useTransform(progress, [0.55, 0.7, 1], [0, 0.75, 1]);
    const y1  = useTransform(progress, [0.55, 0.7, 1], [18, 6, 0]);

    return (
        <div className="relative h-36 w-full flex items-center justify-center">
            {/* P0 Info */}
            <motion.div
                style={{ opacity: op0, y: y0 }}
                className="absolute flex flex-col items-center text-center pointer-events-auto px-4"
            >
                <span className="text-[10px] font-black tracking-[0.45em] text-foreground/60 uppercase mb-2">Featured Drop</span>
                <h2 className="text-3xl sm:text-5xl md:text-6xl font-black font-syncopate italic tracking-tighter text-foreground mb-2 uppercase">
                    {p0.name}
                </h2>
                <p className="text-foreground/70 font-bold tracking-[0.25em] text-sm mb-4">${p0.price}</p>
                <button
                    onClick={() => onSelect(p0)}
                    className="flex items-center gap-3 bg-foreground text-background px-7 py-2.5 rounded-full font-black text-[10px] tracking-widest uppercase hover:scale-105 hover:shadow-[0_8px_32px_rgba(255,255,255,0.3)] transition-all duration-300 active:scale-95"
                >
                    View Details <ArrowRight size={12} />
                </button>
            </motion.div>

            {/* P1 Info */}
            <motion.div
                style={{ opacity: op1, y: y1 }}
                className="absolute flex flex-col items-center text-center pointer-events-auto px-4"
            >
                <span className="text-[10px] font-black tracking-[0.45em] text-foreground/60 uppercase mb-2">Latest Arrival</span>
                <h2 className="text-3xl sm:text-5xl md:text-6xl font-black font-syncopate italic tracking-tighter text-foreground mb-2 uppercase">
                    {p1.name}
                </h2>
                <p className="text-foreground/70 font-bold tracking-[0.25em] text-sm mb-4">${p1.price}</p>
                <button
                    onClick={() => onSelect(p1)}
                    className="flex items-center gap-3 bg-foreground text-background px-7 py-2.5 rounded-full font-black text-[10px] tracking-widest uppercase hover:scale-105 hover:shadow-[0_8px_32px_rgba(255,255,255,0.3)] transition-all duration-300 active:scale-95"
                >
                    View Details <ArrowRight size={12} />
                </button>
            </motion.div>
        </div>
    );
};

export default ProductRotation;
