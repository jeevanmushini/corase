import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Coupon from "@/models/Coupon";

export async function POST(req: Request) {
  try {
    const { code, amount } = await req.json();
    if (!code) return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });

    await connectToDatabase();
    
    const coupon = await Coupon.findOne({ 
      code: code.toUpperCase(),
      isActive: true 
    });

    if (!coupon) {
      return NextResponse.json({ error: "Invalid or inactive coupon code" }, { status: 404 });
    }

    // Check expiry
    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      return NextResponse.json({ error: "Coupon has expired" }, { status: 400 });
    }

    // Check usage limit
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json({ error: "Coupon usage limit reached" }, { status: 400 });
    }

    // Check min amount
    if (amount < coupon.minOrderAmount) {
      return NextResponse.json({ 
        error: `Minimum order amount for this coupon is ₹${coupon.minOrderAmount}` 
      }, { status: 400 });
    }

    // Calculate discount
    let discount = 0;
    if (coupon.discountType === "percentage") {
      discount = (amount * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.discountValue;
    }

    return NextResponse.json({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      maxDiscount: coupon.maxDiscount || null,
      discountAmount: discount
    });

  } catch (error) {
    console.error("Coupon validation error:", error);
    return NextResponse.json({ error: "Failed to validate coupon" }, { status: 500 });
  }
}
