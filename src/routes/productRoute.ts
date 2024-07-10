import express from "express";
import {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} from "../utils/validators/productValidator";

import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/productService";
import { protect, allowedTo } from "../services/authService";
import {
  resizeProductImages,
  uploadProductImages,
} from "../middlewares/uploadImage/uploadProductImage";

const router = express.Router();

/**
 * @route   GET /products
 * @desc    Get all products
 * @access  Public
 */
router
  .route("/")
  .get(getProducts)

  /**
   * @route   POST /products
   * @desc    Create a new product
   * @access  Private (admin only)
   */
  .post(
    protect,
    allowedTo("admin"),
    uploadProductImages,
    resizeProductImages,
    createProductValidator,
    createProduct
  );

/**
 * @route   GET /products/:id
 * @desc    Get a product by ID
 * @access  Public
 */
router
  .route("/:id")
  .get(getProductValidator, getProduct)

  /**
   * @route   PUT /products/:id
   * @desc    Update a product by ID
   * @access  Private (admin only)
   */
  .put(
    protect,
    allowedTo("admin"),
    uploadProductImages,
    resizeProductImages,
    updateProductValidator,
    updateProduct
  )

  /**
   * @route   DELETE /products/:id
   * @desc    Delete a product by ID
   * @access  Private (admin only)
   */
  .delete(protect, allowedTo("admin"), deleteProductValidator, deleteProduct);

export default router;
