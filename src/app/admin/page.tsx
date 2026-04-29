"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
    LayoutDashboard, Package, ShoppingCart, Users,
    TrendingUp, ArrowUpRight, AlertTriangle, Star,
    LogOut, ChevronRight, Eye, Menu, X, Save, Edit2, Trash2, Plus, 
    Image as ImageIcon, Settings as SettingsIcon, Search, Filter, ArrowDown, ArrowUp, BarChart3,
    Truck, MapPin, CreditCard, ExternalLink, Calendar, Printer, Ticket, Heart
} from 'lucide-react';
import Logo from '@/components/layout/Logo';
import AdminProductModal from '@/components/admin/ProductModal';
import ImageUpload from '@/components/admin/ImageUpload';
import AdminCouponModal from '@/components/admin/CouponModal';

const NAV = [
    { icon: LayoutDashboard, label: 'Overview',  tab: 'overview'  },
    { icon: Package,         label: 'Inventory', tab: 'inventory' },
    { icon: ShoppingCart,    label: 'Orders',    tab: 'orders'    },
    { icon: Ticket,          label: 'Coupons',   tab: 'coupons'   },
    { icon: SettingsIcon,    label: 'System',    tab: 'settings'  },
    { icon: Users,           label: 'Customers', tab: 'customers' },
] as const;
type Tab = typeof NAV[number]['tab'];

