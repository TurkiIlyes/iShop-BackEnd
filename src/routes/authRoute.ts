import express from "express";
const router=express.Router();

import { signUp, signIn, forgetPassword, resetPassword, verifyPwResetCode, verifySignUp } from "../services/authService";
import { signUpValidator, signInValidator, forgetPasswordValidator, verifyPwResetCodeValidator, resetPasswordValidator,  verifySignUpValidator } from "../utils/validators/authValidator";


router.post("/signup", signUpValidator, signUp);

router.post("/verifySignUpCode", verifySignUpValidator, verifySignUp);

router.post("/signin", signInValidator, signIn);

router.post("/forgetPassword", forgetPasswordValidator, forgetPassword);
router.post(
  "/verifyPwResetCode",
  verifyPwResetCodeValidator,
  verifyPwResetCode
);
router.put("/resetPassword", resetPasswordValidator, resetPassword);

export default router;
