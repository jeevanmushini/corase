import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { orderId, transactionId, utrNumber, customerUpiId } = await req.json();

    if (!orderId || !transactionId) {
      return NextResponse.json({ message: "Missing orderId or transactionId" }, { status: 400 });
    }

    await connectToDatabase();

    const order = await Order.findOneAndUpdate(
      { _id: orderId },
      { 
        transactionId,
        utrNumber: utrNumber || "",
        customerUpiId: customerUpiId || "" 
      },
      { new: true }
    );

    if (!order) {
      console.error(`Order not found: ${orderId}`);
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    // Security check: ensure order belongs to user
    if (order.user.toString() !== (session.user as any).id) {
        console.error(`Security mismatch: Order user ${order.user} !== Session user ${(session.user as any).id}`);
        return NextResponse.json({ message: "Unauthorized access to order" }, { status: 403 });
    }

    return NextResponse.json({ message: "Transaction ID updated", order });
  } catch (error) {
    console.error("Update transaction error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
