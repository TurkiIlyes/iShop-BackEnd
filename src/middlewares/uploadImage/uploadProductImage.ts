import { uploadMixOfImages } from "./uploadImage";
import asyncHandler from "express-async-handler";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";

import { Request, Response, NextFunction } from "express";

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
      const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;

      await sharp(req.files["imageCover"][0].buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .jpeg({ quality: 95 })
        .toFile(`uploads/products/${imageCoverFileName}`);

      req.body.imageCover = imageCoverFileName;
    }

    if (req.files && req.files["images"]) {
      req.body.images = [];
      await Promise.all(
        req.files["images"].map(async (img, index) => {
          const imageName = `product-${uuidv4()}-${Date.now()}-${
            index + 1
          }.jpeg`;

          await sharp(img.buffer)
            .resize(2000, 1333)
            .toFormat("jpeg")
            .jpeg({ quality: 95 })
            .toFile(`uploads/products/${imageName}`);

          req.body.images.push(imageName);
        })
      );

      next();
    }
  }
);
