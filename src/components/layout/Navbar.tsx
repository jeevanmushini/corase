"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Menu, X, Search, Heart, User } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';


const Navbar: React.FC = () => {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { totalItems, setIsOpen } = useCart();
    const { totalWishlist } = useWishlist();
    const router = useRouter();
    const { data: session, status } = useSession();
    const isLoggedIn = status === 'authenticated';

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
            setIsSearchOpen(false);
            setSearchQuery('');
        }
    };

    const isAdmin = status === 'authenticated' && (session?.user as any)?.role === 'admin';
    const navLinks = [
        { label: 'HOME', href: '/' },
        { label: 'SHOP', href: '/shop' },
        ...(isAdmin ? [{ label: 'DASHBOARD', href: '/admin' }] : []),
        { label: 'COLLECTIONS', href: '/collections' },
        { label: 'ABOUT', href: '/about' },
    ];

    if (!mounted) return null;

    const isLight = theme === 'light';

    return (
        <>
            <nav className={cn(
                "sticky top-0 w-full z-[200] transition-all duration-500 ease-in-out",
                "px-4 md:px-8 py-2 md:py-3 backdrop-blur-2xl border-b border-foreground/5 shadow-sm",
                isLight ? "bg-black text-white" : "bg-white text-black",
                isScrolled ? "py-1 md:py-2 shadow-md" : "py-2 md:py-3"
            )}>
                <div className="flex items-center justify-between gap-4">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 md:gap-4 hover:scale-105 transition-transform">
                        <div>
                            <span className="text-base md:text-2xl font-black font-syncopate tracking-tighter text-brand-red block leading-none">CORASE</span>
                            <span className={cn(
                                "text-[7px] md:text-[10px] font-bold tracking-[0.15em] md:tracking-[0.3em] uppercase",
                                isLight ? "text-white/60" : "text-black/60"
                            )}>DRIP, DETAIL, DOMINANCE</span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden lg:flex items-center gap-10">
                        {navLinks.map((item, index) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="group relative"
                            >
                                <motion.span
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.08 + 0.3 }}
                                    className={cn(
                                        "text-[10px] font-black font-syncopate tracking-[0.2em] transition-all duration-300 block uppercase italic",
                                        isLight ? "text-white/70 group-hover:text-white" : "text-black/70 group-hover:text-black"
                                    )}
                                >
                                    {item.label}
                                </motion.span>
                                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-brand-red transition-all duration-300 group-hover:w-full shadow-[0_0_8px_rgba(255,0,0,0.5)]" />
                            </Link>
                        ))}
                    </div>

                    {/* Right Icons */}
                    <div className="flex items-center gap-2 md:gap-4">

                        {/* Search */}
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className={cn(
                                "transition-all cursor-pointer p-2 rounded-full hover:rotate-12",
                                isLight ? "text-white/70 hover:text-white hover:bg-white/10" : "text-black/70 hover:text-black hover:bg-black/10"
                            )}
                            aria-label="Search"
                        >
                            <Search size={18} />
                        </button>

                        {/* Wishlist */}
                        <Link
                            href="/account?tab=wishlist"
                            className={cn(
                                "relative transition-all p-2 rounded-full hover:rotate-12",
                                isLight ? "text-white/70 hover:text-white hover:bg-white/10" : "text-black/70 hover:text-black hover:bg-black/10"
                            )}
                        >
                            <Heart size={18} />
                            {totalWishlist > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-red text-white text-[8px] font-black flex items-center justify-center rounded-full shadow-[0_0_10px_rgba(255,0,0,0.5)]">
                                    {totalWishlist}
                                </span>
                            )}
                        </Link>

                        {/* Cart */}
                        <button
                            onClick={() => setIsOpen(true)}
                            className={cn(
                                "relative transition-all p-2 rounded-full hover:-rotate-12",
                                isLight ? "text-white/70 hover:text-white hover:bg-white/10" : "text-black/70 hover:text-black hover:bg-black/10"
                            )}
                        >
                            <ShoppingBag size={18} />
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-red text-white text-[8px] font-black flex items-center justify-center rounded-full shadow-[0_0_10px_rgba(255,0,0,0.5)]">
                                    {totalItems}
                                </span>
                            )}
                        </button>

                        {/* User Profile / Login */}
                        <Link
                            href={isLoggedIn ? "/account" : "/login"}
                            className={cn(
                                "transition-all p-2 rounded-full hover:scale-110",
                                isLight ? "text-white/70 hover:text-white hover:bg-white/10" : "text-black/70 hover:text-black hover:bg-black/10"
                            )}
                        >
                            <User size={18} />
                        </Link>

                        <div className={cn(
                            "w-px h-6 mx-1",
                            isLight ? "bg-white/10" : "bg-black/10"
                        )} />

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className={cn(
                                "lg:hidden transition-all p-2 rounded-full",
                                isLight ? "text-white hover:bg-white/10" : "text-black hover:bg-black/10"
                            )}
                        >
                            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Search Overlay */}
            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[500] bg-background/40 backdrop-blur-2xl flex items-start justify-center pt-32 px-6"
                        onClick={() => setIsSearchOpen(false)}
                    >
                        <motion.form
                            initial={{ y: -30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -30, opacity: 0 }}
                            transition={{ type: 'spring', damping: 25 }}
                            onSubmit={handleSearch}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-2xl"
                        >
                            <div className="relative">
                                <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40" />
                                <input
                                    autoFocus
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search tees, drops, styles..."
                                    className="w-full bg-foreground/5 border border-foreground/10 text-foreground placeholder-foreground/40 rounded-[2.5rem] py-6 pl-14 pr-14 text-xl font-bold tracking-tight focus:outline-none focus:border-brand-red transition-all shadow-2xl"
                                />
                                <button
                                    type="button"
                                    onClick={() => setIsSearchOpen(false)}
                                    className={cn(
                                        "absolute right-5 top-1/2 -translate-y-1/2 transition-colors",
                                        isLight ? "text-white/40 hover:text-white" : "text-black/40 hover:text-black"
                                    )}
                                >
                                <X size={20} />
                                </button>
                            </div>
                            <p className={cn(
                                "text-center text-xs font-bold tracking-widest uppercase mt-4",
                                isLight ? "text-white/30" : "text-black/30"
                            )}>
                                Press Enter to search
                            </p>
                        </motion.form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={cn(
                            "fixed inset-4 z-[500] rounded-[14px] flex flex-col items-center justify-center space-y-10 shadow-[0_0_100px_rgba(0,0,0,0.5)] backdrop-blur-3xl",
                            isLight ? "bg-black text-white" : "bg-white text-black"
                        )}
                    >
                        <button
                            className={cn(
                                "absolute top-10 right-10 transition-colors",
                                isLight ? "text-white/50 hover:text-white" : "text-black/50 hover:text-black"
                            )}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <X size={32} />
                        </button>
                        {navLinks.map((item, index) => (
                            <motion.div
                                key={item.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={cn(
                                        "text-3xl sm:text-4xl md:text-5xl font-black font-syncopate tracking-tighter transition-all uppercase text-center",
                                        isLight ? "text-white hover:text-brand-red" : "text-black hover:text-brand-red"
                                    )}
                                >
                                    {item.label}
                                </Link>
                            </motion.div>
                        ))}
                        <div className="flex items-center space-x-12 pt-10 border-t border-foreground/10 w-full max-w-xs justify-center">
                            <Link 
                                href={isLoggedIn ? "/account" : "/login"} 
                                onClick={() => setIsMobileMenuOpen(false)} 
                                className="text-foreground/70 text-sm font-black uppercase tracking-[0.2em] flex flex-col items-center gap-2"
                            >
                                <User size={24} />
                                <span>{isLoggedIn ? 'Account' : 'Sign In'}</span>
                            </Link>
                            <Link href="/account?tab=wishlist" onClick={() => setIsMobileMenuOpen(false)} className="text-foreground/70 text-sm font-black uppercase tracking-[0.2em] flex flex-col items-center gap-2">
                                <Heart size={24} />
                                <span>Wishlist</span>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
