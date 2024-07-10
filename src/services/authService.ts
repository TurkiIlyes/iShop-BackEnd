import User from "../models/User";

import crypto from "crypto";

import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

import bcrypt from "bcrypt";

import generateToken from "../utils/generateToken";
import sendEmail from "../utils/sendEmail";
import resetCodeEmailTemplate from "../utils/emailTemplate/resetCodeEmailTemplate";
import signUpCodeEmailTemplate from "../utils/emailTemplate/signUpCodeEmailTemplate";

import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError";

export const signUp = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { fullName, email, password, phone } = req.body;

    const checkUser = await User.findOne({ email });
    if (checkUser && !checkUser.activeAccount) {
      await User.findOneAndDelete({ email });
    }

    const user = await User.create({
      fullName,
      email,
      phone,
      password: await bcrypt.hash(password, +process.env.BCRYPT_SALT),
    });

    const signUpCode = Math.floor(Math.random() * 900000 + 100000).toString();

    const hashedSignUpCode = crypto
      .createHash("sha256")
      .update(signUpCode)
      .digest("hex");

    user.signUpCode = hashedSignUpCode;
    user.signUpCodeExpires = new Date(Date.now() + 10 * 60 * 1000);

    await user.save();
    try {
      await sendEmail(
        signUpCodeEmailTemplate(user.fullName, user.email, signUpCode)
      );
    } catch (err) {
      user.signUpCode = undefined;
      user.signUpCodeExpires = undefined;
      await user.save();
      return next(new ApiError("There is an error in sending email -_-", 500));
    }

    res.status(201).json({ data: { email: user.email } });
  }
);

export const verifySignUp = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { signUpCode, email } = req.body;
    const hashedSignUpCode = crypto
      .createHash("sha256")
      .update(signUpCode)
      .digest("hex");
    const user = await User.findOne({
      email,
      signUpCode: hashedSignUpCode,
      signUpCodeExpires: { $gt: Date.now() },
    });
    if (!user) {
      return next(new ApiError("code invalid or expired", 400));
    }
    user.activeAccount = true;
    await user.save();

    const token = generateToken(user._id);
    const userObject = user.toObject();
    delete userObject.password;
    res.status(201).json({ data: userObject, token });
  }
);

export const signIn = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (
      !user ||
      !(await bcrypt.compare(password, user.password)) ||
      !user.activeAccount
    ) {
      return next(new ApiError("Invalid email or password", 401));
    }
    const token = generateToken(user._id);
    const userObject = user.toObject();
    delete userObject.password;
    res.status(200).json({ data: userObject, token });
  }
);

export const forgetPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.activeAccount) {
      return next(new ApiError("There is no user with this email", 400));
    }
    const resetCode = Math.floor(Math.random() * 900000 + 100000).toString();

    const hashedResetCode = crypto
      .createHash("sha256")
      .update(resetCode)
      .digest("hex");

    user.pwResetCode = hashedResetCode;
    user.pwResetExpires = new Date(Date.now() + 10 * 60 * 1000);
    user.pwResetVerified = false;

    await user.save();

    try {
      await sendEmail(
        resetCodeEmailTemplate(user.fullName, user.email, resetCode)
      );
    } catch (err) {
      user.pwResetCode = undefined;
      user.pwResetExpires = undefined;
      user.pwResetVerified = undefined;
      await user.save();
      return next(new ApiError("There is an error in sending email -_-", 500));
    }
    res.status(200).json({
      status: "success",
      message: "reset code send to email",
    });
  }
);

export const verifyPwResetCode = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, resetCode } = req.body;

    const hashedResetCode = crypto
      .createHash("sha256")
      .update(resetCode)
      .digest("hex");

    const user = await User.findOne({
      email,
      pwResetCode: hashedResetCode,
      pwResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return next(new ApiError("Reset code invalid or expired", 400));
    }

    user.pwResetVerified = true;
    await user.save();
    res.status(200).json({ status: "success", message: "correct reset code" });
  }
);

export const resetPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ApiError("There is no user with this email", 404));
    }

    if (!user.pwResetVerified) {
      return next(new ApiError("reset code not verified", 400));
    }
    user.password = await bcrypt.hash(password, +process.env.BCRYPT_SALT);
    user.pwUpdatedAt = new Date();
    user.pwResetCode = undefined;
    user.pwResetExpires = undefined;
    user.pwResetVerified = undefined;
    await user.save();
    const token = generateToken(user._id);
    const userObject = user.toObject();
    delete userObject.password;
    res.status(200).json({ data: userObject, token });
  }
);

export const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization || null;
    if (!token) {
      return next(new ApiError("You are not login, please login -_-", 401));
    }

    interface decodedTokenType {
      userId: string;
      iat: number;
    }
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY
    ) as decodedTokenType;

    const user = await User.findById(decodedToken.userId);
    if (!user) {
      return next(new ApiError("user with this token no more exist -_-", 401));
    }
    if (decodedToken.iat < Math.trunc(user.pwUpdatedAt.getTime() / 1000)) {
      return next(
        new ApiError("user changed his password , please login again -_-", 401)
      );
    }
    req.user = user;
    next();
  }
);

export const allowedTo = (...roles: string[]) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (req.user && !roles.includes(req.user.role)) {
      return next(
        new ApiError("You are not allowed to access this route", 403)
      );
    }
    next();
  });
