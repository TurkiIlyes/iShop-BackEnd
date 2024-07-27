import { body, param } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware";
import { bodySanitizer } from "../../middlewares/sanitizer";

export const getOrderValidator = [
  param("orderId").isMongoId().withMessage("Invalid order ID format"),
  validatorMiddleware,
];

export const createOrderValidator = [
  bodySanitizer(
    "paymentType",
  ),
  body("paymentType")
    .isIn(["onDelivery", "creditCard", "paypal"])
    .withMessage("Invalid payment type"),
  validatorMiddleware,
];

export const updateOrderValidator = [
  param("orderId").isMongoId().withMessage("Invalid order ID format"),
  body("status").optional().isString().withMessage("Status must be a string"),
  validatorMiddleware,
];

export const deleteOrderValidator = [
  param("orderId").isMongoId().withMessage("Invalid order ID format"),
  validatorMiddleware,
];
