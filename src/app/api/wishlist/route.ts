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

    const { wishlist } = await req.json();

    if (!Array.isArray(wishlist)) {
      return NextResponse.json({ message: "Invalid wishlist data" }, { status: 400 });
    }

    await connectToDatabase();
    
    // Find user and update their wishlist
    const user = await User.findById((session.user as any).id);
    
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    user.wishlist = wishlist;
    await user.save();

    return NextResponse.json({ message: "Wishlist synced successfully" }, { status: 200 });
  } catch (error) {
    console.error("Wishlist sync error:", error);
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
    
        return NextResponse.json({ wishlist: user.wishlist }, { status: 200 });
      } catch (error) {
        console.error("Wishlist get error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
      }
}
