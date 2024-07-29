import express from "express";
import {
  getOrderValidator,
  createOrderValidator,
  updateOrderValidator,
} from "../utils/validators/orderValidator";
import {
  getOrders,
  getOrder,
  updateOrder,
  getLoggedUserOrders,
  getLoggedUserOrder,
  createLoggedUserOrder,
  cancelLoggedUserOrder,
} from "../services/orderService";
import { protect, allowedTo } from "../services/authService";
import {
  resizeProductImages,
  uploadProductImages,
} from "../middlewares/uploadImage/uploadProductImage";

const router = express.Router();

router.use(protect);

router
  .route("/user")
  .get(getLoggedUserOrders)
  .post(
    createOrderValidator,
    uploadProductImages,
    resizeProductImages,
    createLoggedUserOrder
  );

router
  .route("/user/:id")
  .get(getOrderValidator, getLoggedUserOrder)
  .put(cancelLoggedUserOrder);

router.route("/admin").get(allowedTo("admin"), getOrders);

router
  .route("/admin/:id")
  .get(allowedTo("admin"), getOrderValidator, getOrder)
  .put(
    allowedTo("admin"),
    uploadProductImages,
    resizeProductImages,
    updateOrderValidator,
    updateOrder
  );

export default router;
