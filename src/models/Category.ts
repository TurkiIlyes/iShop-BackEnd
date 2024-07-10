import mongoose, { Schema, Document } from "mongoose";

export interface CategoryType extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  image: string;
}

const categorySchema = new Schema<CategoryType>(
  {
    name: {
      type: String,
      required: [true, 'Category required'],
      unique: true,
      minlength: [3, 'Too short category name'],
      maxlength: [32, 'Too long category name'],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

const CategoryModel = mongoose.model<CategoryType>("category", categorySchema);

export default CategoryModel;
