import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";

import { customCloudinary } from "../../utils/uploadToCloudinary";
import { uploadMixOfImages } from "./uploadImage";

export const uploadProductImages = uploadMixOfImages([
  {
    name: "imageCover",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 5,
  },
]);

export const resizeProductImages = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.files && req.files["imageCover"]) {
      const result = await customCloudinary(req.files["imageCover"][0].buffer);
      req.body.imageCover = result.secure_url;
    }

    if (req.files && req.files["images"]) {
      req.body.images = [];
      await Promise.all(
        req.files["images"].map(async (img: { buffer: Buffer }) => {
          const result = await customCloudinary(img.buffer);
          req.body.images.push(result.secure_url);
        })
      );
    }

    next();
  }
);
