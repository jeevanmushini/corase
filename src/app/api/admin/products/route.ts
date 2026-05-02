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
    
    // Map frontend fields to DB fields
    const productData = {
      ...body,
      title: body.name || body.title,
      images: body.images || (body.image ? [body.image] : []),
    };
    
    // Remove frontend-only or conflicting fields
    delete productData.name;
    delete productData.image;
    delete productData.id;
    delete productData._id;

    const product = new Product(productData);
    console.log("Saving product:", product);
    await product.save();
    
    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error("Create product error details:", error);
    if (error.code === 11000) {
      return NextResponse.json({ error: `Duplicate key error: ${JSON.stringify(error.keyValue)}` }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || "Failed to create product" }, { status: 500 });
  }
}
