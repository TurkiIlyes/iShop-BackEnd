import slugify from "slugify";
import { body, param } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware";
import Category from "../../models/Category";
import { bodySanitizer, paramsSanitizer } from "../../middlewares/sanitizer";

export const createProductValidator = [
  bodySanitizer(
    "title",
    "description",
    "price",
    "discount",
    "imageCover",
    "images",
    "sku",
    "quantity",
    "colors",
    "sizes",
    "category",
    "ratingsAverage",
    "ratingsQuantity",
    "status",
    "sold"
  ),
  body("title")
    .isLength({ min: 3 })
    .withMessage("must be at least 3 chars")
    .notEmpty()
    .withMessage("Product required")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  body("description")
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ max: 2000 })
    .withMessage("Too long description"),
  body("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isNumeric()
    .withMessage("Product price must be a number")
    .isLength({ max: 32 })
    .withMessage("To long price"),
  body("discount")
    .optional()
    .isNumeric()
    .withMessage("Product discount must be a number"),
  body("imageCover")
    .notEmpty()
    .withMessage("Product imageCover is required")
    .isString()
    .withMessage("Product imageCover must be a string"),
  body("images")
    .optional()
    .isArray()
    .withMessage("images should be array of string")
    .custom((images) => {
      for (const image of images) {
        if (typeof image !== "string") {
          throw new Error("images must be an array of strings");
        }
      }
      return true;
    }),
  body("sku")
    .optional()
    .withMessage("Product sku is required")
    .isString()
    .withMessage("Product sku must be a string"),
  body("quantity")
    .notEmpty()
    .withMessage("Product quantity is required")
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  body("colors")
    .optional()
    .isArray()
    .withMessage("available colors should be array of object")
    .custom((colors) => {
      for (const colorObj of colors) {
        if (
          typeof colorObj !== "object" ||
          typeof colorObj.color !== "string" ||
          typeof colorObj.quantity !== "number"
        ) {
          throw new Error(
            "available colors must be an array of objects with 'color' (string) and 'quantity' (number) properties"
          );
        }
      }
      return true;
    }),
  body("sizes")
    .optional()
    .isArray()
    .withMessage("available sizes should be array of string")
    .custom((sizes) => {
      for (const sizeObj of sizes) {
        if (
          typeof sizeObj !== "object" ||
          typeof sizeObj.size !== "string" ||
          typeof sizeObj.quantity !== "number"
        ) {
          throw new Error(
            "available sizes must be an array of objects with 'size' (string) and 'quantity' (number) properties"
          );
        }
      }
      return true;
    }),
  body("category")
    .notEmpty()
    .withMessage("Product must be belong to a category")
    .isMongoId()
    .withMessage("Invalid ID formate")
    .custom((categoryId) =>
      Category.findById(categoryId).then((category) => {
        if (!category) {
          return Promise.reject(
            new Error(`No category for this id: ${categoryId}`)
          );
        }
      })
    ),
  body("sold")
    .optional()
    .isNumeric()
    .withMessage("Product sold must be a number"),
  body("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("ratingsAverage must be a number")
    .isLength({ min: 1 })
    .withMessage("Rating must be above or equal 1.0")
    .isLength({ max: 5 })
    .withMessage("Rating must be below or equal 5.0"),
  body("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratingsQuantity must be a number"),
  body("status")
    .optional()
    .isIn(["InStock", "OutOfStock", "Discontinued"])
    .withMessage("status must be InStock, OutOfStock, or Discontinued"),

  validatorMiddleware,
];

export const updateProductValidator = [
  bodySanitizer(
    "title",
    "description",
    "price",
    "discount",
    "imageCover",
    "images",
    "sku",
    "quantity",
    "colors",
    "sizes",
    "category",
    "ratingsAverage",
    "ratingsQuantity",
    "status",
    "sold"
  ),
  body("title")
    .isLength({ min: 3 })
    .withMessage("must be at least 3 chars")
    .optional()
    .withMessage("Product required")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  body("description")
    .optional()
    .withMessage("Product description is required")
    .isLength({ max: 2000 })
    .withMessage("Too long description"),
  body("price")
    .optional()
    .withMessage("Product price is required")
    .isNumeric()
    .withMessage("Product price must be a number")
    .isLength({ max: 32 })
    .withMessage("To long price"),
  body("discount")
    .optional()
    .isNumeric()
    .withMessage("Product discount must be a number"),
  body("imageCover")
    .optional()
    .withMessage("Product imageCover is required")
    .isString()
    .withMessage("Product imageCover must be a string"),
  body("images")
    .optional()
    .isArray()
    .withMessage("images should be array of string")
    .custom((images) => {
      for (const image of images) {
        if (typeof image !== "string") {
          throw new Error("images must be an array of strings");
        }
      }
      return true;
    }),
  body("sku")
    .optional()
    .withMessage("Product sku is required")
    .isString()
    .withMessage("Product sku must be a string"),
  body("quantity")
    .optional()
    .withMessage("Product quantity is required")
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  body("colors")
    .optional()
    .isArray()
    .withMessage("available colors should be array of object")
    .custom((colors) => {
      for (const colorObj of colors) {
        if (
          typeof colorObj !== "object" ||
          typeof colorObj.color !== "string" ||
          typeof colorObj.quantity !== "number"
        ) {
          throw new Error(
            "available colors must be an array of objects with 'color' (string) and 'quantity' (number) properties"
          );
        }
      }
      return true;
    }),
  body("sizes")
    .optional()
    .isArray()
    .withMessage("available sizes should be array of string")
    .custom((sizes) => {
      for (const sizeObj of sizes) {
        if (
          typeof sizeObj !== "object" ||
          typeof sizeObj.size !== "string" ||
          typeof sizeObj.quantity !== "number"
        ) {
          throw new Error(
            "available sizes must be an array of objects with 'size' (string) and 'quantity' (number) properties"
          );
        }
      }
      return true;
    }),
  body("category")
    .optional()
    .withMessage("Product must be belong to a category")
    .isMongoId()
    .withMessage("Invalid ID formate")
    .custom((categoryId) =>
      Category.findById(categoryId).then((category) => {
        if (!category) {
          return Promise.reject(
            new Error(`No category for this id: ${categoryId}`)
          );
        }
      })
    ),
  body("sold")
    .optional()
    .isNumeric()
    .withMessage("Product sold must be a number"),
  body("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("ratingsAverage must be a number")
    .isLength({ min: 1 })
    .withMessage("Rating must be above or equal 1.0")
    .isLength({ max: 5 })
    .withMessage("Rating must be below or equal 5.0"),
  body("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratingsQuantity must be a number"),
  body("status")
    .optional()
    .isIn(["InStock", "OutOfStock", "Discontinued"])
    .withMessage("status must be InStock, OutOfStock, or Discontinued"),

  validatorMiddleware,
];

export const deleteProductValidator = [
  paramsSanitizer("id"),
  param("id").isMongoId().withMessage("Invalid ID formate"),
  validatorMiddleware,
];

export const getProductValidator = [
  paramsSanitizer("id"),
  param("id").isMongoId().withMessage("Invalid ID formate"),
  validatorMiddleware,
];
