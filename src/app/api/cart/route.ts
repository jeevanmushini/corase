import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import { User } from "@/models/User";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { cart } = await req.json();

    if (!Array.isArray(cart)) {
      return NextResponse.json({ message: "Invalid cart data" }, { status: 400 });
    }

    await connectToDatabase();
    
    // Find user and update their cart
    const user = await User.findById((session.user as any).id);
    
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    user.cart = cart;
    await user.save();

    return NextResponse.json({ message: "Cart synced successfully" }, { status: 200 });
  } catch (error) {
    console.error("Cart sync error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
    
        if (!session || !session.user) {
          return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
    
        await connectToDatabase();
        
        const user = await User.findById((session.user as any).id);
        
        if (!user) {
          return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
    
        return NextResponse.json({ cart: user.cart }, { status: 200 });
      } catch (error) {
        console.error("Cart get error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
      }
}
