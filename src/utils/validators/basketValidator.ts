// basketValidator.js
import { body, param } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware";
import { bodySanitizer, paramsSanitizer } from "../../middlewares/sanitizer";

export const addItemValidator = [
  bodySanitizer("productId", "quantity"),
  body("productId").isMongoId().withMessage("Invalid Product ID format"),
  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
  validatorMiddleware,
];

export const updateBasketValidator = [
  bodySanitizer("productId", "newQuantity"),
  body("productId").isMongoId().withMessage("Invalid Product ID format"),
  body("newQuantity")
    .notEmpty()
    .withMessage("New quantity is required")
    .isInt({ min: 1 })
    .withMessage("New quantity must be at least 1"),
  validatorMiddleware,
];

export const removeItemValidator = [
  paramsSanitizer("id", "itemId"),
  param("id").isMongoId().withMessage("Invalid user ID format"),
  param("itemId").isMongoId().withMessage("Invalid item ID format"),
  validatorMiddleware,
];
