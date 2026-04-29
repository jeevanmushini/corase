"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSession } from "next-auth/react";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  selectedSize: string;
  quantity: number;
}

// Shared Product type used across modals, wishlists, and product pages
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
  isNewDrop?: boolean;
  isFeatured?: boolean;
  color?: string;
  sizes?: string[];
  variants?: { size: string; stock: number }[];
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  totalPrice: number;
  totalItems: number;
  appliedCoupon: any | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  discountedTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<any | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load initial data
  useEffect(() => {
    const loadCart = async () => {
      if (status === "authenticated") {
        try {
          // Get local cart before fetching from DB
          const savedCart = localStorage.getItem("corase_cart");
          const localItems = savedCart ? JSON.parse(savedCart) : [];

          const res = await fetch("/api/cart");
          if (res.ok) {
            const data = await res.json();
            const dbCart = data.cart || [];
            
            // Merge local cart into DB cart if they differ
            if (localItems.length > 0) {
                // Simple merge logic: combine them and remove duplicates (optional)
                // For now, let's just use DB cart if it exists, else use local
                if (dbCart.length === 0) {
                    setCart(localItems);
                    // Clear local storage after merging
                    localStorage.removeItem("corase_cart");
                } else {
                    setCart(dbCart);
                }
            } else {
                setCart(dbCart);
            }
          }
        } catch (error) {
          console.error("Failed to load cart from DB", error);
        }
      } else if (status === "unauthenticated") {
        const savedCart = localStorage.getItem("corase_cart");
        if (savedCart) {
          try {
            setCart(JSON.parse(savedCart));
          } catch (e) {
            console.error("Failed to parse local cart");
          }
        }
      }
      setIsInitialized(true);
    };

    if (status !== "loading") {
      loadCart();
    }
  }, [status]);

  // Sync data when items change (Optimistic with Rollback)
  useEffect(() => {
    if (!isInitialized) return;

    if (status === "authenticated") {
      const syncCart = async () => {
        try {
          const res = await fetch("/api/cart", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cart: cart }),
          });
          
          if (!res.ok) {
            throw new Error("Failed to sync cart");
          }
        } catch (e) {
          console.error("Cart sync failed, reverting...", e);
          // Optional: Revert to last known good state or show a toast
          // For now we just log, but in a production app we might pull the DB state again
          const res = await fetch("/api/cart");
          if (res.ok) {
            const data = await res.json();
            setCart(data.cart || []);
          }
        }
      };

      // Debounce sync slightly to prevent rapid firing
      const timeout = setTimeout(syncCart, 500);
      return () => clearTimeout(timeout);
    } else if (status === "unauthenticated") {
      localStorage.setItem("corase_cart", JSON.stringify(cart));
    }
  }, [cart, status, isInitialized]);

  const addToCart = (newItem: CartItem) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) => item.productId === newItem.productId && item.selectedSize === newItem.selectedSize
      );

      if (existingItemIndex >= 0) {
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += newItem.quantity;
        return newCart;
      }
      return [...prevCart, newItem];
    });
    setIsOpen(true);
  };

  const removeFromCart = (productId: string, size: string) => {
    setCart((prevCart) => prevCart.filter(
      (item) => !(item.productId === productId && item.selectedSize === size)
    ));
  };

  const updateQuantity = (productId: string, size: string, quantity: number) => {
    if (quantity < 1) return;
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === productId && item.selectedSize === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const applyCoupon = async (code: string) => {
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, amount: totalPrice }),
      });

      const data = await res.json();

      if (res.ok) {
        setAppliedCoupon(data);
        return { success: true, message: "Coupon applied successfully!" };
      } else {
        return { success: false, message: data.error || "Failed to apply coupon" };
      }
    } catch (error) {
      return { success: false, message: "Error validating coupon" };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  const currentDiscount = appliedCoupon ? (
    appliedCoupon.discountType === 'percentage' 
      ? Math.min((totalPrice * appliedCoupon.discountValue) / 100, appliedCoupon.maxDiscount || Infinity)
      : appliedCoupon.discountValue
  ) : 0;

  const discountedTotal = Math.max(totalPrice - currentDiscount, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsOpen,
        totalPrice,
        totalItems,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        discountedTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
