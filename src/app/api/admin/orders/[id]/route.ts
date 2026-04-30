import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import fs from "fs";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const logMsg = `[${new Date().toISOString()}] UPDATING ${id}: ${JSON.stringify(body)}\n`;
    try { fs.appendFileSync('scratch/api_debug.log', logMsg); } catch(e) {}
    
    const { status, trackingNumber, carrier, isPaid, paidAt } = body;

    await connectToDatabase();

    const updateData: any = {};
    if (status !== undefined) updateData.status = status;
    if (trackingNumber !== undefined) updateData.trackingNumber = trackingNumber;
    if (carrier !== undefined) updateData.carrier = carrier;
    if (isPaid !== undefined) updateData.isPaid = isPaid;
    if (paidAt !== undefined) updateData.paidAt = paidAt;

    // Auto-set timestamps for status changes
    if (status === "Shipped") updateData.shippedAt = new Date();
    if (status === "Delivered") updateData.deliveredAt = new Date();
    if (isPaid === true && !updateData.paidAt) updateData.paidAt = new Date();

    try { fs.appendFileSync('scratch/api_debug.log', `[${new Date().toISOString()}] UPDATE_DATA: ${JSON.stringify(updateData)}\n`); } catch(e) {}

    const order = await Order.findOneAndUpdate({ _id: id }, updateData, { new: true });

    if (!order) {
      try { fs.appendFileSync('scratch/api_debug.log', `[${new Date().toISOString()}] ORDER NOT FOUND: ${id}\n`); } catch(e) {}
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    try { fs.appendFileSync('scratch/api_debug.log', `[${new Date().toISOString()}] SAVED_ORDER: status=${order.status}, carrier=${order.carrier}, tracking=${order.trackingNumber}\n`); } catch(e) {}

    return NextResponse.json(order);
  } catch (error: any) {
    try { fs.appendFileSync('scratch/api_debug.log', `[${new Date().toISOString()}] ERROR: ${error.message}\n`); } catch(e) {}
    console.error("Order update error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const order = await Order.findById(id).populate("user", "name email");

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
