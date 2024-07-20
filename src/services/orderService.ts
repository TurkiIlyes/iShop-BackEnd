import factory from "./factoryService";
import Order, { OrderType } from "../models/Order";

// @desc    Get list of orders
// @route   GET /api/v1/orders
// @access  Private
export const getOrders = factory.getAll<OrderType>(Order);

// @desc    Get specific order by id
// @route   GET /api/v1/orders/:id
// @access  Private
export const getOrder = factory.getOne<OrderType>(Order);

// @desc    Create order
// @route   POST /api/v1/orders
// @access  Private
export const createOrder = factory.createOne<OrderType>(Order);

// @desc    Update specific order
// @route   PUT /api/v1/orders/:id
// @access  Private
export const updateOrder = factory.updateOne<OrderType>(Order);

// @desc    Delete specific order
// @route   DELETE /api/v1/orders/:id
// @access  Private
export const deleteOrder = factory.deleteOne<OrderType>(Order);
