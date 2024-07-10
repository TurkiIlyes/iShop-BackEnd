import express from "express";

import {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} from "../utils/validators/categoryValidator";

import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/categoryService";

import { protect, allowedTo } from "../services/authService";
import {
  uploadCategoryImage,
  resizeCategoryImage,
} from "../middlewares/uploadImage/uploadCategoryImage";

const router = express.Router();

router
  .route("/")
  .get(getCategories)
  .post(
    protect,
    allowedTo("admin"),
    uploadCategoryImage,
    resizeCategoryImage,
    createCategoryValidator,
    createCategory
  );
router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(
    protect,
    allowedTo("admin"),
    uploadCategoryImage,
    resizeCategoryImage,
    updateCategoryValidator,
    updateCategory
  )
  .delete(protect, allowedTo("admin"), deleteCategoryValidator, deleteCategory);

module.exports = router;
