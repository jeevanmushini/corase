import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import Coupon from "@/models/Coupon";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { items, shippingAddress, subtotal, shippingPrice, totalPrice, discount, coupon: couponCode } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ message: "No order items" }, { status: 400 });
    }

    await connectToDatabase();

    let serverDiscount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (coupon) {
        // Re-calculate discount
        if (coupon.discountType === "percentage") {
          serverDiscount = (subtotal * coupon.discountValue) / 100;
          if (coupon.maxDiscount && serverDiscount > coupon.maxDiscount) {
            serverDiscount = coupon.maxDiscount;
          }
        } else {
          serverDiscount = coupon.discountValue;
        }
      }
    }

    // Verify totals
    const expectedTotal = subtotal + shippingPrice - serverDiscount;
    // We'll trust the provided totalPrice for now but log if it differs significantly
    // In production, you'd strictly enforce expectedTotal === totalPrice
    
    // 1. Create a Razorpay Order
    const rzpOrder = await razorpay.orders.create({
      amount: Math.round(expectedTotal * 100), // Use server calculated total
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    // 2. Create Order in MongoDB (Pending state)
    const newOrder = await Order.create({
      user: (session.user as any).id,
      items,
      shippingAddress,
      paymentMethod: "Razorpay",
      subtotal,
      shippingPrice,
      totalPrice: expectedTotal,
      discount: serverDiscount,
      coupon: couponCode,
      isPaid: false,
      status: "Pending",
      razorpayOrderId: rzpOrder.id,
    });

    return NextResponse.json({
      orderId: newOrder._id,
      razorpayOrderId: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
    }, { status: 201 });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
