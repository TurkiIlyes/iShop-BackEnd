import { body, param } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware";

export const getOrderValidator = [
  param("orderId").isMongoId().withMessage("Invalid order ID format"),
  validatorMiddleware,
];

export const createOrderValidator = [
  body("items")
    .isArray({ min: 1 })
    .withMessage("Items are required and must be an array"),
  body("paymentType")
    .isString()
    .withMessage("Payment type is required and must be a string"),
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
