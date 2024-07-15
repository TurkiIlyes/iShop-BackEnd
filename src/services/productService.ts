import factory from "./factoryService";
import Product, { ProductType } from "../models/Product";

// @desc    Get list of products
// @route   GET /api/v1/products
// @access  Public
export const getProducts = factory.getAll<ProductType>(Product);

// @desc    Get specific product by id
// @route   GET /api/v1/products/:id
// @access  Public
export const getProduct = factory.getOne<ProductType>(Product);

// @desc    Create product
// @route   POST  /api/v1/products
// @access  Private
export const createProduct = factory.createOne<ProductType>(Product);
// @desc    Update specific product
// @route   PUT /api/v1/products/:id
// @access  Private
export const updateProduct = factory.updateOne<ProductType>(Product);

// @desc    Delete specific product
// @route   DELETE /api/v1/products/:id
// @access  Private
export const deleteProduct = factory.deleteOne<ProductType>(Product);
