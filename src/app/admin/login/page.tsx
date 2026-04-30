"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Shield, ArrowRight, Lock, Mail } from 'lucide-react';
import Logo from '@/components/layout/Logo';
import Link from 'next/link';

export default function AdminLoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({ email: '', password: '' });
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.push('/admin');
    };

    return (
        <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center px-5 sm:px-6 py-10 relative overflow-hidden">
            {/* Grid background */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
                    backgroundSize: '60px 60px'
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-transparent pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 w-full max-w-md"
            >
                {/* Top bar */}
                <div className="flex items-center justify-between mb-12">
                    <Link href="/" className="flex items-center gap-3">
                        <span className="text-3xl font-black font-syncopate tracking-tight text-brand-red">CORASE</span>
                    </Link>
                    <span className="text-sm font-black text-white border border-white/30 bg-white/10 px-3 py-1.5 rounded-lg tracking-widest uppercase">
                        Admin
                    </span>
                </div>

                {/* Shield */}
                <div className="flex flex-col items-center text-center mb-10">
                    <div className="w-20 h-20 bg-white/10 border border-white/25 rounded-3xl flex items-center justify-center mb-5">
                        <Shield size={36} className="text-white" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black font-syncopate tracking-tight text-brand-red uppercase leading-tight mb-2">
                        Admin Panel
                    </h1>
                    <p className="text-base text-white/40 font-medium">
                        Restricted access. Authorised users only.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-white/60 uppercase tracking-widest">
                            Email
                        </label>
                        <div className="relative">
                            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                            <input
                                type="email"
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                placeholder="admin@corase.com"
                                autoComplete="email"
                                className="w-full bg-white/[0.06] border border-white/[0.1] text-white text-base placeholder-white/20 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-white focus:bg-white/[0.09] transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-white/60 uppercase tracking-widest">
                            Password
                        </label>
                        <div className="relative">
                            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={form.password}
                                onChange={e => setForm({ ...form, password: e.target.value })}
                                placeholder="Enter admin password"
                                autoComplete="current-password"
                                className="w-full bg-white/[0.06] border border-white/[0.1] text-white text-base placeholder-white/20 rounded-2xl pl-12 pr-14 py-4 focus:outline-none focus:border-white focus:bg-white/[0.09] transition-all"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors p-1"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-white text-black py-4 rounded-2xl font-black text-base tracking-wide uppercase flex items-center justify-center gap-3 hover:bg-gray-200 hover:shadow-[0_12px_40px_rgba(255,159,67,0.4)] transition-all duration-300 active:scale-[0.98] mt-3"
                    >
                        <Shield size={20} />
                        Access Dashboard
                        <ArrowRight size={20} />
                    </button>
                </form>

                <p className="text-center text-sm text-white/18 font-medium mt-10">
                    © 2026 <span className="text-brand-red">CORASE</span>. All rights reserved.
                </p>
            </motion.div>
        </div>
    );
}

