import mongoose, { Schema, Document } from "mongoose";
import slugify from "slugify";

export interface ProductType extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  price: number;
  discount: number;
  priceAfterDiscount?: number;
  imageCover: string;
  images?: string[];
  sku?: string;
  quantity: number;
  colors?: { _id: mongoose.Types.ObjectId; color: string; quantity: number }[];
  sizes?: { size: string; quantity: number }[];
  category: mongoose.Types.ObjectId;
  sold: number;
  ratingsAverage?: number;
  ratingsQuantity?: number;
  status: "InStock" | "OutOfStock" | "Discontinued";
}

const productSchema = new Schema<ProductType>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "Too short product title"],
      maxlength: [100, "Too long product title"],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      minlength: [20, "Too short product description"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      trim: true,
      min: [0, "Price cannot be negative"],
      max: [200000, "Too high product price"],
    },
    discount: {
      type: Number,
    },
    priceAfterDiscount: {
      type: Number,
    },
    imageCover: {
      type: String,
      required: [true, "Product Image cover is required"],
    },
    images: [String],
    sku: String,
    quantity: {
      type: Number,
      required: [true, "Product quantity is required"],
    },
    colors: [
      {
        color: String,
        quantity: Number,
      },
    ],
    sizes: [
      {
        size: String,
        quantity: Number,
      },
    ],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Product must be belong to category"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    ratingsAverage: {
      type: Number,
      min: [1, "Rating must be above or equal 1.0"],
      max: [5, "Rating must be below or equal 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["InStock", "OutOfStock", "Discontinued"],
      default: "InStock",
    },
  },
  { timestamps: true }
);

productSchema.pre("save", function (next) {
  // Slug generation
  this.slug = slugify(this.title, { lower: true });
  // Price Calculation (if discount exists)
  if (this.discount) {
    this.priceAfterDiscount = parseFloat(
      (this.price * (1 - this.discount / 100)).toFixed(2)
    );
  }

  // Image Cover
  this.imageCover = this.imageCover || "https://via.placeholder.com/150";

  next();
});

const ProductModel = mongoose.model<ProductType>("product", productSchema);

export default ProductModel;
