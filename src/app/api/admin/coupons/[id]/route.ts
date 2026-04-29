import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Coupon from "@/models/Coupon";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    await connectToDatabase();
    
    const coupon = await Coupon.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json(coupon);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update coupon" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    await Coupon.findByIdAndDelete(id);
    return NextResponse.json({ message: "Coupon deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete coupon" }, { status: 500 });
  }
}
