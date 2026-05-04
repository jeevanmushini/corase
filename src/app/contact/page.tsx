"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare, Camera, Share2 } from 'lucide-react';

export default function ContactPage() {
    const [formState, setFormState] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        setSubmitted(true);
        setFormState({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div className="min-h-screen bg-[#0d0d0d] text-white pt-32 pb-20 px-5 lg:px-10 dark">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-20">
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-black font-syncopate tracking-tighter uppercase italic brand-glow mb-6 text-brand-red"
                    >
                        Contact &nbsp; Us
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-white/50 max-w-2xl mx-auto font-medium text-sm md:text-base uppercase tracking-widest"
                    >
                        Have a question? We're here to help you dominate your style.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                    {/* Contact Info */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-12"
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all">
                                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                                    <Mail className="text-white" size={24} />
                                </div>
                                <h3 className="text-xs font-black font-syncopate uppercase tracking-widest mb-2">Email Us</h3>
                                <p className="text-sm text-white/60 font-medium break-all">hellocorase@gmail.com</p>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all">
                                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                                    <Phone className="text-white" size={24} />
                                </div>
                                <h3 className="text-xs font-black font-syncopate uppercase tracking-widest mb-2">Call Us</h3>
                                <p className="text-sm text-white/60 font-medium">+91 98765 43210</p>
                            </div>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all">
                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                                <MapPin className="text-white" size={24} />
                            </div>
                            <h3 className="text-xs font-black font-syncopate uppercase tracking-widest mb-2">Our Studio</h3>
                            <p className="text-sm text-white/60 font-medium leading-relaxed">
                                123, Brigade Road, Bangalore,<br />
                                Karnataka, India 560001
                            </p>
                        </div>

                        <div className="flex gap-4">
                            {[
                                { icon: Camera, label: 'Instagram' },
                                { icon: Share2, label: 'Twitter' },
                            ].map((social, i) => (
                                <button key={i} className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-white/10 hover:border-white/30 transition-all text-white/60 hover:text-white">
                                    <social.icon size={20} />
                                </button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden"
                    >
                        {submitted ? (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
                                    <Send className="text-emerald-500" size={32} />
                                </div>
                                <h2 className="text-2xl font-black font-syncopate uppercase italic">Message Sent</h2>
                                <p className="text-white/50 text-sm font-medium max-w-xs">
                                    Thanks for reaching out! Our team will get back to you within 24 hours.
                                </p>
                                <button 
                                    onClick={() => setSubmitted(false)}
                                    className="text-xs font-black text-white underline tracking-widest uppercase hover:text-white/80 transition-colors"
                                >
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Your Name</label>
                                        <input 
                                            required
                                            value={formState.name}
                                            onChange={e => setFormState({...formState, name: e.target.value})}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm font-medium focus:outline-none focus:border-white/30 transition-all"
                                            placeholder="Arjun Mehta"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Email Address</label>
                                        <input 
                                            required
                                            type="email"
                                            value={formState.email}
                                            onChange={e => setFormState({...formState, email: e.target.value})}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm font-medium focus:outline-none focus:border-white/30 transition-all"
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Subject</label>
                                    <input 
                                        required
                                        value={formState.subject}
                                        onChange={e => setFormState({...formState, subject: e.target.value})}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm font-medium focus:outline-none focus:border-white/30 transition-all"
                                        placeholder="How can we help?"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Message</label>
                                    <textarea 
                                        required
                                        rows={5}
                                        value={formState.message}
                                        onChange={e => setFormState({...formState, message: e.target.value})}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm font-medium focus:outline-none focus:border-white/30 transition-all resize-none"
                                        placeholder="Your thoughts..."
                                    />
                                </div>
                                <button 
                                    disabled={isSubmitting}
                                    className="w-full bg-white text-black py-5 rounded-2xl font-black font-syncopate text-xs tracking-[0.3em] uppercase hover:bg-gray-200 transition-all active:scale-95 shadow-xl flex items-center justify-center gap-3"
                                >
                                    {isSubmitting ? 'Sending...' : 'Transmit Message'}
                                    <Send size={16} />
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
