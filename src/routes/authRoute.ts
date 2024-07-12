import express from "express";
import rateLimit from "express-rate-limit";
const router = express.Router();

import {
  signUp,
  providerSignIn,
  signIn,
  forgetPassword,
  resetPassword,
  verifyPwResetCode,
  verifySignUp,
} from "../services/authService";
import {
  signUpValidator,
  signInValidator,
  forgetPasswordValidator,
  verifyPwResetCodeValidator,
  resetPasswordValidator,
  verifySignUpValidator,
  providerSignInValidator,
} from "../utils/validators/authValidator";
import { resizeProfilImage, uploadUserImage } from "../middlewares/uploadImage/uploadUserImage";

// Rate limiter middleware to prevent brute-force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
});

router.post(
  "/provider-sign-in",
  uploadUserImage,
  resizeProfilImage,
  providerSignInValidator,
  providerSignIn
);

router.use(limiter);
/**
 * @route   POST /sign-up
 * @desc    Register a new user
 * @access  Public
 */
router.post("/sign-up", signUpValidator, signUp);

/**
 * @route   POST /verify-sign-up-code
 * @desc    Verify user sign-up code
 * @access  Public
 */
router.post("/verify-sign-up-code", verifySignUpValidator, verifySignUp);

/**
 * @route   POST /signin
 * @desc    Authenticate user and get token
 * @access  Public
 */
router.post("/sign-in", signInValidator, signIn);

/**
 * @route   POST /forget-password
 * @desc    Initiate password reset
 * @access  Public
 */
router.post("/forget-password", forgetPasswordValidator, forgetPassword);

/**
 * @route   POST /verify-pw-reset-code
 * @desc    Verify password reset code
 * @access  Public
 */
router.post(
  "/verify-pw-reset-code",
  verifyPwResetCodeValidator,
  verifyPwResetCode
);

/**
 * @route   PUT /reset-password
 * @desc    Reset user password
 * @access  Public
 */
router.put("/reset-password", resetPasswordValidator, resetPassword);

export default router;
