import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import ApiError from "../utils/ApiError";

const authorizeUser = asyncHandler(
  (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (id !== req.user._id.toString()) {
      return next(new ApiError(`Cannot delete another user's account`, 403));
    }
    next();
  }
);

export default authorizeUser;
