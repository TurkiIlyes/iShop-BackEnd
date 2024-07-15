import factory from "./factoryService";
import Category, { CategoryType } from "../models/Category";

// @desc    Get list of categories
// @route   GET /api/v1/categories
// @access  Public
export const getCategories = factory.getAll<CategoryType>(Category);

// @desc    Get specific category by id
// @route   GET /api/v1/categories/:id
// @access  Public
export const getCategory = factory.getOne<CategoryType>(Category);

// @desc    Create category
// @route   POST  /api/v1/categories
// @access  Private/Admin-Manager
export const createCategory = factory.createOne<CategoryType>(Category);

// @desc    Update specific category
// @route   PUT /api/v1/categories/:id
// @access  Private/Admin-Manager
export const updateCategory = factory.updateOne<CategoryType>(Category);

// @desc    Delete specific category
// @route   DELETE /api/v1/categories/:id
// @access  Private/Admin
export const deleteCategory = factory.deleteOne<CategoryType>(Category);
