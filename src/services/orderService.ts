import asyncHandler from "express-async-handler";
import Order, { OrderType } from "../models/Order";
import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError";
import Basket from "../models/Basket";
import factory from "./factoryService";
import User from "../models/User";

//  (admin only)
export const updateOrder = factory.updateOne<OrderType>(Order);

export const getOrder = factory.getOne<OrderType>(Order);

export const getOrders = factory.getAll<OrderType>(Order);

// (logged-in user)
export const createLoggedUserOrder = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { _id: userId, address } = req.user;
    const { paymentType } = req.body;

    if (
      !address?.details ||
      !address?.governorate ||
      !address?.city ||
      !address?.postalCode
    ) {
      return next(
        new ApiError("Please fill all the required address fields", 400)
      );
    }

    const basket = await Basket.findOne({ userId });

    if (!basket) {
      return next(new ApiError("Basket not found", 404));
    }
    if (basket.items.length === 0) {
      return next(new ApiError("Basket is empty", 400));
    }
    const user = await User.findById(userId);

    if (!user) {
      return next(new ApiError("User not found", 404));
    }

    const newOrder = await Order.create({
      userId,
      email: user.email,
      items: basket.items,
      paymentType,
      totalPrice: basket.totalPrice,
      address,
    });

    await Basket.findOneAndUpdate({ userId }, { items: [] });

    res.status(201).json({ message: "Order created", data: newOrder });
  }
);
export const cancelLoggedUserOrder = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user._id;
    const { id } = req.params;
    const order = await Order.findOne({ _id: id, userId });

    if (!order) {
      return next(new ApiError("Order not found or unauthorized", 404));
    }

    order.status = "cancelled";
    await order.save();

    res.status(200).json({ message: "Order cancelled", data: order });
  }
);
export const getLoggedUserOrder = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user._id;
    const { id } = req.params;
    const order = await Order.findOne({
      _id: id,
      userId,
    }).populate("items.productId");

    if (!order) {
      return next(new ApiError("Order not found ", 404));
    }

    res.status(200).json({ data: order });
  }
);
export const getLoggedUserOrders = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user._id;
    const orders = await Order.find({ userId });

    res.status(200).json({ data: orders });
  }
);
