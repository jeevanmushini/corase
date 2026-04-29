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

    const { orderId, transactionId } = await req.json();

    if (!orderId || !transactionId) {
      return NextResponse.json({ message: "Missing orderId or transactionId" }, { status: 400 });
    }

    await connectToDatabase();

    const order = await Order.findOneAndUpdate(
      { _id: orderId, user: (session.user as any).id },
      { transactionId },
      { new: true }
    );

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Transaction ID updated", order });
  } catch (error) {
    console.error("Update transaction error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
