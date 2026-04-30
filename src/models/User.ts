import mongoose, { Schema, Document } from "mongoose";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  selectedSize: string;
  quantity: number;
}

interface WishlistItem {
  productId: string;
  name: string;
  price: number;
  image: string;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  image?: string;
  provider: "credentials" | "google" | "github";
  role: "user" | "admin";
  cart: CartItem[];
  wishlist: WishlistItem[];
}

const CartItemSchema = new Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  selectedSize: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
});

const WishlistItemSchema = new Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
});

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Optional for OAuth users
    image: { type: String },
    provider: { type: String, enum: ["credentials", "google", "github"], default: "credentials" },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    cart: [CartItemSchema],
    wishlist: [WishlistItemSchema],
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
