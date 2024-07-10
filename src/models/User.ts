import mongoose, { Schema,Document } from 'mongoose' ;

export interface UserType extends Document {
  _id: mongoose.Types.ObjectId,
  fullName:string,
  email: string,
  phone: string,
  password:string,
  address?: {
    details: string,
    governorate: string,
    city: string,
    postalCode: string,
  },
  wishList?:  mongoose.Types.ObjectId[],
  basketList?: mongoose.Types.ObjectId[],
  role: 'user' | 'admin',
  activeAccount:boolean,
  signUpCode?: string,
  signUpCodeExpires?: Date,
  pwResetCode?: string,
  pwResetExpires?: Date,
  pwResetVerified?: boolean,
  pwUpdatedAt:Date,
}

const userSchema = new Schema<UserType>(
  {
    fullName: {
      type: String,
      trim: true,
      required: [true, "fullName required"],
    },
    email: {
      type: String,
      required: [true, "email required"],
      unique: true,
      lowercase: true,
    },
    phone: String,
    password: {
      type: String,
      required: [true, "password required"],
      minlength: [8, "Too short password"],
    },
    address: {
      details: String,
      governorate: String,
      city: String,
      postalCode: String,
    },
    wishList: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
      },
    ],
    basketList: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
      },
    ],
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    activeAccount: {
      type: Boolean,
      default: false,
    },
    signUpCode: String,
    signUpCodeExpires: Date,
    pwResetCode: String,
    pwResetExpires: Date,
    pwResetVerified: Boolean,
    pwUpdatedAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model<UserType>("user", userSchema);

export default UserModel;
