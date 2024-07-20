// import express from "express";
// import {
//   getOrderValidator,
//   createOrderValidator,
//   updateOrderValidator,
//   deleteOrderValidator,
// } from "../utils/validators/orderValidator";
// import {
//   getOrders,
//   getOrder,
//   createOrder,
//   updateOrder,
//   deleteOrder,
// } from "../services/orderService";
// import { protect, allowedTo } from "../services/authService";

// const router = express.Router();
// router.use(protect);
// /**
//  * @route   GET /orders
//  * @desc    Get all orders
//  * @access  Private (admin only)
//  */
// router
//   .route("/")
//   .get(allowedTo("admin"), getOrders)

//   /**
//    * @route   POST /orders
//    * @desc    Create a new order
//    * @access  Private (authenticated users only)
//    */
//   .post(allowedTo("user"), createOrderValidator, createOrder);

// /**
//  * @route   GET /orders/:id
//  * @desc    Get an order by ID
//  * @access  Private (admin and user who created the order)
//  */
// router
//   .route("/:id")
//   .get(getOrderValidator, getOrder)

//   /**
//    * @route   PUT /orders/:id
//    * @desc    Update an order by ID
//    * @access  Private (admin only)
//    */
//   .put(allowedTo("admin"), updateOrderValidator, updateOrder)

//   /**
//    * @route   DELETE /orders/:id
//    * @desc    Delete an order by ID
//    * @access  Private (admin only)
//    */
//   .delete(allowedTo("admin"), deleteOrderValidator, deleteOrder);

// export default router;
