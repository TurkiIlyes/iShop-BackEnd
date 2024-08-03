import asyncHandler from "express-async-handler";
import User from "../models/User";
import ApiError from "../utils/ApiError";
import { Request, Response, NextFunction } from "express";
import Product from "../models/Product";

// @desc    Get logged-in user's wishlist
// @route   GET /wishlist/me
// @access  Private
export const getLoggedUserWishList = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user._id;
    const user = await User.findById(id).populate("wishList");

    if (!user) {
      return next(new ApiError("User not found", 404));
    }

    res.status(200).json({
      status: "success",
      results: user.wishList.length,
      data: user.wishList,
    });
  }
);

// @desc    Add product to wishlist
// @route   PUT /wishlist/:productId
// @access  Private
export const addToWishList = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user._id);
    const productId = req.params.productId;

    if (!user) {
      return next(new ApiError("User not found", 404));
    }
    const product = await Product.findById(productId);
    if (!product) {
      return next(new ApiError("Product not found", 404));
    }

    if (user.wishList.includes(product._id)) {
      return next(new ApiError("Product already in wishlist", 400));
    }

    user.wishList.push(product._id);
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Product added to wishlist",
    });
  }
);

// @desc    Remove product from wishlist
// @route   DELETE /wishlist/:productId
// @access  Private
export const removeFromWishList = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user._id);
    const productId = req.params.productId;

    if (!user) {
      return next(new ApiError("User not found", 404));
    }
    const product = await Product.findById(productId);
    if (!product) {
      return next(new ApiError("Product not found", 404));
    }

    const index = user.wishList.indexOf(product._id);
    if (index === -1) {
      return next(new ApiError("Product not found in wishlist", 404));
    }

    user.wishList.splice(index, 1);
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Product removed from wishlist",
    });
  }
);

export const clearWishList = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user._id;
    const user = await User.findById(id);

    if (!user) {
      return next(new ApiError("User not found", 404));
    }

    user.wishList = [];
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Wishlist cleared",
    });
  }
);
