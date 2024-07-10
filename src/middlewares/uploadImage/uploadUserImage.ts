import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import { uploadSingleImage } from "./uploadImage";
import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";

export const uploadUserImage = uploadSingleImage("profileImg");

export const resizeProfilImage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const filename = `profil-${uuidv4()}-${Date.now()}.jpeg`;

    if (req.file) {
      await sharp(req.file.buffer)
        .resize(720, 1080)
        .toFormat("jpeg")
        .jpeg({ quality: 95 })
        .toFile(`uploads/profil/${filename}`);
      req.body.image = filename;
    }
    next();
  }
);