import { body, param } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware";
import { paramsSanitizer, bodySanitizer } from "../../middlewares/sanitizer";

// Add to wishlist validator
export const addToWishListValidator = [
  paramsSanitizer("productId"),
  param("productId").isMongoId().withMessage("Invalid Product id format"),
  validatorMiddleware,
];

// Remove from wishlist validator
export const removeFromWishListValidator = [
  paramsSanitizer("productId"),
  param("productId").isMongoId().withMessage("Invalid Product id format"),
  validatorMiddleware,
];
