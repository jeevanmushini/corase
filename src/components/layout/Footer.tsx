import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, AtSign, PlayCircle, Share2 } from 'lucide-react';

const LINKS = {
    Shop: [
        { label: 'All Products',   href: '/shop' },
        { label: 'New Arrivals',   href: '/shop?filter=new' },
        { label: 'Oversized Tees', href: '/shop?filter=oversized' },
        { label: 'Graphic Tees',   href: '/shop?filter=graphic' },
        { label: 'Collections',    href: '/collections' },
    ],
    Help: [
        { label: 'Size Guide',     href: '#' },
        { label: 'Shipping Info',  href: '#' },
        { label: 'Easy Returns',   href: '#' },
        { label: 'Track Order',    href: '#' },
        { label: 'Contact Us',     href: '#' },
    ],
    Company: [
        { label: 'About CORASE',   href: '/about' },
        { label: 'Our Story',      href: '/about' },
        { label: 'Privacy Policy', href: '#' },
        { label: 'Terms of Use',   href: '#' },
        { label: 'Careers',        href: '#' },
    ],
};

const SOCIALS = [
    { icon: AtSign,      label: 'Instagram',   href: '#', color: '#E1306C' },
    { icon: Share2,      label: 'X / Twitter', href: '#', color: '#1DA1F2' },
    { icon: PlayCircle,  label: 'YouTube',     href: '#', color: '#FF0000' },
];

const Footer: React.FC = () => {
    return (
        <footer className="bg-background text-foreground border-t border-foreground/[0.06]">

            {/* Main grid */}
            <div className="max-w-7xl mx-auto px-6 lg:px-16 pt-24 pb-16">
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-y-16 gap-x-10 mb-20">

                    {/* Brand column — spans 2 */}
                    <div className="col-span-2">
                        <Link href="/" className="flex items-center gap-4 mb-8">
                            <div>
                                <span className="text-3xl font-black font-syncopate tracking-tight text-brand-red block leading-none">CORASE</span>
                                <span className="text-xs text-foreground/50 font-bold tracking-widest uppercase">DRIP, DETAIL, DOMINANCE</span>
                            </div>
                        </Link>

                        <p className="text-foreground/70 text-base font-medium leading-relaxed max-w-[300px] mb-10">
                            DRIP, DETAIL, DOMINANCE for the bold and the restless. Limited drops, archive quality, and zero compromises.
                        </p>

                        {/* Contact */}
                        <div className="space-y-4 mb-10">
                            <a href="mailto:hellocorase@gmail.com" className="flex items-center gap-3 text-foreground/70 hover:text-foreground transition-colors group">
                                <div className="w-9 h-9 bg-foreground/[0.05] rounded-xl flex items-center justify-center group-hover:bg-foreground/10 transition-colors">
                                    <Mail size={16} className="text-foreground/60 group-hover:text-foreground transition-colors" />
                                </div>
                                <span className="text-sm font-medium">hellocorase@gmail.com</span>
                            </a>
                            <div className="flex items-center gap-3 text-foreground/60">
                                <div className="w-9 h-9 bg-foreground/[0.05] rounded-xl flex items-center justify-center">
                                    <Phone size={16} className="text-foreground/60" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium">+91 99597 35776</span>
                                    <span className="text-sm font-medium">+91 90635 73124</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-foreground/60">
                                <div className="w-9 h-9 bg-foreground/[0.05] rounded-xl flex items-center justify-center">
                                    <MapPin size={16} className="text-foreground/60" />
                                </div>
                                <span className="text-sm font-medium">Rajamundry, Andhra Pradesh, India 🇮🇳</span>
                            </div>
                        </div>

                        {/* Socials */}
                        <div className="flex items-center gap-3">
                            {SOCIALS.map(({ icon: Icon, label, href, color }) => (
                                <a
                                    key={label}
                                    href={href}
                                    title={label}
                                    className="w-11 h-11 bg-foreground/[0.05] border border-foreground/[0.08] rounded-2xl flex items-center justify-center text-foreground/40 hover:text-foreground hover:border-foreground/20 transition-all duration-300 hover:scale-110"
                                >
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link columns */}
                    {Object.entries(LINKS).map(([section, links]) => (
                        <div key={section}>
                            <p className="text-xs font-black text-foreground/50 uppercase tracking-[0.4em] mb-8">{section}</p>
                            <ul className="space-y-5">
                                {links.map(link => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-sm font-medium text-foreground/70 hover:text-foreground hover:pl-2 transition-all duration-200"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Newsletter */}
                <div className="bg-foreground/[0.04] border border-foreground/[0.07] rounded-[14px] p-10 md:p-12 mb-16 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red/5 blur-3xl group-hover:bg-brand-red/10 transition-all duration-700" />
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative z-10">
                        <div className="flex-1 space-y-2">
                            <h3 className="text-2xl font-black font-syncopate text-foreground uppercase tracking-tight">
                                Stay in the Loop
                            </h3>
                            <p className="text-foreground/70 text-base font-medium">
                                Get first access to new drops, exclusive discounts, and archive restocks.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-2 sm:gap-0">
                            <input
                                type="email"
                                placeholder="your@email.com"
                                className="flex-1 md:w-72 bg-foreground/[0.06] border border-foreground/[0.1] sm:border-r-0 text-foreground placeholder-foreground/25 rounded-[14px] sm:rounded-r-none px-5 py-4 text-base font-medium focus:outline-none focus:border-brand-red/40 transition-all"
                            />
                            <button className="bg-foreground text-background px-7 py-4 rounded-[14px] sm:rounded-l-none font-black text-sm tracking-[0.2em] uppercase hover:bg-brand-red hover:text-white transition-all duration-500 whitespace-nowrap">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                {/* Payment icons row */}
                <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
                    {['UPI', 'Visa', 'Mastercard', 'RuPay', 'Paytm', 'GPay'].map(p => (
                        <div key={p} className="bg-foreground/[0.03] border border-foreground/[0.07] rounded-lg px-4 py-2 hover:border-foreground/20 transition-all cursor-default">
                            <span className="text-[10px] font-black tracking-widest text-foreground/30 uppercase">{p}</span>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t border-foreground/[0.06] pt-8">
                    <p className="text-foreground/40 text-xs font-black tracking-widest uppercase">
                        © 2026 CORASE. All rights reserved.
                    </p>
                    <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-6 gap-y-2">
                        <Link href="#" className="text-foreground/40 text-xs font-black tracking-widest uppercase hover:text-brand-red transition-colors">Privacy</Link>
                        <Link href="#" className="text-foreground/40 text-xs font-black tracking-widest uppercase hover:text-brand-red transition-colors">Terms</Link>
                        <Link href="#" className="text-foreground/40 text-xs font-black tracking-widest uppercase hover:text-brand-red transition-colors">Cookies</Link>
                        <span className="text-foreground/20 text-xs font-black tracking-widest uppercase hidden sm:inline italic">Made with obsession in India 🇮🇳</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
