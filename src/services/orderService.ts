import asyncHandler from "express-async-handler";
import Order, { OrderType, OrderItemType } from "../models/Order";
import Product from "../models/Product";
import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError";
import Basket from "../models/Basket";

// Get all orders for admin
export const getOrders = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const orders = await Order.find().populate("items.productId");
    res.status(200).json({ data: orders });
  }
);

// Get a specific order by ID for admin or the logged-in user
export const getOrder = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate("items.productId");
    if (!order) {
      return next(new ApiError("Order not found", 404));
    }
    res.status(200).json({ data: order });
  }
);

// Create a new order for a logged-in user
export const createOrder = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const { items, paymentType } = req.body;

    const newOrder = await Order.create({
      userId,
      items,
      paymentType,
    });

    res.status(201).json({ message: "Order created", data: newOrder });
  }
);

// Update an order (admin only)
export const updateOrder = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { orderId } = req.params;
    const updates = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(orderId, updates, {
      new: true,
    }).populate("items.productId");

    if (!updatedOrder) {
      return next(new ApiError("Order not found", 404));
    }
    res.status(200).json({ message: "Order updated", data: updatedOrder });
  }
);

// Delete an order (admin only)
export const deleteOrder = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { orderId } = req.params;
    const deletedOrder = await Order.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return next(new ApiError("Order not found", 404));
    }
    res.status(200).json({ message: "Order deleted" });
  }
);

// Cancel an order for a logged-in user
export const cancelOrder = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { orderId } = req.params;
    const order = await Order.findOne({ _id: orderId, userId: req.user._id });

    if (!order) {
      return next(new ApiError("Order not found or unauthorized", 404));
    }

    order.status = "cancelled";
    await order.save();

    res.status(200).json({ message: "Order cancelled", data: order });
  }
);

// Get all orders for the logged-in user
export const getLoggedUserOrders = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const orders = await Order.find({ userId: req.user._id }).populate(
      "items.productId"
    );
    res.status(200).json({ data: orders });
  }
);

// Get a specific order for the logged-in user
export const getLoggedUserOrder = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { orderId } = req.params;
    const order = await Order.findOne({
      _id: orderId,
      userId: req.user._id,
    }).populate("items.productId");

    if (!order) {
      return next(new ApiError("Order not found or unauthorized", 404));
    }

    res.status(200).json({ data: order });
  }
);

// Create a new order for a logged-in user
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

    const newOrder = await Order.create({
      userId,
      items: basket.items,
      paymentType,
      totalPrice: basket.totalPrice,
      address,
    });

    await Basket.findOneAndUpdate({ userId }, { items: [] });

    res.status(201).json({ message: "Order created", data: newOrder });
  }
);

// Cancel an order for a logged-in user
export const cancelLoggedUserOrder = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { orderId } = req.params;
    const order = await Order.findOne({ _id: orderId, userId: req.user._id });

    if (!order) {
      return next(new ApiError("Order not found or unauthorized", 404));
    }

    order.status = "cancelled";
    await order.save();

    res.status(200).json({ message: "Order cancelled", data: order });
  }
);
