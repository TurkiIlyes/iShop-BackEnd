import mongoose, { Schema, Document } from "mongoose";

export interface BasketItemType {
  productId: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
  total: number;
}

export interface BasketType extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  items: BasketItemType[];
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

const basketItemSchema = new Schema<BasketItemType>({
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

const basketSchema = new Schema<BasketType>(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    items: [basketItemSchema],
    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

basketSchema.pre("save", function (next) {
  this.totalPrice = 0;

  this.items.forEach((item) => {
    item.total = item.price * item.quantity;
    this.totalPrice += item.total;
  });

  next();
});

const BasketModel = mongoose.model<BasketType>("Basket", basketSchema);

export default BasketModel;
