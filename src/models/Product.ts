import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProductVariant {
  size: string;
  stock: number;
}

export interface IProduct extends Document {
  id: string; // The original simple ID used in products.ts (e.g., "1", "2")
  title: string;
  price: number;
  description: string;
  images: string[];
  category: string;
  variants: IProductVariant[];
  isNewDrop: boolean;
  isFeatured: boolean;
}

const ProductSchema: Schema<IProduct> = new Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    images: { type: [String], required: true },
    category: { type: String, default: "Tshirts" },
    variants: [
      {
        size: { type: String, required: true },
        stock: { type: Number, required: true, default: 0 },
      },
    ],
    isNewDrop: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Prevent model overwrite upon hot reloads in Next.js
const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
