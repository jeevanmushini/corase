import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Product from "@/models/Product";
import { products as mockProducts } from "@/data/products";

export async function POST() {
  try {
    await connectToDatabase();

    // Clear existing products to prevent duplicates during testing
    await Product.deleteMany({});

    // Map mock data to our new schema structure
    const seedData = mockProducts.map((p) => {
      const isOutOfStock = p.id === "3";
      const stockAmount = isOutOfStock ? 0 : 50;

      return {
        id: p.id,
        title: p.name,
        price: p.price,
        description: p.description,
        images: [p.image],
        isNewDrop: p.isNewDrop ?? false,
        isFeatured: p.isFeatured ?? false,
        variants: (p.sizes ?? []).map((size: string) => ({
          size,
          stock: stockAmount,
        })),
      };
    });

    const inserted = await Product.insertMany(seedData);

    return NextResponse.json({ message: "Seed successful", count: inserted.length });
  } catch (error) {
    console.error("Error seeding products:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
