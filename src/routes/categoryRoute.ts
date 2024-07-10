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

/**
 * @route   GET /categories
 * @desc    Get all categories
 * @access  Public
 */
router
  .route("/")
  .get(getCategories)

  /**
   * @route   POST /categories
   * @desc    Create a new category
   * @access  Private (admin only)
   */
  .post(
    protect,
    allowedTo("admin"),
    uploadCategoryImage,
    resizeCategoryImage,
    createCategoryValidator,
    createCategory
  );

/**
 * @route   GET /categories/:id
 * @desc    Get a category by ID
 * @access  Public
 */
router
  .route("/:id")
  .get(getCategoryValidator, getCategory)

  /**
   * @route   PUT /categories/:id
   * @desc    Update a category by ID
   * @access  Private (admin only)
   */
  .put(
    protect,
    allowedTo("admin"),
    uploadCategoryImage,
    resizeCategoryImage,
    updateCategoryValidator,
    updateCategory
  )

  /**
   * @route   DELETE /categories/:id
   * @desc    Delete a category by ID
   * @access  Private (admin only)
   */
  .delete(protect, allowedTo("admin"), deleteCategoryValidator, deleteCategory);

export default router;
