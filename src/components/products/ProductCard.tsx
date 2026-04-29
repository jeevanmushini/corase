"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ThumbsUp } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";

interface ProductCardProps {
  product: any;
  onSelect: (p: any) => void;
  onEdit?: (p: any) => void;
  isAdmin?: boolean;
  priority?: boolean;
}

export default function ProductCard({ product, onSelect, onEdit, isAdmin, priority }: ProductCardProps) {
  const { toggleWishlist, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id);
  const totalStock = product.variants?.reduce((acc: number, v: any) => acc + v.stock, 0) || 0;

  const [isLiked, setIsLiked] = useState(product.isLikedByAdmin || false);
  const [isLiking, setIsLiking] = useState(false);

  const handleAdminLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLiking) return;
    setIsLiking(true);
    const newLikedState = !isLiked;
    setIsLiked(newLikedState); // Optimistic UI update
    try {
      await fetch(`/api/admin/products/${product.id}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ liked: newLikedState }),
      });
    } catch (error) {
      setIsLiked(!newLikedState); // Revert on failure
      console.error("Failed to like product:", error);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group relative"
    >

      
      <div 
        className="cursor-pointer flex flex-col"
        onClick={() => onSelect(product)}
      >
        <div className="relative aspect-[3/4] bg-foreground/5 overflow-hidden mb-5 rounded-[14px] shadow-2xl border border-foreground/5 group-hover:border-brand-red/20 transition-all duration-500">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
            className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-90 group-hover:opacity-100"
          />
          {product.isNewDrop && (
            <span className="absolute top-4 left-4 text-[9px] font-black text-white tracking-[0.3em] uppercase bg-brand-red px-3 py-1.5 rounded-lg shadow-lg">
              New Drop
            </span>
          )}
          
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist({
                productId: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
              });
            }}
            className={`absolute top-4 right-4 p-3 rounded-full transition-all duration-500 z-10 ${
              wishlisted
                ? "bg-brand-red text-white shadow-lg scale-110"
                : "bg-background/80 backdrop-blur-md text-foreground/40 opacity-0 group-hover:opacity-100 hover:text-brand-red hover:bg-background"
            }`}
          >
            <Heart
              size={14}
              fill={wishlisted ? "currentColor" : "none"}
              strokeWidth={2.5}
            />
          </button>

          <div className="absolute inset-x-4 bottom-4 bg-background/95 backdrop-blur-md text-foreground py-4 rounded-[14px] text-center text-[10px] font-black tracking-[0.3em] uppercase translate-y-[150%] group-hover:translate-y-0 transition-transform duration-500 shadow-2xl border border-foreground/5">
            Quick View
          </div>
        </div>
        
        <div className="flex flex-col gap-2 px-1">
          <div className="flex flex-col gap-0.5">
            <h3 className="text-xs sm:text-sm font-semibold font-sans text-foreground tracking-normal truncate group-hover:text-brand-red transition-colors duration-300">{product.name}</h3>
            <div className="flex items-center justify-between">
              <p className="text-[9px] text-foreground/40 font-bold tracking-[0.2em] uppercase">{product.category}</p>
              <span className="text-[11px] sm:text-xs text-foreground font-black tracking-tighter">₹{product.price}</span>
            </div>
          </div>
          
          {/* Admin-only Like Button */}
          {isAdmin && (
            <div className="mt-2 flex gap-2">
              <button
                onClick={handleAdminLike}
                disabled={isLiking}
                className={`text-[10px] flex items-center gap-1.5 font-bold tracking-widest uppercase transition-colors border px-2 py-1 rounded-sm ${
                  isLiked 
                    ? "bg-foreground/10 text-foreground border-foreground/30" 
                    : "bg-foreground/5 text-foreground/40 border-foreground/10 hover:text-foreground hover:border-foreground/30"
                }`}
                title="Admin Like"
              >
                <ThumbsUp size={10} className={isLiked ? "fill-foreground/20" : ""} /> 
                {isLiked ? 'Liked' : 'Like'}
              </button>
              {onEdit && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onEdit(product);
                  }}
                  className="text-[10px] flex items-center gap-1.5 font-bold tracking-widest uppercase transition-colors border px-2 py-1 rounded-sm bg-foreground/5 text-foreground/40 border-foreground/10 hover:text-foreground hover:border-foreground/30"
                >
                  Edit
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
