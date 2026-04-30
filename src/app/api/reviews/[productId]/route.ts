import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import { Review } from "@/models/Review";
import { Order } from "@/models/Order";

// GET all reviews for a product
export async function GET(
  req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    await connectToDatabase();
    const { productId } = await params;
    const reviews = await Review.find({ productId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    return NextResponse.json([], { status: 500 });
  }
}

// POST a new review
export async function POST(
  req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Please sign in to leave a review" }, { status: 401 });
    }

    const { productId } = await params;
    const userId = (session.user as any).id;
    const userName = session.user.name || "Anonymous";

    // Check if user has purchased this product
    await connectToDatabase();
    const hasPurchased = await Order.findOne({
      user: userId,
      "items.productId": productId,
      status: { $in: ["Processing", "Shipped", "Delivered"] },
    });

    if (!hasPurchased) {
      return NextResponse.json(
        { error: "You can only review products you have purchased" },
        { status: 403 }
      );
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({ productId, userId });
    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this product" },
        { status: 409 }
      );
    }

    const { rating, comment } = await req.json();

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
    }
    if (!comment || comment.trim().length === 0) {
      return NextResponse.json({ error: "Review comment is required" }, { status: 400 });
    }

    const review = await Review.create({
      productId,
      userId,
      userName,
      rating: Math.round(rating),
      comment: comment.trim().slice(0, 500),
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ error: "You have already reviewed this product" }, { status: 409 });
    }
    console.error("Failed to create review:", error);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
