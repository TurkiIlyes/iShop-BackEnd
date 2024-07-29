import mongoose, { Schema, Document } from "mongoose";
import { BasketItemType } from "./Basket";

export interface AddressType {
  details: string;
  governorate: string;
  city: string;
  postalCode: string;
}

export interface OrderType extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  email: string;
  phone?: string;
  items: BasketItemType[];
  totalPrice: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "unpaid" | "paid";
  paymentType: "onDelivery" | "creditCard" | "paypal";
  address: AddressType;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<BasketItemType>({
  productId: {
    type: mongoose.Schema.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  total: {
    type: Number,
    required: true,
    min: 0,
  },
});

const orderSchema = new Schema<OrderType>(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    items: [orderItemSchema],
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid"],
      default: "unpaid",
    },
    paymentType: {
      type: String,
      enum: ["onDelivery", "creditCard", "paypal"],
      required: true,
    },
    address: {
      details: {
        type: String,
        required: true,
      },
      governorate: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      postalCode: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true }
);

orderSchema.pre("save", function (next) {
  this.totalPrice = this.items.reduce((total, item) => total + item.total, 0);
  next();
});

const OrderModel = mongoose.model<OrderType>("Order", orderSchema);

export default OrderModel;
