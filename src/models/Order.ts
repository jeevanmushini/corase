import mongoose, { Schema, Document } from "mongoose";

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  selectedSize: string;
  quantity: number;
}

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  items: OrderItem[];
  shippingAddress: {
    fullName: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  subtotal: number;
  shippingPrice: number;
  totalPrice: number;
  discount: number;
  coupon?: string;
  isPaid: boolean;
  paidAt?: Date;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  trackingNumber?: string;
  carrier?: string;
  shippedAt?: Date;
  deliveredAt?: Date;
}

const OrderItemSchema = new Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  selectedSize: { type: String, required: true },
  quantity: { type: Number, required: true },
});

const OrderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [OrderItemSchema],
    shippingAddress: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: { type: String, required: true, default: "Razorpay" },
    subtotal: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    coupon: { type: String },
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    trackingNumber: { type: String },
    carrier: { type: String },
    shippedAt: { type: Date },
    deliveredAt: { type: Date },
  },
  { timestamps: true }
);

export const Order = mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
