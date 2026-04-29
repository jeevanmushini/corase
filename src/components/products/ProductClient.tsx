"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, Minus, Plus, Truck, RotateCcw, Shield } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useRouter } from "next/navigation";

interface ProductClientProps {
  productId: string;
  initialProduct: any;
}

export default function ProductClient({ productId, initialProduct }: ProductClientProps) {
  const [product, setProduct] = useState<any>(initialProduct);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [pageLoading, setPageLoading] = useState(!initialProduct);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState(false);

  const { addToCart, setIsOpen } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          setAllProducts(data);
          if (!initialProduct) {
            const found = data.find((p: any) => p.id === productId);
            setProduct(found || null);
          }
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setPageLoading(false);
      }
    };
    fetchProducts();
  }, [productId, initialProduct]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return allProducts
      .filter((p) => p.id !== product.id && p.category === product.category)
      .slice(0, 4);
  }, [product, allProducts]);

  if (pageLoading) {
    return (
      <div className="bg-[#050505] min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-[#050505] min-h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-6xl mb-6">🔍</p>
          <p className="text-white/60 font-bold tracking-[0.2em] text-xs uppercase mb-6">
            Product not found
          </p>
          <Link
            href="/shop"
            className="text-xs font-bold tracking-wider uppercase text-white border border-white/20 px-6 py-3 hover:bg-white hover:text-black transition-all rounded-sm"
          >
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    const cartProduct = {
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      selectedSize: selectedSize,
      quantity: quantity,
    };
    addToCart(cartProduct);
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    const cartProduct = {
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      selectedSize: selectedSize,
      quantity: quantity,
    };
    addToCart(cartProduct);
    setIsOpen(false);
    router.push("/checkout");
  };

  return (
    <div className="bg-[#050505] min-h-screen text-white pt-24 pb-32">
      <div className="max-w-[1400px] mx-auto px-5 lg:px-16">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-10"
        >
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.15em] uppercase text-white/40 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} /> Back to Shop
          </Link>
        </motion.div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative aspect-[3/4] bg-[#0a0a0a] rounded-sm overflow-hidden lg:sticky lg:top-28">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
              {product.isNewDrop && (
                <span className="absolute top-5 left-5 text-[10px] font-bold tracking-[0.2em] uppercase text-white bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-sm">
                  New Drop
                </span>
              )}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col"
          >
            <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/60 mb-3">
              {product.category}
            </p>
            <h1 className="text-brand-red text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black font-syncopate tracking-tighter uppercase mb-4 md:mb-6 leading-[1.1]">
              {product.name}
            </h1>
            <p className="text-2xl font-black text-white mb-8">
              ₹{product.price}
            </p>

            <p className="text-white/50 text-base leading-relaxed mb-10 max-w-md">
              {product.description}
            </p>

            {/* Size Selector */}
            <div className="mb-8">
              <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/60 mb-4">
                Select Size{" "}
                {sizeError && (
                  <span className="text-red-400 ml-2">— Please select a size</span>
                )}
              </p>
              <div className="flex flex-wrap gap-3">
                {(product.sizes || (product.variants || []).map((v: any) => v.size)).map((size: string) => {
                  const variant = product.variants?.find((v: any) => v.size === size);
                  const outOfStock = variant ? variant.stock === 0 : false;
                  return (
                    <button
                      key={size}
                      disabled={outOfStock}
                      onClick={() => {
                        if (!outOfStock) { setSelectedSize(size); setSizeError(false); }
                      }}
                      className={`relative min-w-[48px] h-12 px-4 rounded-sm text-sm font-bold border transition-all ${
                        selectedSize === size
                          ? "bg-white text-black border-white"
                          : outOfStock
                          ? "border-white/10 text-white/20 cursor-not-allowed line-through"
                          : "border-white/20 text-white/70 hover:border-white/50 hover:text-white"
                      }`}
                    >
                      {size}
                      {outOfStock && <span className="absolute -top-2 -right-2 text-[7px] bg-red-500/20 text-red-400 px-1 rounded uppercase font-black">Out</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-10">
              <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/30 mb-4">
                Quantity
              </p>
              <div className="flex items-center border border-white/15 rounded-sm w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="w-12 h-12 flex items-center justify-center text-sm font-bold border-x border-white/15">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4 mb-12">
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-white/[0.06] border border-white/10 text-white py-4 rounded-sm font-black text-xs tracking-[0.2em] uppercase hover:bg-white/10 transition-colors"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() =>
                    toggleWishlist({
                      productId: product.id,
                      name: product.name,
                      price: product.price,
                      image: product.image,
                    })
                  }
                  className={`w-14 h-14 rounded-sm border flex items-center justify-center transition-all ${
                    wishlisted
                      ? "bg-white text-black border-white"
                      : "border-white/15 text-white/50 hover:text-white hover:border-white/40"
                  }`}
                >
                  <Heart size={18} fill={wishlisted ? "currentColor" : "none"} />
                </button>
              </div>
              <button
                onClick={handleBuyNow}
                className="w-full bg-white text-black py-5 rounded-sm font-black text-[10px] tracking-[0.4em] uppercase hover:bg-gray-200 transition-all transform hover:scale-[1.01] active:scale-[0.99] shadow-[0_20px_50px_rgba(255,255,255,0.1)]"
              >
                Buy Now — ₹{product.price * quantity}
              </button>
            </div>

            {/* Trust Badges */}
            <div className="border-t border-white/[0.06] pt-8 space-y-4">
              {[
                { icon: Truck, text: "Free delivery on orders above ₹999" },
                { icon: RotateCcw, text: "7-day hassle-free returns" },
                { icon: Shield, text: "100% secure payment" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-white/35 text-sm">
                  <Icon size={16} />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-32">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-2xl md:text-3xl font-black font-syncopate tracking-tight uppercase">
                You May Also Like
              </h2>
              <Link
                href="/shop"
                className="text-xs font-bold tracking-[0.15em] uppercase text-white/40 hover:text-white transition-colors border-b border-white/20 pb-1"
              >
                View All
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-10 md:gap-x-8">
              {relatedProducts.map((p) => (
                <Link key={p.id} href={`/product/${p.id}`} className="group">
                  <div className="relative aspect-[3/4] bg-[#0f0f0f] overflow-hidden mb-4 rounded-sm">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="(max-width: 640px) 50vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                    />
                  </div>
                  <h3 className="text-sm font-bold text-white tracking-wide uppercase truncate">
                    {p.name}
                  </h3>
                  <p className="text-sm text-white/50">₹{p.price}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
