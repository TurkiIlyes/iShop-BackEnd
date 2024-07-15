import { uploadMixOfImages } from "./uploadImage";
import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

interface CloudinaryUploadResult {
  secure_url: string;
}

const uploadToCloudinary = (
  buffer: Buffer,
  options: object
): Promise<CloudinaryUploadResult> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (result) {
          resolve(result as CloudinaryUploadResult);
        } else {
          reject(error);
        }
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

export const resizeProductImages = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("/1");
    console.log(req.files["imageCover"]);
    console.log("/1");
    if (req.files && req.files["imageCover"]) {
      const result = await uploadToCloudinary(
        req.files["imageCover"][0].buffer,
        {
          folder: "products",
          format: "jpeg",
          transformation: [
            { width: 2000, height: 1333, crop: "limit", quality: "auto" },
          ],
        }
      );
      console.log("/2");
      console.log(req.files["imageCover"]);
      console.log("/2");
      console.log("/3");
      console.log(result);
      console.log("/3");
      console.log("/4");
      console.log(result.secure_url);
      console.log("/4");
      req.body.imageCover = result.secure_url;
    }

    if (req.files && req.files["images"]) {
      req.body.images = [];
      await Promise.all(
        req.files["images"].map(async (img) => {
          const result = await uploadToCloudinary(img.buffer, {
            folder: "products",
            format: "jpeg",
            transformation: [
              { width: 2000, height: 1333, crop: "limit", quality: "auto" },
            ],
          });

          req.body.images.push(result.secure_url);
        })
      );
    }
    // console.log(req.body.imageCover);
    // console.log(req.body.images);
    next();
  }
);
