import { body, param } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware";
import { bodySanitizer, paramsSanitizer } from "../../middlewares/sanitizer";

export const createCategoryValidator = [
  bodySanitizer("name", "image", "status"),
  body("name")
    .notEmpty()
    .withMessage("Category required")
    .isLength({ min: 3 })
    .withMessage("Too short category name")
    .isLength({ max: 32 })
    .withMessage("Too long category name"),
  body("image").optional().isString().withMessage("Invalid category image"),
  body("status")
    .optional()
    .isIn(["Active", "Inactive", "Archived"])
    .withMessage("Invalid category status"),
  validatorMiddleware,
];

export const updateCategoryValidator = [
  paramsSanitizer("id"),
  bodySanitizer("name", "image", "status"),
  param("id").isMongoId().withMessage("Invalid category id format"),
  body("name")
    .optional()
    .withMessage("Category required")
    .isLength({ min: 3 })
    .withMessage("Too short category name")
    .isLength({ max: 32 })
    .withMessage("Too long category name"),
  body("image").optional().isString().withMessage("Invalid category image"),
  body("status")
    .optional()
    .isIn(["Active", "Inactive", "Archived"])
    .withMessage("Invalid category status"),
  validatorMiddleware,
];

export const deleteCategoryValidator = [
  paramsSanitizer("id"),
  param("id").isMongoId().withMessage("Invalid category id format"),
  validatorMiddleware,
];

export const getCategoryValidator = [
  paramsSanitizer("id"),
  param("id").isMongoId().withMessage("Invalid category id format"),
  validatorMiddleware,
];