export default function AdminDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [tab, setTab] = useState<Tab>('overview');
    const [open, setOpen] = useState(false);
    
    const [products, setProducts] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [settings, setSettings] = useState<any>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [coupons, setCoupons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [editingCoupon, setEditingCoupon] = useState<any>(null);
    const [viewingOrder, setViewingOrder] = useState<any>(null);
    const [fulfillment, setFulfillment] = useState({ carrier: '', tracking: '' });
    const [isSaving, setIsSaving] = useState(false);
    const [isAddingProduct, setIsAddingProduct] = useState(false);
    const [isAddingCoupon, setIsAddingCoupon] = useState(false);
    const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
    const [deletingCouponId, setDeletingCouponId] = useState<string | null>(null);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (status === "authenticated" && (session?.user as any)?.role !== "admin") {
            router.push("/");
        }
    }, [status, session, router]);

    useEffect(() => {
        if (viewingOrder) {
            setFulfillment({
                carrier: viewingOrder.carrier || '',
                tracking: viewingOrder.trackingNumber || ''
            });
        }
    }, [viewingOrder]);

    useEffect(() => {
        const fetchData = async () => {
            if (status !== "authenticated" || (session?.user as any)?.role !== "admin") return;
            
            try {
                const [pRes, oRes, sRes, uRes, cRes] = await Promise.all([
                    fetch("/api/products"),
                    fetch("/api/admin/orders"),
                    fetch("/api/admin/settings"),
                    fetch("/api/admin/users"),
                    fetch("/api/admin/coupons")
                ]);
                
                const pData = await pRes.json();
                const oData = await oRes.json();
                const sData = await sRes.json();
                const uData = await uRes.json();
                const cData = await cRes.json();
                
                setProducts(pData);
                setOrders(oData);
                setSettings(sData);
                setUsers(uData);
                setCoupons(cData);
            } catch (error) {
                console.error("Error fetching admin data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [status, session]);

    const updateOrderStatus = async (orderId: string, updates: any) => {
        setIsSaving(true);
        try {
            console.log(`[CLIENT] Sending update for ${orderId}:`, updates);
            const res = await fetch(`/api/admin/orders/${orderId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updates),
            });
            if (res.ok) {
                const updatedOrder = await res.json();
                console.log(`[ADMIN API] Order ${orderId} updated successfully`);
                setOrders(prev => prev.map(o => o._id === orderId ? updatedOrder : o));
                if (viewingOrder?._id === orderId) setViewingOrder(updatedOrder);
            }
        } catch (error) {
            console.error("Error updating order:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveProduct = async (productData: any) => {
        setIsSaving(true);
        try {
            const isEdit = !!editingProduct;
            const url = isEdit ? `/api/admin/products/${editingProduct.id}` : '/api/admin/products';
            const method = isEdit ? 'PATCH' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });

            if (res.ok) {
                const savedProduct = await res.json();
                // Map DB fields to frontend fields if necessary (like in GET /api/products)
                const mappedProduct = {
                    ...savedProduct,
                    id: savedProduct.id,
                    name: savedProduct.title,
                    price: savedProduct.price,
                    description: savedProduct.description,
                    image: savedProduct.images[0],
                    variants: savedProduct.variants,
                    isNewDrop: savedProduct.isNewDrop,
                    isFeatured: savedProduct.isFeatured,
                    category: savedProduct.category || productData.category
                };

                if (isEdit) {
                    setProducts(prev => prev.map(p => p.id === editingProduct.id ? mappedProduct : p));
                } else {
                    setProducts(prev => [mappedProduct, ...prev]);
                }
                setEditingProduct(null);
                setIsAddingProduct(false);
            } else {
                const err = await res.json();
                alert(err.error || "Failed to save product");
            }
        } catch (error) {
            console.error("Error saving product:", error);
            alert("Error saving product");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteProduct = async (id: string) => {
        setIsSaving(true);
        try {
            const res = await fetch(`/api/admin/products/${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                setProducts(prev => prev.filter(p => p.id !== id));
                setDeletingProductId(null);
            } else {
                const err = await res.json();
                alert(err.error || "Failed to delete product");
            }
        } catch (error) {
            console.error("Error deleting product:", error);
            alert("Error deleting product");
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveCoupon = async (couponData: any) => {
        setIsSaving(true);
        try {
            const isEdit = !!editingCoupon;
            const url = isEdit ? `/api/admin/coupons/${editingCoupon._id}` : '/api/admin/coupons';
            const method = isEdit ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(couponData)
            });

            if (res.ok) {
                const savedCoupon = await res.json();
                if (isEdit) {
                    setCoupons(prev => prev.map(c => c._id === editingCoupon._id ? savedCoupon : c));
                } else {
                    setCoupons(prev => [savedCoupon, ...prev]);
                }
                setEditingCoupon(null);
                setIsAddingCoupon(false);
            } else {
                const err = await res.json();
                alert(err.error || "Failed to save coupon");
            }
        } catch (error) {
            console.error("Error saving coupon:", error);
            alert("Error saving coupon");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteCoupon = async (id: string) => {
        setIsSaving(true);
        try {
            const res = await fetch(`/api/admin/coupons/${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                setCoupons(prev => prev.filter(c => c._id !== id));
                setDeletingCouponId(null);
            } else {
                const err = await res.json();
                alert(err.error || "Failed to delete coupon");
            }
        } catch (error) {
            console.error("Error deleting coupon:", error);
            alert("Error deleting coupon");
        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        setSearchTerm('');
    }, [tab]);

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-2 border-foreground/20 border-t-white rounded-full animate-spin" />
                    <div className="text-foreground font-syncopate text-xs tracking-[0.3em] animate-pulse uppercase">Initializing Core</div>
                </div>
            </div>
        );
    }

    const totalRevenue = orders.reduce((acc, o) => acc + o.totalPrice, 0);
    const lowStockProducts = products.filter(p => p.variants?.some((v: any) => v.stock < 10));
    const totalItemsSold = orders.reduce((acc, o) => acc + o.items?.reduce((iAcc: number, item: any) => iAcc + item.quantity, 0), 0);

    const filteredProducts = products.filter(p => 
        (p.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
        (p.category?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    const Sidebar = () => (
        <aside className={`
            fixed top-0 left-0 h-full w-72
            bg-background border-r border-foreground/10
            flex flex-col z-40
            transition-transform duration-300 ease-out
            ${open ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0
        `}>
            <div className="p-8 border-b border-foreground/5">
                <div className="flex items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-black font-syncopate text-brand-red tracking-tight leading-none uppercase">Corase</h2>
                        <span className="text-[10px] font-bold text-foreground/90 uppercase tracking-[0.2em] mt-1 block">Control Center</span>
                    </div>
                </div>
            </div>

            <nav className="flex-1 p-6 space-y-2">
                {NAV.map(({ icon: Icon, label, tab: t }) => (
                    <button
                        key={t}
                        onClick={() => { setTab(t); setOpen(false); }}
                        className={`
                            w-full flex items-center gap-4 px-5 py-4 rounded-xl
                            text-sm font-bold tracking-wider uppercase transition-all
                            ${tab === t
                                ? 'bg-foreground text-background shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                                : 'text-foreground/60 hover:text-foreground hover:bg-foreground/5'
                            }
                        `}
                    >
                        <Icon size={18} />
                        {label}
                    </button>
                ))}
            </nav>

            <div className="p-6 border-t border-foreground/5 space-y-2">
                <Link href="/" className="flex items-center gap-4 px-5 py-3 rounded-xl text-xs font-bold text-foreground/60 hover:text-foreground hover:bg-foreground/5 uppercase tracking-widest transition-all">
                    <Eye size={16} /> Live Site
                </Link>
                <button onClick={() => signOut()} className="w-full flex items-center gap-4 px-5 py-3 rounded-xl text-xs font-bold text-red-500/60 hover:text-red-400 hover:bg-red-500/5 uppercase tracking-widest transition-all">
                    <LogOut size={16} /> Sign Out
                </button>
            </div>
        </aside>
    );

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Sidebar />

            <div className="lg:ml-72 min-h-screen flex flex-col">
                <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-foreground/5 px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button className="lg:hidden" onClick={() => setOpen(true)}><Menu size={24} /></button>
                            <h1 className="text-brand-red text-xl font-black font-syncopate uppercase tracking-tighter">
                                {NAV.find(n => n.tab === tab)?.label}
                            </h1>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="hidden md:flex flex-col items-end">
                                <span className="text-xs font-black text-foreground uppercase">{session?.user?.name}</span>
                                <span className="text-[10px] font-bold text-foreground/90 uppercase tracking-widest">Administrator</span>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-foreground/10 border border-foreground/20 flex items-center justify-center font-bold text-sm uppercase">
                                {session?.user?.name?.[0]}
                            </div>
                        </div>
                    </div>
                </header>

                <main className="p-8 space-y-8">
                    {tab === 'overview' && (
                        <div className="space-y-8">
                            {/* Summary Grid */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                                {[
                                    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-400' },
                                    { label: 'Total Orders', value: orders.length, icon: ShoppingCart, color: 'text-indigo-400' },
                                    { label: 'Items Sold', value: totalItemsSold, icon: BarChart3, color: 'text-amber-400' },
                                    { label: 'Customers', value: users.length, icon: Users, color: 'text-brand-red' },
                                ].map((stat, i) => (
                                    <motion.div
                                        key={stat.label}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="bg-foreground/5 border border-foreground/10 p-6 rounded-2xl hover:border-foreground/20 transition-all group"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="p-3 bg-foreground/5 rounded-xl group-hover:scale-110 transition-transform">
                                                <stat.icon size={20} className={stat.color} />
                                            </div>
                                            <span className="text-[10px] font-black text-foreground/20 uppercase tracking-widest">+12%</span>
                                        </div>
                                        <p className="text-2xl font-black text-foreground tracking-tight">{stat.value}</p>
                                        <p className="text-xs font-bold text-foreground uppercase tracking-widest mt-1">{stat.label}</p>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Low Stock Alert */}
                                <div className="lg:col-span-1 bg-foreground/5 border border-foreground/10 rounded-2xl p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-sm font-black font-syncopate uppercase">Stock Alerts</h3>
                                        <AlertTriangle size={16} className="text-red-500" />
                                    </div>
                                    <div className="space-y-4">
                                        {lowStockProducts.slice(0, 5).map(p => (
                                            <div key={p.id} className="flex items-center gap-4 p-3 rounded-xl bg-foreground/[0.03] border border-foreground/5">
                                                <div className="w-10 h-12 rounded bg-foreground/5 overflow-hidden flex-shrink-0">
                                                    <img src={p.image} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-bold text-foreground truncate uppercase">{p.name}</p>
                                                    <p className="text-[10px] text-red-400 font-bold uppercase mt-0.5">
                                                        {p.variants.find((v: any) => v.stock < 10)?.stock} in stock
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Top Customers */}
                                <div className="lg:col-span-1 bg-foreground/5 border border-foreground/10 rounded-2xl p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-sm font-black font-syncopate uppercase">Top Customers</h3>
                                        <Users size={16} className="text-brand-red" />
                                    </div>
                                    <div className="space-y-4">
                                        {users
                                            .map(u => ({
                                                ...u,
                                                totalSpent: orders
                                                    .filter(o => (o.user === u._id || o.user?._id === u._id) && o.isPaid)
                                                    .reduce((acc, o) => acc + o.totalPrice, 0)
                                            }))
                                            .sort((a, b) => b.totalSpent - a.totalSpent)
                                            .slice(0, 3)
                                            .map(u => (
                                                <div key={u._id} className="flex items-center gap-4 p-3 rounded-xl bg-foreground/[0.03] border border-foreground/5">
                                                    <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center text-xs font-black text-foreground/40">
                                                        {u.name?.[0]}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-bold text-foreground truncate uppercase">{u.name}</p>
                                                        <p className="text-[10px] text-emerald-400 font-bold uppercase mt-0.5">
                                                            ₹{u.totalSpent.toLocaleString()} spent
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>

                                {/* Most Liked Products */}
                                <div className="lg:col-span-1 bg-foreground/5 border border-foreground/10 rounded-2xl p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-sm font-black font-syncopate uppercase">Most Liked</h3>
                                        <Heart size={16} className="text-red-500" fill="currentColor" />
                                    </div>
                                    <div className="space-y-4">
                                        {products
                                            .map(p => ({
                                                ...p,
                                                likes: users.reduce((acc, u) => {
                                                    const isLiked = u.wishlist?.some((item: any) => 
                                                        item.productId === p.id || 
                                                        item.id === p.id || 
                                                        item._id === p.id
                                                    );
                                                    return acc + (isLiked ? 1 : 0);
                                                }, 0)
                                            }))
                                            .sort((a, b) => b.likes - a.likes)
                                            .filter(p => p.likes > 0)
                                            .slice(0, 3)
                                            .map(p => (
                                                <div key={p.id} className="flex items-center gap-4 p-3 rounded-xl bg-foreground/[0.03] border border-foreground/5">
                                                    <div className="w-10 h-12 rounded bg-foreground/5 overflow-hidden flex-shrink-0">
                                                        <img src={p.image} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-bold text-foreground truncate uppercase">{p.name}</p>
                                                        <div className="flex items-center gap-1.5 mt-0.5">
                                                            <Heart size={10} className="text-red-500" fill="currentColor" />
                                                            <p className="text-[10px] text-foreground/60 font-black uppercase">
                                                                {p.likes} Likes
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                        {users.length > 0 && !products.some(p => users.some(u => u.wishlist?.some((w: any) => w.productId === p.id))) && (
                                            <p className="text-center py-8 text-foreground/20 text-xs font-bold uppercase tracking-widest">No likes yet</p>
                                        )}
                                    </div>
                                </div>

                                {/* Recent Activity */}
                                <div className="lg:col-span-3 bg-foreground/5 border border-foreground/10 rounded-2xl overflow-hidden">
                                    <div className="px-8 py-6 border-b border-foreground/5 flex items-center justify-between">
                                        <h3 className="text-sm font-black font-syncopate uppercase">Recent Activity</h3>
                                        <button className="text-[10px] font-black text-foreground/60 uppercase tracking-widest hover:text-foreground transition-colors">View All</button>
                                    </div>
                                    <div className="p-0">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-foreground/5">
                                                    {['Transaction', 'Status', 'Amount', 'Time'].map(h => (
                                                        <th key={h} className="text-left px-8 py-4 text-[10px] font-black text-foreground/60 uppercase tracking-[0.2em]">{h}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {orders.slice(0, 5).map(o => (
                                                    <tr key={o._id} className="border-b border-foreground/5 hover:bg-foreground/[0.02] transition-colors">
                                                        <td className="px-8 py-4">
                                                            <div className="flex flex-col">
                                                                <span className="text-xs font-bold text-foreground uppercase">#{o._id.slice(-6)}</span>
                                                                <span className="text-[10px] text-foreground/60 uppercase">{o.shippingAddress?.fullName}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-4">
                                                            <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                                                                o.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                                                            }`}>
                                                                {o.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-8 py-4 text-xs font-bold text-foreground">₹{o.totalPrice}</td>
                                                        <td className="px-8 py-4 text-[10px] text-foreground/60 uppercase font-bold">{new Date(o.createdAt).toLocaleDateString()}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {tab === 'inventory' && (
                        <div className="space-y-6">
                            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-foreground/5 border border-foreground/10 p-6 rounded-2xl">
                                <div className="relative w-full md:w-96">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30" size={16} />
                                    <input 
                                        type="text" 
                                        placeholder="SEARCH INVENTORY..." 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full bg-foreground/5 border border-foreground/10 rounded-xl pl-12 pr-4 py-3 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-foreground/30 transition-all"
                                    />
                                </div>
                                <div className="flex items-center gap-4 w-full md:w-auto">
                                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-foreground/5 border border-foreground/10 rounded-xl px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-foreground/10 transition-all">
                                        <Filter size={14} /> Filter
                                    </button>
                                    <button 
                                        onClick={() => setIsAddingProduct(true)}
                                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-foreground text-background rounded-xl px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-foreground/90 transition-all"
                                    >
                                        <Plus size={14} /> New Product
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                                {filteredProducts.map(p => {
                                    const stock = p.variants?.reduce((acc: number, v: any) => acc + v.stock, 0) || 0;
                                    return (
                                        <motion.div 
                                            key={p.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="bg-foreground/5 border border-foreground/10 rounded-2xl overflow-hidden group hover:border-foreground/30 transition-all"
                                        >
                                            <div className="aspect-[4/5] relative overflow-hidden">
                                                <img src={p.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                <div className="absolute top-4 right-4 flex gap-2">
                                                    <span className="bg-background/60 backdrop-blur-md text-[11px] font-black text-foreground uppercase tracking-widest px-5 py-2.5 rounded-full border border-foreground/10 shadow-xl">
                                                        ₹{p.price}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="p-5 space-y-4">
                                                <div>
                                                    <h3 className="text-sm font-semibold font-sans text-foreground tracking-normal truncate">{p.name}</h3>
                                                    <p className="text-[10px] text-foreground/90 font-bold uppercase tracking-widest mt-1">{p.category}</p>
                                                </div>
                                                
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-foreground/60">
                                                        <span>Size / Stock</span>
                                                        <span className={stock < 20 ? 'text-red-400' : 'text-emerald-400'}>{stock} TOTAL</span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {p.variants?.map((v: any) => (
                                                            <div key={v.size} className={`px-2.5 py-1.5 rounded text-[10px] font-black uppercase border ${v.stock < 5 ? 'border-red-500/30 bg-red-500/5 text-red-400' : 'border-foreground/20 bg-foreground/5 text-foreground/90'}`}>
                                                                {v.size}: {v.stock}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="flex gap-2 pt-2">
                                                    <button 
                                                        onClick={() => setEditingProduct(p)}
                                                        className="flex-1 flex items-center justify-center gap-2 bg-foreground text-background py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all hover:bg-gray-200"
                                                    >
                                                        <Edit2 size={12} /> Edit
                                                    </button>
                                                    <button 
                                                        onClick={() => setDeletingProductId(p.id)}
                                                        className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-foreground transition-all"
                                                    >
                                                        <Trash2 size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {tab === 'orders' && (
                        <div className="space-y-6">
                            <div className="bg-foreground/5 border border-foreground/10 p-6 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
                                <div className="relative w-full md:w-96">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30" size={16} />
                                    <input 
                                        type="text" 
                                        placeholder="SEARCH ORDERS..." 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full bg-foreground/5 border border-foreground/10 rounded-xl pl-12 pr-4 py-3 text-sm font-bold uppercase tracking-widest focus:outline-none focus:border-foreground/30 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="bg-foreground/5 border border-foreground/10 rounded-2xl overflow-hidden">
                                <div className="px-8 py-6 border-b border-foreground/5 flex items-center justify-between">
                                    <h3 className="text-sm font-black font-syncopate uppercase">Order History</h3>
                                </div>
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[800px]">
                                    <thead>
                                        <tr className="border-b border-foreground/5">
                                            {['Order', 'Customer', 'Items', 'Revenue', 'Status', 'Date'].map(h => (
                                                <th key={h} className="text-left px-8 py-5 text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em]">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {orders.filter(o => {
                                            const searchLower = searchTerm.toLowerCase();
                                            const orderId = String(o._id).toLowerCase();
                                            const rzpId = o.razorpayOrderId?.toLowerCase() || '';
                                            const customerName = o.shippingAddress?.fullName?.toLowerCase() || '';
                                            const customerEmail = o.shippingAddress?.email?.toLowerCase() || '';
                                            const productNames = o.items?.map((i: any) => i.name.toLowerCase()).join(' ') || '';
                                            const status = o.status?.toLowerCase() || '';
                                            const tracking = o.trackingNumber?.toLowerCase() || '';
                                            
                                            return orderId.includes(searchLower) || 
                                                   rzpId.includes(searchLower) || 
                                                   customerName.includes(searchLower) || 
                                                   customerEmail.includes(searchLower) ||
                                                   productNames.includes(searchLower) ||
                                                   status.includes(searchLower) ||
                                                   tracking.includes(searchLower);
                                        }).map(o => (
                                            <tr 
                                                key={o._id} 
                                                onClick={() => setViewingOrder(o)}
                                                className="hover:bg-foreground/[0.02] transition-colors group cursor-pointer"
                                            >
                                                <td className="px-8 py-5 text-xs font-black text-foreground flex items-center gap-2">
                                                    #{o._id.slice(-8)}
                                                    <ExternalLink size={10} className="opacity-0 group-hover:opacity-40 transition-opacity" />
                                                </td>
                                                <td className="px-8 py-5">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold text-foreground uppercase">{o.shippingAddress?.fullName}</span>
                                                        <span className="text-[10px] text-foreground/35 uppercase truncate max-w-[150px]">{o.shippingAddress?.email}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <div className="flex -space-x-3">
                                                        {o.items?.slice(0, 3).map((item: any, idx: number) => (
                                                            <div key={idx} className="w-8 h-10 rounded border border-background bg-[#111] overflow-hidden">
                                                                <img src={item.image} className="w-full h-full object-cover" />
                                                            </div>
                                                        ))}
                                                        {o.items?.length > 3 && (
                                                            <div className="w-8 h-10 rounded border border-background bg-foreground/10 flex items-center justify-center text-[10px] font-black text-foreground">
                                                                +{o.items.length - 3}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5 text-xs font-black text-foreground">₹{o.totalPrice}</td>
                                                <td className="px-8 py-5">
                                                    <select 
                                                        value={o.status}
                                                        onClick={(e) => e.stopPropagation()}
                                                        onChange={(e) => updateOrderStatus(o._id, { status: e.target.value })}
                                                        className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded border border-foreground/10 bg-background text-foreground focus:outline-none focus:border-foreground/40 cursor-pointer ${
                                                            o.status === 'Delivered' ? 'text-emerald-400' : 'text-amber-400'
                                                        }`}
                                                    >
                                                        {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
                                                            <option key={s} value={s}>{s}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className="px-8 py-5 text-[10px] font-bold text-foreground/60 uppercase">{new Date(o.createdAt).toLocaleDateString('en-GB')}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
                
                    {tab === 'customers' && (
                        <div className="space-y-6">
                            <div className="bg-foreground/5 border border-foreground/10 p-6 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
                                <div className="relative w-full md:w-96">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30" size={16} />
                                    <input 
                                        type="text" 
                                        placeholder="SEARCH CUSTOMERS..." 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full bg-foreground/5 border border-foreground/10 rounded-xl pl-12 pr-4 py-3 text-sm font-bold uppercase tracking-widest focus:outline-none focus:border-foreground/30 transition-all"
                                    />
                                </div>
                            </div>
                            
                            <div className="bg-foreground/5 border border-foreground/10 rounded-2xl overflow-hidden">
                                <div className="px-8 py-6 border-b border-foreground/5 flex items-center justify-between">
                                    <h3 className="text-sm font-black font-syncopate uppercase">Customers List</h3>
                                </div>
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[800px]">
                                    <thead>
                                        <tr className="border-b border-foreground/5">
                                            {['Customer', 'Email', 'Orders', 'Total Spent', 'Wishlist', 'Joined'].map(h => (
                                                <th key={h} className="text-left px-8 py-5 text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em]">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-foreground/5">
                                        {users.filter(u => 
                                            (u.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
                                            (u.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
                                        ).map(u => {
                                            const userOrders = orders.filter(o => (o.user === u._id || o.user?._id === u._id) && o.isPaid);
                                            const totalSpent = userOrders.reduce((acc, o) => acc + o.totalPrice, 0);
                                            
                                            return (
                                                <tr key={u._id} className="hover:bg-foreground/[0.02] transition-colors group cursor-pointer">
                                                    <td className="px-8 py-5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center text-[10px] font-black text-foreground/40">
                                                                {u.name?.[0]}
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-xs font-bold text-foreground uppercase">{u.name}</span>
                                                                <span className={`text-[8px] font-black uppercase tracking-widest mt-0.5 ${u.role === 'admin' ? 'text-purple-400' : 'text-blue-400'}`}>{u.role}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-5 text-[10px] text-foreground/60 uppercase">{u.email}</td>
                                                    <td className="px-8 py-5 text-xs font-black text-foreground">{userOrders.length}</td>
                                                    <td className="px-8 py-5 text-xs font-black text-emerald-400">₹{totalSpent.toLocaleString()}</td>
                                                    <td className="px-8 py-5 text-xs font-black text-foreground">
                                                    <div className="flex -space-x-2">
                                                        {u.wishlist?.slice(0, 3).map((item: any, idx: number) => (
                                                            <div key={idx} className="w-8 h-10 rounded border border-background bg-[#111] overflow-hidden" title={item.name}>
                                                                <img src={item.image} className="w-full h-full object-cover" />
                                                            </div>
                                                        ))}
                                                        {u.wishlist?.length > 3 && (
                                                            <div className="w-8 h-10 rounded border border-background bg-foreground/10 flex items-center justify-center text-[10px] font-black text-foreground">
                                                                +{u.wishlist.length - 3}
                                                            </div>
                                                        )}
                                                        {(!u.wishlist || u.wishlist.length === 0) && <span className="text-foreground/30 font-bold uppercase tracking-widest text-[10px]">Empty</span>}
                                                    </div>
                                                </td>
                                            <td className="px-8 py-5 text-[10px] text-foreground/60 font-bold uppercase">{new Date(u.createdAt).toLocaleDateString('en-GB')}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                            </div>
                        </div>
                    </div>
                )}

                    {tab === 'coupons' && (
                        <div className="space-y-6">
                            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-foreground/5 border border-foreground/10 p-6 rounded-2xl">
                                <div className="relative w-full md:w-96">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30" size={16} />
                                    <input 
                                        type="text" 
                                        placeholder="SEARCH COUPONS..." 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full bg-foreground/5 border border-foreground/10 rounded-xl pl-12 pr-4 py-3 text-sm font-bold uppercase tracking-widest focus:outline-none focus:border-foreground/30 transition-all"
                                    />
                                </div>
                                <button 
                                    onClick={() => setIsAddingCoupon(true)}
                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-foreground text-background rounded-xl px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-foreground/90 transition-all"
                                >
                                    <Plus size={14} /> New Coupon
                                </button>
                            </div>

                            <div className="bg-foreground/5 border border-foreground/10 rounded-2xl overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[800px]">
                                        <thead>
                                            <tr className="border-b border-foreground/5">
                                                {['Code', 'Discount', 'Type', 'Min Amount', 'Status', 'Used', 'Actions'].map(h => (
                                                    <th key={h} className="text-left px-8 py-5 text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em]">{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-foreground/5">
                                            {coupons.filter(c => (c.code?.toLowerCase() || '').includes(searchTerm.toLowerCase())).map(c => (
                                                <tr key={c._id} className="hover:bg-foreground/[0.02] transition-colors group">
                                                    <td className="px-8 py-5 text-xs font-black text-foreground uppercase">{c.code}</td>
                                                    <td className="px-8 py-5 text-xs font-bold text-foreground">
                                                        {c.discountType === 'percentage' ? `${c.discountValue}%` : `₹${c.discountValue}`}
                                                    </td>
                                                    <td className="px-8 py-5 text-[10px] font-bold text-foreground/60 uppercase">{c.discountType}</td>
                                                    <td className="px-8 py-5 text-xs font-bold text-foreground">₹{c.minOrderAmount}</td>
                                                    <td className="px-8 py-5">
                                                        <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                                                            c.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                                                        }`}>
                                                            {c.isActive ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-5 text-xs font-bold text-foreground">
                                                        {c.usedCount} {c.usageLimit ? `/ ${c.usageLimit}` : ''}
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <div className="flex gap-2">
                                                            <button 
                                                                onClick={() => setEditingCoupon(c)}
                                                                className="p-2 rounded-lg bg-foreground/5 text-foreground/60 hover:text-foreground transition-all"
                                                            >
                                                                <Edit2 size={12} />
                                                            </button>
                                                            <button 
                                                                onClick={() => setDeletingCouponId(c._id)}
                                                                className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                                                            >
                                                                <Trash2 size={12} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            {coupons.length === 0 && (
                                                <tr>
                                                    <td colSpan={7} className="px-8 py-12 text-center text-xs font-bold text-foreground/30 uppercase tracking-widest">
                                                        No coupons found
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {tab === 'settings' && (
                        <div className="space-y-8">
                            {/* Hero Customization */}
                            <div className="bg-foreground/5 border border-foreground/10 rounded-2xl overflow-hidden">
                                <div className="px-8 py-6 border-b border-foreground/5 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-foreground/5 rounded-xl">
                                            <ImageIcon size={16} className="text-foreground/60" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-black font-syncopate uppercase">Hero Section</h3>
                                            <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest mt-0.5">Customize your homepage hero</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Hero Title</label>
                                            <input
                                                type="text"
                                                value={settings?.heroTitle || ''}
                                                onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                                                className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:outline-none focus:border-foreground/30 transition-all"
                                                placeholder="The New Standard"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Subtitle / Tagline</label>
                                            <input
                                                type="text"
                                                value={settings?.heroSubtitle || ''}
                                                onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                                                className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:outline-none focus:border-foreground/30 transition-all"
                                                placeholder="DRIP, DETAIL, DOMINANCE"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Overlay Text (Red, on image)</label>
                                            <input
                                                type="text"
                                                value={settings?.heroOverlayText || ''}
                                                onChange={(e) => setSettings({ ...settings, heroOverlayText: e.target.value })}
                                                className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:outline-none focus:border-foreground/30 transition-all"
                                                placeholder="CORASE"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Button Text</label>
                                                <input
                                                    type="text"
                                                    value={settings?.heroButtonText || ''}
                                                    onChange={(e) => setSettings({ ...settings, heroButtonText: e.target.value })}
                                                    className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:outline-none focus:border-foreground/30 transition-all"
                                                    placeholder="Explore Collection"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Button Link</label>
                                                <input
                                                    type="text"
                                                    value={settings?.heroButtonLink || ''}
                                                    onChange={(e) => setSettings({ ...settings, heroButtonLink: e.target.value })}
                                                    className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:outline-none focus:border-foreground/30 transition-all"
                                                    placeholder="/shop"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <ImageUpload 
                                                label="Hero Background"
                                                currentImage={settings?.heroImage}
                                                onUploadComplete={(url) => setSettings({ ...settings, heroImage: url })}
                                            />
                                        </div>
                                        <button
                                            onClick={async () => {
                                                setIsSaving(true);
                                                try {
                                                    const res = await fetch('/api/admin/settings', {
                                                        method: 'POST',
                                                        headers: { 'Content-Type': 'application/json' },
                                                        body: JSON.stringify(settings),
                                                    });
                                                    if (res.ok) {
                                                        const updated = await res.json();
                                                        setSettings(updated);
                                                    }
                                                } catch (err) {
                                                    console.error('Failed to save settings:', err);
                                                } finally {
                                                    setIsSaving(false);
                                                }
                                            }}
                                            disabled={isSaving}
                                            className="w-full flex items-center justify-center gap-3 bg-foreground text-background py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:opacity-90 transition-all disabled:opacity-50"
                                        >
                                            <Save size={14} />
                                            {isSaving ? 'Saving...' : 'Save Hero Settings'}
                                        </button>
                                    </div>

                                    {/* Live Preview */}
                                    <div className="space-y-3">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Live Preview</p>
                                        <div className="relative aspect-video bg-foreground/5 rounded-2xl overflow-hidden border border-foreground/10">
                                            {settings?.heroImage && (
                                                <img src={settings.heroImage} className="absolute inset-0 w-full h-full object-cover opacity-40" />
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                                            <div className="relative h-full flex flex-col items-center justify-center text-center p-6">
                                                {/* Background Overlay Text */}
                                                <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
                                                    <h4 className="text-[12vw] font-black font-syncopate text-brand-red uppercase italic opacity-10 blur-[2px] leading-none select-none">
                                                        {settings?.heroOverlayText || 'CORASE'}
                                                    </h4>
                                                </div>

                                                {/* Foreground Content */}
                                                <div className="relative z-10 space-y-2">
                                                    <p className="text-[8px] font-bold text-foreground/60 uppercase tracking-[0.4em] mb-4">{settings?.heroSubtitle || 'DRIP, DETAIL, DOMINANCE'}</p>
                                                    <h4 className="text-xl md:text-2xl font-black font-syncopate text-foreground uppercase tracking-tight leading-tight max-w-[200px] mx-auto">
                                                        {settings?.heroTitle || 'The New Standard'}
                                                    </h4>
                                                    <div className="pt-4">
                                                        <div className="inline-block bg-foreground text-background px-6 py-2.5 rounded-full text-[8px] font-black uppercase tracking-widest shadow-xl">
                                                            {settings?.heroButtonText || 'Explore Collection'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* About Page Customization */}
                            <div className="bg-foreground/5 border border-foreground/10 rounded-2xl overflow-hidden">
                                <div className="px-8 py-6 border-b border-foreground/5 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-foreground/5 rounded-xl">
                                            <LayoutDashboard size={16} className="text-foreground/60" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-black font-syncopate uppercase">About Page</h3>
                                            <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest mt-0.5">Customize your story and values</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-8 space-y-8">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">About Tagline</label>
                                            <textarea
                                                value={settings?.aboutTagline || ''}
                                                onChange={(e) => setSettings({ ...settings, aboutTagline: e.target.value })}
                                                className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:outline-none focus:border-foreground/30 transition-all min-h-[100px]"
                                                placeholder="A streetwear brand born from..."
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">About Description</label>
                                            <textarea
                                                value={settings?.aboutDescription || ''}
                                                onChange={(e) => setSettings({ ...settings, aboutDescription: e.target.value })}
                                                className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:outline-none focus:border-foreground/30 transition-all min-h-[100px]"
                                                placeholder="Designed for the bold, the restless..."
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">About Vision Detail</label>
                                        <textarea
                                            value={settings?.aboutVision || ''}
                                            onChange={(e) => setSettings({ ...settings, aboutVision: e.target.value })}
                                            className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:outline-none focus:border-foreground/30 transition-all min-h-[100px]"
                                            placeholder="We source the heaviest, most premium..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">CTA Heading</label>
                                            <input
                                                type="text"
                                                value={settings?.aboutCtaHeading || ''}
                                                onChange={(e) => setSettings({ ...settings, aboutCtaHeading: e.target.value })}
                                                className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:outline-none focus:border-foreground/30 transition-all"
                                                placeholder="WEAR THE ARCHIVE"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">CTA Button Text</label>
                                            <input
                                                type="text"
                                                value={settings?.aboutCtaButton || ''}
                                                onChange={(e) => setSettings({ ...settings, aboutCtaButton: e.target.value })}
                                                className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:outline-none focus:border-foreground/30 transition-all"
                                                placeholder="EXPLORE COLLECTION"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-6 pt-4">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/60">Value Pillars</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {[0, 1, 2, 3].map((idx) => (
                                                <div key={idx} className="p-5 rounded-xl bg-foreground/[0.02] border border-foreground/5 space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xl font-black font-syncopate text-foreground/10">{String(idx + 1).padStart(2, '0')}</span>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[9px] font-bold uppercase tracking-widest text-foreground/30">Pillar Title</label>
                                                        <input
                                                            type="text"
                                                            value={settings?.aboutValues?.[idx]?.title || ''}
                                                            onChange={(e) => {
                                                                const newValues = [...(settings?.aboutValues || [])];
                                                                if (!newValues[idx]) newValues[idx] = { title: '', desc: '' };
                                                                newValues[idx].title = e.target.value;
                                                                setSettings({ ...settings, aboutValues: newValues });
                                                            }}
                                                            className="w-full bg-background border border-foreground/10 rounded-lg px-3 py-2 text-xs font-bold text-foreground focus:outline-none focus:border-foreground/30 transition-all"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[9px] font-bold uppercase tracking-widest text-foreground/30">Pillar Description</label>
                                                        <textarea
                                                            value={settings?.aboutValues?.[idx]?.desc || ''}
                                                            onChange={(e) => {
                                                                const newValues = [...(settings?.aboutValues || [])];
                                                                if (!newValues[idx]) newValues[idx] = { title: '', desc: '' };
                                                                newValues[idx].desc = e.target.value;
                                                                setSettings({ ...settings, aboutValues: newValues });
                                                            }}
                                                            className="w-full bg-background border border-foreground/10 rounded-lg px-3 py-2 text-xs font-bold text-foreground focus:outline-none focus:border-foreground/30 transition-all min-h-[80px]"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        onClick={async () => {
                                            setIsSaving(true);
                                            try {
                                                const res = await fetch('/api/admin/settings', {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify(settings),
                                                });
                                                if (res.ok) {
                                                    const updated = await res.json();
                                                    setSettings(updated);
                                                    alert("About page settings updated!");
                                                }
                                            } catch (err) {
                                                console.error('Failed to save settings:', err);
                                            } finally {
                                                setIsSaving(false);
                                            }
                                        }}
                                        disabled={isSaving}
                                        className="w-full flex items-center justify-center gap-3 bg-foreground text-background py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:opacity-90 transition-all disabled:opacity-50"
                                    >
                                        <Save size={14} />
                                        {isSaving ? 'Saving...' : 'Save About Page Settings'}
                                    </button>
                                </div>
                            </div>

                            {/* Store Overview Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-foreground/5 border border-foreground/10 rounded-2xl p-6 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-emerald-500/10 rounded-xl">
                                            <TrendingUp size={16} className="text-emerald-400" />
                                        </div>
                                        <p className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">Revenue</p>
                                    </div>
                                    <p className="text-3xl font-black text-foreground tracking-tight">₹{totalRevenue.toLocaleString()}</p>
                                    <p className="text-[10px] text-foreground/30 font-bold uppercase tracking-widest">From {orders.length} orders</p>
                                </div>
                                <div className="bg-foreground/5 border border-foreground/10 rounded-2xl p-6 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-indigo-500/10 rounded-xl">
                                            <Package size={16} className="text-indigo-400" />
                                        </div>
                                        <p className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">Catalog</p>
                                    </div>
                                    <p className="text-3xl font-black text-foreground tracking-tight">{products.length}</p>
                                    <p className="text-[10px] text-foreground/30 font-bold uppercase tracking-widest">Products live</p>
                                </div>
                                <div className="bg-foreground/5 border border-foreground/10 rounded-2xl p-6 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-purple-500/10 rounded-xl">
                                            <Users size={16} className="text-purple-400" />
                                        </div>
                                        <p className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">Customers</p>
                                    </div>
                                    <p className="text-3xl font-black text-foreground tracking-tight">{users.length}</p>
                                    <p className="text-[10px] text-foreground/30 font-bold uppercase tracking-widest">Registered users</p>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-foreground/5 border border-foreground/10 rounded-2xl overflow-hidden">
                                <div className="px-8 py-6 border-b border-foreground/5">
                                    <h3 className="text-sm font-black font-syncopate uppercase">Quick Actions</h3>
                                </div>
                                <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <button
                                        onClick={() => { setTab('inventory'); setIsAddingProduct(true); }}
                                        className="flex items-center gap-4 p-5 rounded-xl bg-foreground/[0.03] border border-foreground/5 hover:border-foreground/20 hover:bg-foreground/[0.06] transition-all group text-left"
                                    >
                                        <div className="p-3 bg-foreground/5 rounded-xl group-hover:scale-110 transition-transform">
                                            <Plus size={18} className="text-foreground/60" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-foreground uppercase tracking-tight">Add Product</p>
                                            <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest mt-0.5">Create a new listing</p>
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => setTab('orders')}
                                        className="flex items-center gap-4 p-5 rounded-xl bg-foreground/[0.03] border border-foreground/5 hover:border-foreground/20 hover:bg-foreground/[0.06] transition-all group text-left"
                                    >
                                        <div className="p-3 bg-foreground/5 rounded-xl group-hover:scale-110 transition-transform">
                                            <ShoppingCart size={18} className="text-foreground/60" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-foreground uppercase tracking-tight">View Orders</p>
                                            <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest mt-0.5">{orders.filter(o => o.status === 'Pending').length} pending</p>
                                        </div>
                                    </button>
                                    <Link
                                        href="/"
                                        target="_blank"
                                        className="flex items-center gap-4 p-5 rounded-xl bg-foreground/[0.03] border border-foreground/5 hover:border-foreground/20 hover:bg-foreground/[0.06] transition-all group text-left"
                                    >
                                        <div className="p-3 bg-foreground/5 rounded-xl group-hover:scale-110 transition-transform">
                                            <ExternalLink size={18} className="text-foreground/60" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-foreground uppercase tracking-tight">View Storefront</p>
                                            <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest mt-0.5">Open live site</p>
                                        </div>
                                    </Link>
                                </div>
                            </div>

                            {/* Danger Zone */}
                            <div className="bg-red-500/5 border border-red-500/10 rounded-2xl overflow-hidden">
                                <div className="px-8 py-6 border-b border-red-500/10 flex items-center gap-3">
                                    <AlertTriangle size={16} className="text-red-400" />
                                    <h3 className="text-sm font-black font-syncopate uppercase text-red-400">Danger Zone</h3>
                                </div>
                                <div className="p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                    <div>
                                        <p className="text-xs font-bold text-foreground uppercase tracking-tight">Sign out of admin</p>
                                        <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest mt-0.5">End your current admin session</p>
                                    </div>
                                    <button
                                        onClick={() => signOut()}
                                        className="flex items-center gap-2 bg-red-600/10 border border-red-500/20 text-red-400 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all"
                                    >
                                        <LogOut size={14} /> Sign Out
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Order Details Modal */}
            <AnimatePresence>
                {viewingOrder && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setViewingOrder(null)}
                            className="absolute inset-0 bg-background/90 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-[#0d0d0d] border border-white/10 w-full max-w-4xl max-h-[90vh] rounded-[14px] overflow-hidden flex flex-col shadow-2xl"
                        >
                            {/* Modal Header */}
                            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
                                        <ShoppingCart className="text-white" size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black font-syncopate uppercase tracking-tight text-white">Order #{viewingOrder._id.slice(-8)}</h2>
                                        <p className="text-[10px] font-bold text-white/60 uppercase tracking-[0.2em] mt-1">
                                            Placed on {new Date(viewingOrder.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
                                <button onClick={() => setViewingOrder(null)} className="p-3 hover:bg-white/5 rounded-xl transition-colors text-white">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
                                {/* Left Col: Items & Status */}
                                <div className="space-y-10">
                                    <section>
                                        <h3 className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                                            <span className="w-1 h-4 bg-white rounded-full" /> Items Summary
                                        </h3>
                                        <div className="space-y-4">
                                            {viewingOrder.items.map((item: any, idx: number) => (
                                                <div key={idx} className="flex items-center gap-4 p-4 rounded-[14px] bg-white/[0.03] border border-white/5">
                                                    <div className="w-14 h-16 rounded-[14px] bg-white/5 overflow-hidden flex-shrink-0">
                                                        <img src={item.image} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-bold text-white truncate uppercase">{item.name}</p>
                                                        <p className="text-[10px] text-white/50 font-bold uppercase mt-1">Size: {item.selectedSize} × {item.quantity}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-black text-white">₹{item.price * item.quantity}</p>
                                                        <p className="text-[10px] text-white/30 font-bold">₹{item.price} ea</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-6 pt-6 border-t border-white/5 space-y-2">
                                            <div className="flex justify-between text-xs font-bold text-white/50 uppercase tracking-widest">
                                                <span>Subtotal</span>
                                                <span className="text-white">₹{viewingOrder.subtotal}</span>
                                            </div>
                                            <div className="flex justify-between text-xs font-bold text-white/50 uppercase tracking-widest">
                                                <span>Shipping</span>
                                                <span className="text-white">{viewingOrder.shippingPrice === 0 ? 'FREE' : `₹${viewingOrder.shippingPrice}`}</span>
                                            </div>
                                            <div className="flex justify-between text-lg font-black text-white uppercase tracking-tighter pt-2">
                                                <span>Total</span>
                                                <span className="text-emerald-400">₹{viewingOrder.totalPrice}</span>
                                            </div>
                                        </div>
                                    </section>

                                    <section className="p-6 rounded-[14px] bg-white/[0.02] border border-white/5">
                                        <h3 className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                                            <CreditCard size={14} className="text-indigo-400" /> Payment Info
                                        </h3>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-1">Status</p>
                                                <div className="flex items-center gap-3">
                                                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${viewingOrder.isPaid ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                                        {viewingOrder.isPaid ? 'PAID' : 'PENDING'}
                                                    </span>
                                                    {!viewingOrder.isPaid && (
                                                        <button 
                                                            onClick={() => updateOrderStatus(viewingOrder._id, { isPaid: true })}
                                                            className="text-[9px] font-black uppercase tracking-widest text-emerald-400 hover:underline"
                                                        >
                                                            Mark as Paid
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-1">Method</p>
                                                <p className="text-xs font-bold text-white uppercase">{viewingOrder.paymentMethod}</p>
                                            </div>
                                            <div className="col-span-2">
                                                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-1">
                                                    {viewingOrder.paymentMethod === 'UPI Direct' ? 'UPI Transaction ID (UTR)' : 'Payment ID'}
                                                </p>
                                                <p className="text-xs font-mono text-white/70 select-all">
                                                    {viewingOrder.transactionId || viewingOrder.razorpayPaymentId || viewingOrder.razorpayOrderId || 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                    </section>
                                </div>

                                {/* Right Col: Fulfillment & Delivery */}
                                <div className="space-y-10">
                                    <section>
                                        <h3 className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                                            <MapPin size={14} className="text-rose-400" /> Shipping Address
                                        </h3>
                                        <div className="p-6 rounded-[14px] bg-white/[0.03] border border-white/5 space-y-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center font-bold text-sm text-white">
                                                    {viewingOrder.shippingAddress.fullName[0]}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-white uppercase">{viewingOrder.shippingAddress.fullName}</p>
                                                    <p className="text-xs text-white/50">{viewingOrder.shippingAddress.email}</p>
                                                </div>
                                            </div>
                                            <div className="pt-4 border-t border-white/5 space-y-1">
                                                <p className="text-sm text-white/80 leading-relaxed font-bold">
                                                    {viewingOrder.shippingAddress.address}
                                                </p>
                                                <p className="text-sm text-white/80 font-bold">
                                                    {viewingOrder.shippingAddress.city}, {viewingOrder.shippingAddress.state} {viewingOrder.shippingAddress.zipCode}
                                                </p>
                                                <p className="text-xs text-white/40 font-black uppercase tracking-widest pt-1">{viewingOrder.shippingAddress.country}</p>
                                            </div>
                                        </div>
                                    </section>

                                    <section className="p-6 rounded-[14px] bg-white/5 border border-white/10 shadow-xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none text-white">
                                            <Truck size={120} />
                                        </div>
                                        <h3 className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                                            <Truck size={14} className="text-emerald-400" /> Fulfillment
                                        </h3>
                                        <div className="space-y-6">
                                            <div>
                                                <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-2 block">Order Status</label>
                                                <select 
                                                    value={viewingOrder.status}
                                                    onChange={(e) => updateOrderStatus(viewingOrder._id, { status: e.target.value })}
                                                    className="w-full bg-[#0d0d0d] border border-white/10 rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest text-white focus:outline-none focus:border-white/30 transition-all"
                                                >
                                                    {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
                                                        <option key={s} value={s}>{s}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-2 block">Carrier</label>
                                                    <input 
                                                        type="text" 
                                                        placeholder="e.g. BlueDart"
                                                        value={fulfillment.carrier}
                                                        onChange={(e) => setFulfillment(prev => ({ ...prev, carrier: e.target.value }))}
                                                        className="w-full bg-[#0d0d0d] border border-white/10 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-widest text-white focus:outline-none focus:border-white/30 transition-all"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-2 block">Tracking Number</label>
                                                    <input 
                                                        type="text" 
                                                        placeholder="TRACK-ID-..."
                                                        value={fulfillment.tracking}
                                                        onChange={(e) => setFulfillment(prev => ({ ...prev, tracking: e.target.value }))}
                                                        className="w-full bg-[#0d0d0d] border border-white/10 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-white/30 transition-all font-mono text-white"
                                                    />
                                                </div>
                                            </div>
                                            
                                            <div className="flex gap-3">
                                                <button 
                                                    className="flex-1 flex items-center justify-center gap-3 bg-white text-black py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gray-200 transition-all shadow-xl disabled:opacity-50"
                                                    disabled={isSaving}
                                                    onClick={() => updateOrderStatus(viewingOrder._id, { 
                                                        carrier: fulfillment.carrier, 
                                                        trackingNumber: fulfillment.tracking 
                                                    })}
                                                >
                                                    {isSaving ? "Saving..." : "Save Fulfillment"}
                                                </button>
                                                <button 
                                                    className="px-6 flex items-center justify-center bg-white/10 border border-white/10 text-white py-4 rounded-xl hover:bg-white/20 transition-all"
                                                    onClick={() => {
                                                        alert("Shipping Label Generated & Ready for Print!");
                                                    }}
                                                >
                                                    <Printer size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {(editingProduct || isAddingProduct) && (
                <AdminProductModal 
                    product={editingProduct}
                    onClose={() => {
                        setEditingProduct(null);
                        setIsAddingProduct(false);
                    }}
                    onSave={handleSaveProduct}
                />
            )}

            <AnimatePresence>
                {deletingProductId && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setDeletingProductId(null)}
                            className="absolute inset-0 bg-background/95 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-[#0d0d0d] border border-white/10 w-full max-w-sm rounded-[14px] p-8 text-center space-y-6 shadow-2xl"
                        >
                            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto text-red-500">
                                <Trash2 size={32} />
                            </div>
                            <div>
                                <h3 className="text-lg font-black font-syncopate uppercase tracking-tight text-white">Delete Product?</h3>
                                <p className="text-xs text-white/60 font-bold uppercase tracking-widest mt-2">This action cannot be undone.</p>
                            </div>
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setDeletingProductId(null)}
                                    className="flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10 hover:bg-white/5 transition-all text-white"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={() => handleDeleteProduct(deletingProductId)}
                                    className="flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest bg-red-600 text-white hover:bg-red-500 transition-all"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            {(editingCoupon || isAddingCoupon) && (
                <AdminCouponModal 
                    coupon={editingCoupon}
                    onClose={() => {
                        setEditingCoupon(null);
                        setIsAddingCoupon(false);
                    }}
                    onSave={handleSaveCoupon}
                />
            )}

            <AnimatePresence>
                {deletingCouponId && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setDeletingCouponId(null)}
                            className="absolute inset-0 bg-background/95 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-[#0d0d0d] border border-white/10 w-full max-w-sm rounded-[14px] p-8 text-center space-y-6 shadow-2xl"
                        >
                            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto text-red-500">
                                <Ticket size={32} />
                            </div>
                            <div>
                                <h3 className="text-lg font-black font-syncopate uppercase tracking-tight text-white">Delete Coupon?</h3>
                                <p className="text-xs text-white/60 font-bold uppercase tracking-widest mt-2">This action cannot be undone.</p>
                            </div>
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setDeletingCouponId(null)}
                                    className="flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10 hover:bg-white/5 transition-all text-white"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={() => handleDeleteCoupon(deletingCouponId)}
                                    className="flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest bg-red-600 text-white hover:bg-red-500 transition-all"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

