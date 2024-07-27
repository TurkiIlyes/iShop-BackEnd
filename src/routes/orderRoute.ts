import express from "express";
import {
  getOrderValidator,
  createOrderValidator,
  updateOrderValidator,
  deleteOrderValidator,
} from "../utils/validators/orderValidator";
import {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
  cancelOrder,
  getLoggedUserOrders,
  getLoggedUserOrder,
  createLoggedUserOrder,
  cancelLoggedUserOrder,
} from "../services/orderService";
import { protect, allowedTo } from "../services/authService";
import extractUserId from "../middlewares/extractUserId";

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(extractUserId, getLoggedUserOrders)
  .post(createOrderValidator, createLoggedUserOrder);

router
  .route("/:orderId")
  .get(extractUserId, getOrderValidator, getLoggedUserOrder)
  .put(extractUserId, cancelLoggedUserOrder);

router.route("/").get(allowedTo("admin"), getOrders);

router
  .route("/:orderId")
  .get(allowedTo("admin"), getOrderValidator, getOrder)

  .put(allowedTo("admin"), updateOrderValidator, updateOrder)

  .delete(allowedTo("admin"), deleteOrderValidator, deleteOrder);

export default router;
