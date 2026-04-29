import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Product from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    
    await connectToDatabase();
    
    // Generate a simple ID if not provided (matching the existing products)
    const count = await Product.countDocuments();
    const newId = body.id || (count + 1).toString();
    
    // Map frontend fields to DB fields
    const productData = {
      ...body,
      id: newId,
      title: body.name || body.title,
      images: body.image ? [body.image] : (body.images || []),
    };
    
    // Remove name and image if they were mapped to title and images
    delete productData.name;
    delete productData.image;

    const product = await Product.create(productData);
    
    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error("Create product error:", error);
    return NextResponse.json({ error: error.message || "Failed to create product" }, { status: 500 });
  }
}
