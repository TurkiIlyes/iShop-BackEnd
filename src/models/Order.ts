import mongoose, { Schema, Document } from "mongoose";

export interface OrderType extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  items: {
    productId: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
    total: number;
  }[];
  totalAmount: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  paymentMethod: "CreditCard" | "PayPal" | "CashOnDelivery";
  shippingAddress: {
    details: string;
    governorate: string;
    city: string;
    postalCode: string;
  };
  orderedAt: Date;
  deliveredAt?: Date;
}

const orderSchema = new Schema<OrderType>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, "Quantity cannot be less than 1"],
        },
        price: {
          type: Number,
          required: true,
          min: [0, "Price cannot be negative"],
        },
        total: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: [0, "Total amount cannot be negative"],
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    paymentMethod: {
      type: String,
      enum: ["CreditCard", "PayPal", "CashOnDelivery"],
      required: true,
    },
    shippingAddress: {
      details: {
        type: String,
        required: [true, "Shipping  address details is required"],
      },
      governorate: {
        type: String,
        required: [true, "Shipping governorate is required"],
      },
      city: {
        type: String,
        required: [true, "Shipping city is required"],
      },
      postalCode: {
        type: String,
        required: [true, "Shipping postalcode is required"],
      },
    },
    orderedAt: {
      type: Date,
      default: Date.now,
    },
    deliveredAt: Date,
  },
  { timestamps: true }
);

orderSchema.pre("save", function (next) {
  this.items.forEach((item) => {
    item.total = item.price * item.quantity;
  });

  this.totalAmount = this.items.reduce((acc, item) => acc + item.total, 0);

  next();
});

const OrderModel = mongoose.model<OrderType>("Order", orderSchema);

export default OrderModel;
