import { body, param, query } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware";
import {
  paramsSanitizer,
  querySanitizer,
  bodySanitizer,
} from "../../middlewares/sanitizer";

// LOGED USER ONLY
export const updateLoggedUserValidator = [
  paramsSanitizer("id"),
  bodySanitizer("fullName", "email", "phone", "activeAccount", "address"),
  param("id").isMongoId().withMessage("Invalid User id format"),
  body("fullName")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Too short fullName")
    .isLength({ max: 20 })
    .withMessage("too long fullName"),
  body("email")
    .optional()
    .withMessage("email is required")
    .isEmail()
    .withMessage("Invalid email address"),
  body("phone")
    .optional()
    .isMobilePhone(["ar-TN"])
    .withMessage("Invalid phone number only accepted TN Phone numbers"),
  body("activeAccount")
    .optional()
    .withMessage("activeAccount is required")
    .isBoolean()
    .withMessage("activeAccount must be a boolean"),
  body("address")
    .optional()
    .isObject()
    .withMessage("address must be an object")
    .custom((address) => {
      const { details, governorate, city, postalCode } = address;
      if (details && typeof details !== "string") {
        throw new Error("details must be a string");
      }
      if (governorate && typeof governorate !== "string") {
        throw new Error("governorate must be a string");
      }
      if (city && typeof city !== "string") {
        throw new Error("city must be a string");
      }
      if (postalCode && typeof postalCode !== "string") {
        throw new Error("postalCode must be a string");
      }

      return true;
    }),
  validatorMiddleware,
];
export const updateLoggedUserPasswordValidator = [
  paramsSanitizer("id"),
  bodySanitizer("currentPassword", "password", "confirmPassword"),
  param("id").isMongoId().withMessage("Invalid User id format"),
  body("currentPassword")
    .notEmpty()
    .withMessage("Password is required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/,
      "i"
    )
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long"
    ),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/,
      "i"
    )
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long"
    )
    .custom((password, { req }) => {
      if (password !== req.body.confirmPassword) {
        throw new Error("Password Confirmation incorrect");
      }
      return true;
    }),
  body("confirmPassword")
    .notEmpty()
    .withMessage("password confirmation required"),
  validatorMiddleware,
];
export const deleteLoggedUserValidator = [
  paramsSanitizer("id"),
  bodySanitizer("password"),
  param("id").isMongoId().withMessage("Invalid User ID format"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/,
      "i"
    )
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long"
    ),

  validatorMiddleware,
];
export const getLoggedUserValidator = [
  paramsSanitizer("id"),
  param("id").isMongoId().withMessage("Invalid User id format"),
  validatorMiddleware,
];

// ADMIN ONLY
export const createUserValidator = [
  bodySanitizer(
    "fullName",
    "email",
    "phone",
    "password",
    "confirmPassword",
    "activeAccount",
    "address"
  ),
  body("fullName")
    .notEmpty()
    .withMessage("fullName is required")
    .isLength({ min: 3 })
    .withMessage("Too short fullName")
    .isLength({ max: 20 })
    .withMessage("too long fullName"),
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("Invalid email address"),
  body("phone")
    .notEmpty()
    .withMessage("phone is required")
    .isMobilePhone(["ar-TN"])
    .withMessage("Invalid phone number only accepted TN Phone numbers"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/,
      "i"
    )
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long"
    )
    .custom((password, { req }) => {
      if (password !== req.body.confirmPassword) {
        throw new Error("Password Confirmation incorrect");
      }
      return true;
    }),
  body("confirmPassword")
    .notEmpty()
    .withMessage("password confirmation required"),
  body("activeAccount")
    .notEmpty()
    .withMessage("activeAccount is required")
    .isBoolean()
    .withMessage("activeAccount must be a boolean"),
  body("address")
    .optional()
    .isObject()
    .withMessage("address must be an object")
    .custom((address) => {
      const { details, governorate, city, postalCode } = address;
      if (typeof details !== "string") {
        throw new Error("details must be a string");
      }
      if (typeof governorate !== "string") {
        throw new Error("governorate must be a string");
      }
      if (typeof city !== "string") {
        throw new Error("city must be a string");
      }
      if (typeof postalCode !== "string") {
        throw new Error("postalCode must be a string");
      }

      return true;
    }),
  ,
  validatorMiddleware,
];
export const updateUserValidator = [
  paramsSanitizer("id"),
  bodySanitizer("fullName", "email", "phone", "activeAccount", "address"),
  param("id").isMongoId().withMessage("Invalid User id format"),
  body("fullName")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Too short fullName")
    .isLength({ max: 20 })
    .withMessage("too long fullName"),
  body("email")
    .optional()
    .withMessage("email is required")
    .isEmail()
    .withMessage("Invalid email address"),
  body("phone")
    .optional()
    .isMobilePhone(["ar-TN"])
    .withMessage("Invalid phone number only accepted TN Phone numbers"),
  body("activeAccount")
    .optional()
    .withMessage("activeAccount is required")
    .isBoolean()
    .withMessage("activeAccount must be a boolean"),
  body("address")
    .optional()
    .isObject()
    .withMessage("address must be an object")
    .custom((address) => {
      const { details, governorate, city, postalCode } = address;
      if (details && typeof details !== "string") {
        throw new Error("details must be a string");
      }
      if (governorate && typeof governorate !== "string") {
        throw new Error("governorate must be a string");
      }
      if (city && typeof city !== "string") {
        throw new Error("city must be a string");
      }
      if (postalCode && typeof postalCode !== "string") {
        throw new Error("postalCode must be a string");
      }

      return true;
    }),
  validatorMiddleware,
];
export const updatePasswordValidator = [
  paramsSanitizer("id"),
  bodySanitizer("password", "confirmPassword"),
  param("id").isMongoId().withMessage("Invalid User id format"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/,
      "i"
    )
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long"
    )
    .custom((password, { req }) => {
      if (password !== req.body.confirmPassword) {
        throw new Error("Password Confirmation incorrect");
      }
      return true;
    }),
  body("confirmPassword")
    .notEmpty()
    .withMessage("password confirmation required"),
  validatorMiddleware,
];
export const deleteUserValidator = [
  paramsSanitizer("id"),
  param("id").isMongoId().withMessage("Invalid User ID format"),
  validatorMiddleware,
];
export const getUserValidator = [
  paramsSanitizer("id"),
  param("id").isMongoId().withMessage("Invalid User id format"),
  validatorMiddleware,
];
export const getAllValidator = [
  querySanitizer("page", "limit", "sort", "fields", "keyword"),
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Limit must be a positive integer"),
  query("sort").optional().isString().withMessage("Sort must be a string"),
  query("fields").optional().isString().withMessage("Fields must be a string"),
  query("keyword")
    .optional()
    .isString()
    .withMessage("Keyword must be a string"),
  validatorMiddleware,
];
