"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Gavel, Scale, AlertCircle, HelpCircle } from 'lucide-react';

const TERMS = [
    {
        title: "Acceptance of Terms",
        content: "By accessing and using Corase, you agree to comply with and be bound by these Terms of Use. If you do not agree to these terms, please do not use our services."
    },
    {
        title: "Intellectual Property",
        content: "All content on this site, including designs, text, and graphics, is the property of Corase. Unauthorized use of our brand assets is strictly prohibited."
    },
    {
        title: "Product Accuracy",
        content: "We strive for absolute accuracy in our product images and descriptions. However, actual colors may vary slightly due to screen settings and lighting."
    },
    {
        title: "Order Fulfillment",
        content: "We reserve the right to refuse or cancel any order for reasons including product availability, errors in pricing, or suspected fraud."
    },
    {
        title: "Returns & Exchanges",
        content: "Our items are often limited-edition drops. Please refer to our Shipping & Returns section for specific policies regarding exchanges."
    }
];

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[#0d0d0d] text-white pt-32 pb-20 px-5 lg:px-10 dark">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-20 text-center">
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-8"
                    >
                        <Scale size={32} className="text-white" />
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-black font-syncopate tracking-tighter uppercase italic brand-glow mb-6 text-brand-red"
                    >
                        Terms &nbsp; Of &nbsp; Use
                    </motion.h1>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Read carefully before entering the archive</p>
                </div>

                {/* Content */}
                <div className="grid gap-10">
                    {TERMS.map((term, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * idx }}
                            className="relative"
                        >
                            <div className="absolute -left-4 md:-left-8 top-0 text-4xl md:text-6xl font-black text-white/[0.03] select-none">
                                0{idx + 1}
                            </div>
                            <div className="pl-6 md:pl-12 border-l-2 border-white/5 hover:border-brand-red/30 transition-all duration-500">
                                <h2 className="text-lg md:text-xl font-black font-syncopate uppercase tracking-tight italic mb-4 text-white">{term.title}</h2>
                                <p className="text-white/60 leading-relaxed text-sm md:text-base font-medium">
                                    {term.content}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Dispute Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-20 p-10 bg-white/5 border border-white/10 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-10"
                >
                    <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-3 text-brand-red">
                            <AlertCircle size={20} />
                            <h3 className="text-xs font-black uppercase tracking-widest">Legal Jurisdiction</h3>
                        </div>
                        <p className="text-sm text-white/60 font-medium">
                            Any disputes arising from these terms will be subject to the exclusive jurisdiction of the courts in Bangalore, Karnataka, India.
                        </p>
                    </div>
                    <button className="whitespace-nowrap bg-foreground text-background px-10 py-4 rounded-2xl font-black text-[10px] tracking-widest uppercase hover:opacity-90 transition-all">
                        Download PDF
                    </button>
                </motion.div>
            </div>
        </div>
    );
}
