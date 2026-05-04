"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, Lock, FileText, ChevronRight } from 'lucide-react';

const SECTIONS = [
    {
        title: "Information Collection",
        icon: Eye,
        content: "We collect information you provide directly to us, such as when you create an account, make a purchase, or sign up for our newsletter. This includes your name, email address, phone number, and delivery details."
    },
    {
        title: "How We Use Your Data",
        icon: FileText,
        content: "Your data is used to process orders, provide customer support, and personalize your experience. We also use it to send you updates about new drops and exclusive offers, which you can opt out of at any time."
    },
    {
        title: "Data Security",
        icon: Lock,
        content: "We implement industry-standard security measures to protect your personal information. All transactions are encrypted, and we do not store sensitive payment data on our servers."
    },
    {
        title: "Third-Party Sharing",
        icon: Shield,
        content: "We do not sell your personal information. We only share data with trusted partners necessary to fulfill your orders, such as shipping carriers and payment processors."
    }
];

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[#0d0d0d] text-white pt-32 pb-20 px-5 lg:px-10 dark">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-20">
                    <motion.h1 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-4xl md:text-6xl font-black font-syncopate tracking-tighter uppercase italic brand-glow mb-6 text-brand-red"
                    >
                        Privacy &nbsp; Policy
                    </motion.h1>
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="flex items-center gap-4 text-white/40 text-[10px] font-black uppercase tracking-widest"
                    >
                        <span>Last Updated: May 2026</span>
                        <div className="w-1.5 h-1.5 bg-brand-red rounded-full animate-pulse" />
                        <span>Version 2.4.0</span>
                    </motion.div>
                </div>

                {/* Content */}
                <div className="space-y-6">
                    {SECTIONS.map((section, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + idx * 0.1 }}
                            className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 hover:border-white/20 transition-all group"
                        >
                            <div className="flex items-start gap-6">
                                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-brand-red/10 group-hover:border-brand-red/30 transition-all">
                                    <section.icon size={22} className="text-white group-hover:text-brand-red transition-colors" />
                                </div>
                                <div className="space-y-4">
                                    <h2 className="text-lg font-black font-syncopate uppercase tracking-tight italic text-white">{section.title}</h2>
                                    <p className="text-white/60 leading-relaxed text-sm md:text-base font-medium">
                                        {section.content}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Footer Note */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-16 p-8 bg-brand-red/5 border border-brand-red/20 rounded-3xl text-center"
                >
                    <p className="text-xs font-bold text-brand-red uppercase tracking-[0.2em] mb-4">Questions about your privacy?</p>
                    <p className="text-sm text-white/70 mb-6 font-medium">Contact our Data Protection Officer at privacy@corase.com</p>
                    <button className="text-[10px] font-black uppercase tracking-widest bg-white text-black px-8 py-3 rounded-full hover:bg-gray-200 transition-all">
                        Request Data Audit
                    </button>
                </motion.div>
            </div>
        </div>
    );
}
