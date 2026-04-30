"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, X, ArrowLeft, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalItems, totalPrice, clearCart, clearBuyNowItem } = useCart();

  if (cart.length === 0) {
    return (
      <div className="bg-[#050505] min-h-screen flex items-center justify-center text-white px-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <ShoppingBag size={48} className="mx-auto text-white/15 mb-6" />
          <h1 className="text-brand-red text-2xl md:text-3xl font-black font-syncopate tracking-tight uppercase mb-3">
            Your Cart is Empty
          </h1>
          <p className="text-white/40 text-sm mb-10 max-w-sm mx-auto">
            Looks like you haven&apos;t added anything yet. Explore our collection and find something you love.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-sm font-bold text-xs tracking-[0.2em] uppercase hover:bg-gray-200 transition-colors"
          >
            Continue Shopping <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    );
  }

  const shipping = totalPrice >= 999 ? 0 : 99;
  const grandTotal = totalPrice + shipping;

  return (
    <div className="bg-[#050505] min-h-screen text-white pt-28 pb-32">
      <div className="max-w-[1200px] mx-auto px-5 lg:px-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.15em] uppercase text-white/40 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft size={14} /> Continue Shopping
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-brand-red text-3xl md:text-5xl font-black font-syncopate tracking-tighter uppercase">
              Your Cart
            </h1>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-white/40">
              {totalItems} {totalItems === 1 ? "Item" : "Items"}
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {/* Header Row */}
            <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_auto] gap-6 border-b border-white/10 pb-4 mb-6">
              <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/30">Product</p>
              <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/30 text-center">Quantity</p>
              <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/30 text-right">Total</p>
              <div className="w-8" />
            </div>

            <AnimatePresence>
              {cart.map((item) => (
                <motion.div
                  key={`${item.productId}-${item.selectedSize}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_auto] gap-4 md:gap-6 items-center border-b border-white/[0.06] py-6"
                >
                  {/* Product Info */}
                  <div className="flex items-center gap-5">
                    <div className="relative w-20 h-24 md:w-24 md:h-28 bg-[#0a0a0a] rounded-sm overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white tracking-wide uppercase mb-1">
                        {item.name}
                      </h3>
                      <p className="text-xs text-white/30 tracking-wider uppercase">
                        Size: {item.selectedSize}
                      </p>
                      <p className="text-sm text-white/60 mt-1 md:hidden">
                        ₹{item.price}
                      </p>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-center">
                    <div className="flex items-center border border-white/15 rounded-sm">
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.selectedSize, item.quantity - 1)
                        }
                        className="w-9 h-9 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-9 h-9 flex items-center justify-center text-xs font-bold border-x border-white/15">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.selectedSize, item.quantity + 1)
                        }
                        className="w-9 h-9 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Total */}
                  <p className="text-sm font-bold text-white text-right hidden md:block">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(item.productId, item.selectedSize)}
                    className="w-8 h-8 flex items-center justify-center text-white/30 hover:text-red-400 transition-colors justify-self-end md:justify-self-auto"
                  >
                    <X size={16} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Clear Cart */}
            <button
              onClick={clearCart}
              className="mt-6 text-xs font-bold tracking-wider uppercase text-white/30 hover:text-red-400 transition-colors"
            >
              Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#0a0a0a] border border-white/[0.06] rounded-sm p-8 sticky top-28"
            >
              <h2 className="text-lg font-black font-syncopate tracking-tight uppercase mb-8">
                Order Summary
              </h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Subtotal</span>
                  <span className="font-bold">₹{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Shipping</span>
                  <span className="font-bold">
                    {shipping === 0 ? (
                      <span className="text-green-400">Free</span>
                    ) : (
                      `₹${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-[10px] text-white/30 tracking-wider">
                    Free shipping on orders over ₹999
                  </p>
                )}
                <div className="border-t border-white/[0.06] pt-4 flex justify-between">
                  <span className="text-sm font-bold text-white/70">Total</span>
                  <span className="text-xl font-black">₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                onClick={clearBuyNowItem}
                className="block w-full bg-white text-black py-4 rounded-sm font-black text-xs tracking-[0.2em] uppercase hover:bg-gray-200 transition-colors text-center mb-4"
              >
                Proceed to Checkout
              </Link>

              <p className="text-center text-[10px] text-white/25 tracking-wider">
                Taxes calculated at checkout
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

