import mongoose, { Schema, Document } from "mongoose";
import slugify from "slugify";

export interface CategoryType extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  image: string;
  status: "Active" | "Inactive" | "Archived";
}

const categorySchema = new Schema<CategoryType>(
  {
    name: {
      type: String,
      required: [true, "Category required"],
      unique: true,
      minlength: [3, "Too short category name"],
      maxlength: [32, "Too long category name"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    image: String,
    status: {
      type: String,
      enum: ["Active", "Inactive", "Archived"],
      default: "Active",
    },
  },
  { timestamps: true }
);

categorySchema.pre("save", function (next) {
  // Slug generation
  this.slug = slugify(this.name, { lower: true });
  // Image
  this.image = this.image || "https://via.placeholder.com/150";
  next();
});

const Category = mongoose.model<CategoryType>("Category", categorySchema);

export default Category;
