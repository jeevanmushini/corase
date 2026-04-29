"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Plus, Trash2, Image as ImageIcon, Loader2 } from 'lucide-react';

interface AdminProductModalProps {
    product: any | null;
    onClose: () => void;
    onSave: (product: any) => Promise<void>;
}

const AdminProductModal: React.FC<AdminProductModalProps> = ({ product, onClose, onSave }) => {
    const [formData, setFormData] = useState<any>({
        name: '',
        category: '',
        price: 0,
        description: '',
        image: '',
        variants: [{ size: 'S', stock: 0 }, { size: 'M', stock: 0 }, { size: 'L', stock: 0 }, { size: 'XL', stock: 0 }],
        isNewDrop: false,
        isFeatured: false
    });
    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (product) {
            setFormData({
                ...product,
                name: product.name || product.title || '',
                image: product.image || (product.images && product.images[0]) || ''
            });
        }
    }, [product]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const data = new FormData();
        data.append('file', file);

        try {
            const res = await fetch('/api/admin/upload', {
                method: 'POST',
                body: data
            });
            const { url } = await res.json();
            setFormData({ ...formData, image: url });
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Upload failed");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await onSave(formData);
            onClose();
        } catch (error) {
            console.error("Save failed:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const updateVariant = (index: number, field: string, value: any) => {
        const newVariants = [...formData.variants];
        newVariants[index] = { ...newVariants[index], [field]: value };
        setFormData({ ...formData, variants: newVariants });
    };

    const addVariant = () => {
        setFormData({ ...formData, variants: [...formData.variants, { size: '', stock: 0 }] });
    };

    const removeVariant = (index: number) => {
        setFormData({ ...formData, variants: formData.variants.filter((_: any, i: number) => i !== index) });
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/90 backdrop-blur-md"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative bg-[#0d0d0d] border border-white/10 w-full max-w-2xl max-h-[90vh] rounded-[14px] overflow-hidden flex flex-col shadow-2xl"
                >
                    <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                        <h2 className="text-lg font-black font-syncopate uppercase tracking-tight text-white">
                            {product ? 'Edit Product' : 'New Product'}
                        </h2>
                        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] text-white/70 font-black uppercase tracking-widest mb-2 block">Product Name</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-[14px] px-4 py-3 text-xs font-bold uppercase tracking-widest text-white focus:outline-none focus:border-white/30 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] text-white/70 font-black uppercase tracking-widest mb-2 block">Category</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-[14px] px-4 py-3 text-xs font-bold uppercase tracking-widest text-white focus:outline-none focus:border-white/30 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] text-white/70 font-black uppercase tracking-widest mb-2 block">Price (₹)</label>
                                    <input 
                                        type="number" 
                                        required
                                        placeholder="0"
                                        value={formData.price === 0 ? '' : formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value === '' ? 0 : Number(e.target.value) })}
                                        className="w-full bg-white/5 border border-white/10 rounded-[14px] px-4 py-3 text-xs font-bold uppercase tracking-widest text-white focus:outline-none focus:border-white/30 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] text-white/70 font-black uppercase tracking-widest mb-2 block">Product Image</label>
                                <div className="aspect-[4/5] bg-white/5 border border-white/10 rounded-[14px] relative overflow-hidden flex items-center justify-center group cursor-pointer">
                                    {formData.image ? (
                                        <img src={formData.image} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 text-white/40 group-hover:text-white/70 transition-colors">
                                            <ImageIcon size={32} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Click to upload</span>
                                        </div>
                                    )}
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                    {isUploading && (
                                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                                            <Loader2 size={24} className="animate-spin text-white" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] text-white/70 font-black uppercase tracking-widest mb-2 block">Description</label>
                            <textarea 
                                rows={3}
                                required
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-[14px] px-4 py-3 text-xs font-bold uppercase tracking-widest text-white focus:outline-none focus:border-white/30 transition-all resize-none"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <label className="text-[10px] text-white/70 font-black uppercase tracking-widest block">Variants (Size & Stock)</label>
                                <button 
                                    type="button"
                                    onClick={addVariant}
                                    className="text-[10px] font-black text-white/80 hover:text-white uppercase tracking-widest flex items-center gap-1 transition-colors"
                                >
                                    <Plus size={12} /> Add Size
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {formData.variants.map((v: any, i: number) => (
                                    <div key={i} className="flex gap-2 items-center bg-white/[0.03] border border-white/5 p-2 rounded-[14px]">
                                        <input 
                                            type="text" 
                                            placeholder="Size"
                                            value={v.size}
                                            onChange={(e) => updateVariant(i, 'size', e.target.value)}
                                            className="w-16 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-[10px] font-black uppercase tracking-widest text-white focus:outline-none"
                                        />
                                        <input 
                                            type="number" 
                                            placeholder="Stock"
                                            value={v.stock === 0 ? '' : v.stock}
                                            onChange={(e) => updateVariant(i, 'stock', e.target.value === '' ? 0 : Number(e.target.value))}
                                            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-[10px] font-black uppercase tracking-widest text-white focus:outline-none"
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => removeVariant(i)}
                                            className="p-1.5 text-red-500/60 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-6">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input 
                                    type="checkbox"
                                    checked={formData.isNewDrop}
                                    onChange={(e) => setFormData({ ...formData, isNewDrop: e.target.checked })}
                                    className="w-4 h-4 rounded border-white/10 bg-white/5 checked:bg-white checked:border-white transition-all appearance-none cursor-pointer relative after:content-[''] after:hidden checked:after:block after:absolute after:left-[5px] after:top-[1px] after:w-[4px] after:h-[8px] after:border-b-2 after:border-r-2 after:border-black after:rotate-45"
                                />
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/80 group-hover:text-white transition-colors">New Drop</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input 
                                    type="checkbox"
                                    checked={formData.isFeatured}
                                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                                    className="w-4 h-4 rounded border-white/10 bg-white/5 checked:bg-white checked:border-white transition-all appearance-none cursor-pointer relative after:content-[''] after:hidden checked:after:block after:absolute after:left-[5px] after:top-[1px] after:w-[4px] after:h-[8px] after:border-b-2 after:border-r-2 after:border-black after:rotate-45"
                                />
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/80 group-hover:text-white transition-colors">Featured</span>
                            </label>
                        </div>
                    </form>

                    <div className="p-6 border-t border-white/5 bg-white/[0.02] flex gap-3">
                        <button 
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 rounded-[14px] text-[10px] font-black uppercase tracking-widest border border-white/10 hover:bg-white/5 transition-all text-white"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSubmit}
                            disabled={isSaving || !formData.name || !formData.image}
                            className="flex-[2] py-4 rounded-[14px] text-[10px] font-black uppercase tracking-widest bg-white text-black hover:bg-gray-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                            {product ? 'Update Product' : 'Create Product'}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default AdminProductModal;
