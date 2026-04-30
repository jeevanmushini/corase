"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ArrowRight, Lock, Mail } from 'lucide-react';
import { signIn } from 'next-auth/react';
import Logo from '@/components/layout/Logo';

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const result = await signIn("credentials", {
                redirect: false,
                email: formData.email,
                password: formData.password,
            });

            if (result?.error) {
                setError("Invalid email or password");
            } else {
                router.push("/account");
                router.refresh();
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = () => {
        signIn('google', { callbackUrl: '/account' });
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-foreground/[0.03] rounded-full blur-[120px] pointer-events-none" />
            
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-[440px] z-10"
            >
                {/* Logo & Header */}
                <div className="flex flex-col items-center mb-12">
                    <Link href="/" className="mb-6">
                        <span className="text-4xl font-black font-syncopate tracking-tight text-brand-red uppercase">CORASE</span>
                    </Link>
                    <h1 className="text-3xl font-bold font-syncopate tracking-tighter text-brand-red mb-2 uppercase italic">
                        Welcome Back
                    </h1>
                    <p className="text-foreground/40 text-sm font-medium tracking-wide">
                        Enter your details to access your account
                    </p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold py-4 px-5 rounded-2xl mb-8 text-center uppercase tracking-widest"
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email Input */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-foreground/20 group-focus-within:text-foreground/60 transition-colors">
                            <Mail size={18} />
                        </div>
                        <input
                            type="email"
                            required
                            placeholder="Email address"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            autoComplete="email"
                            className="w-full bg-foreground/[0.03] border border-foreground/[0.08] text-foreground placeholder-foreground/20 rounded-2xl py-4 pl-14 pr-5 text-sm font-medium focus:outline-none focus:border-foreground/20 focus:bg-foreground/[0.06] transition-all"
                        />
                    </div>

                    {/* Password Input */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-foreground/20 group-focus-within:text-foreground/60 transition-colors">
                            <Lock size={18} />
                        </div>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            placeholder="Password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            autoComplete="current-password"
                            className="w-full bg-foreground/[0.03] border border-foreground/[0.08] text-foreground placeholder-foreground/20 rounded-2xl py-4 pl-14 pr-14 text-sm font-medium focus:outline-none focus:border-foreground/20 focus:bg-foreground/[0.06] transition-all"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-5 flex items-center text-foreground/20 hover:text-foreground transition-colors"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    <div className="flex justify-end pt-1 pb-4">
                        <Link href="/forgot-password" title="Coming soon" className="text-xs font-bold text-foreground/30 hover:text-foreground transition-colors uppercase tracking-widest">
                            Forgot Password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-foreground text-background py-4 rounded-2xl font-black font-syncopate text-xs tracking-[0.2em] uppercase hover:opacity-90 transition-all duration-300 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
                    >
                        {isLoading ? "Signing in..." : (
                            <>
                                Sign In <ArrowRight size={16} />
                            </>
                        )}
                    </button>

                    <div className="relative py-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-foreground/[0.06]"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase tracking-[0.3em]">
                            <span className="bg-background px-4 text-foreground/20 font-bold">Or</span>
                        </div>
                    </div>

                    {/* Google Sign In */}
                    <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        className="w-full bg-transparent border border-foreground/[0.1] text-foreground py-4 rounded-2xl font-bold text-xs tracking-[0.2em] uppercase hover:bg-foreground/[0.05] hover:border-foreground/20 transition-all duration-300 flex items-center justify-center gap-3"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="currentColor"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                            />
                        </svg>
                        Continue with Google
                    </button>
                </form>

                {/* Register link */}
                <p className="text-center text-sm text-foreground/30 font-medium mt-10 tracking-wide">
                    Don&apos;t have an account?{' '}
                    <Link href="/register" className="text-foreground font-bold hover:underline ml-1">
                        Create one
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
