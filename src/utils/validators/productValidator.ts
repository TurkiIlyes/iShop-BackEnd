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
    .notEmpty()
    .withMessage("Product title is required")
    .isLength({ min: 3 })
    .withMessage("must be at least 3 chars")
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
    .custom((images) => {
      try {
        const imagesArray = images.split(",");
        for (const image of imagesArray) {
          if (typeof image !== "string") {
            throw new Error();
          }
        }
        return true;
      } catch (err) {
        throw new Error("images should be an array of strings");
      }
    }),
  body("sku").optional().isString().withMessage("Product sku must be a string"),
  body("quantity")
    .notEmpty()
    .withMessage("Product quantity is required")
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  body("colors")
    .optional()
    .custom((colors) => {
      try {
        const parsedColors = JSON.parse(colors);

        console.log(colors);
        console.log(parsedColors);

        if (!Array.isArray(parsedColors)) {
          throw new Error();
        }
        for (const colorObj of parsedColors) {
          if (
            typeof colorObj !== "object" ||
            typeof colorObj.color !== "string" ||
            typeof colorObj.quantity !== "number"
          ) {
            throw new Error();
          }
        }
        return true;
      } catch (err) {
        throw new Error(
          "Available colors must be an array of objects with 'color' (string) and 'quantity' (number) properties"
        );
      }
    }),
  body("sizes")
    .optional()
    .custom((sizes) => {
      try {
        const parsedSizes = JSON.parse(sizes);

        if (!Array.isArray(parsedSizes)) {
          throw new Error();
        }
        for (const sizeObj of parsedSizes) {
          if (
            typeof sizeObj !== "object" ||
            typeof sizeObj.size !== "string" ||
            typeof sizeObj.quantity !== "number"
          ) {
            throw new Error();
          }
        }
        return true;
      } catch (err) {
        throw new Error(
          "Available sizes must be an array of objects with 'size' (string) and 'quantity' (number) properties"
        );
      }
    }),
  body("category")
    .notEmpty()
    .withMessage("Product must be belong to a category")
    .isMongoId()
    .withMessage("Invalid ID formate")
    .custom((category) =>
      Category.findById(category).then((category) => {
        if (!category) {
          return Promise.reject(
            new Error(`No category for this id: ${category}`)
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
    .notEmpty()
    .withMessage("Product title is required")
    .isLength({ min: 3 })
    .withMessage("must be at least 3 chars")
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
    .custom((images) => {
      try {
        const imagesArray = images.split(",");
        for (const image of imagesArray) {
          if (typeof image !== "string") {
            throw new Error();
          }
        }
        return true;
      } catch (err) {
        throw new Error("images should be an array of strings");
      }
    }),
  body("sku").optional().isString().withMessage("Product sku must be a string"),
  body("quantity")
    .notEmpty()
    .withMessage("Product quantity is required")
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  body("colors")
    .optional()
    .custom((colors) => {
      try {
        const parsedColors = JSON.parse(colors);

        console.log(colors);
        console.log(parsedColors);

        if (!Array.isArray(parsedColors)) {
          throw new Error();
        }
        for (const colorObj of parsedColors) {
          if (
            typeof colorObj !== "object" ||
            typeof colorObj.color !== "string" ||
            typeof colorObj.quantity !== "number"
          ) {
            throw new Error();
          }
        }
        return true;
      } catch (err) {
        throw new Error(
          "Available colors must be an array of objects with 'color' (string) and 'quantity' (number) properties"
        );
      }
    }),
  body("sizes")
    .optional()
    .custom((sizes) => {
      try {
        const parsedSizes = JSON.parse(sizes);

        if (!Array.isArray(parsedSizes)) {
          throw new Error();
        }
        for (const sizeObj of parsedSizes) {
          if (
            typeof sizeObj !== "object" ||
            typeof sizeObj.size !== "string" ||
            typeof sizeObj.quantity !== "number"
          ) {
            throw new Error();
          }
        }
        return true;
      } catch (err) {
        throw new Error(
          "Available sizes must be an array of objects with 'size' (string) and 'quantity' (number) properties"
        );
      }
    }),
  body("category")
    .notEmpty()
    .withMessage("Product must be belong to a category")
    .isMongoId()
    .withMessage("Invalid ID formate")
    .custom((category) =>
      Category.findById(category).then((category) => {
        if (!category) {
          return Promise.reject(
            new Error(`No category for this id: ${category}`)
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
