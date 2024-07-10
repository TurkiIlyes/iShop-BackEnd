import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware";

export const signUpValidator = [
  check("fullName")
    .notEmpty()
    .withMessage("fullName required")
    .isLength({ min: 3 })
    .withMessage("Too short fullName")
    .isLength({ max: 20 })
    .withMessage("too long fullName"),
  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address"),
  check("password")
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
      if (password !== req.body.passwordConfirm) {
        throw new Error("Password Confirmation incorrect");
      }
      return true;
    }),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("password confirmation required"),

  check("phone")
    .notEmpty()
    .isMobilePhone(["ar-TN"])
    .withMessage("Invalid phone number only accepted TN Phone numbers"),

  validatorMiddleware,
];

export const verifySignUpValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address"),

  check("signUpCode")
    .notEmpty()
    .withMessage("Sign-up code required")
    .isNumeric()
    .withMessage("Sign-up code must be numeric")
    .isLength({ min: 6, max: 6 })
    .withMessage("Sign-up code must be exactly 6 digits"),

  validatorMiddleware,
];

export const signInValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address"),

  check("password")
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

export const forgetPasswordValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address"),
  validatorMiddleware,
];

export const verifyPwResetCodeValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address"),

  check("resetCode")
    .notEmpty()
    .withMessage("reset code required")
    .isNumeric()
    .withMessage("reset code must be numeric")
    .isLength({ min: 6, max: 6 })
    .withMessage("reset code must be exactly 6 digits"),

  validatorMiddleware,
];

export const resetPasswordValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address"),

  check("password")
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
      if (password !== req.body.passwordConfirm) {
        throw new Error("Password Confirmation incorrect");
      }
      return true;
    }),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("password confirmation required"),
  validatorMiddleware,
];