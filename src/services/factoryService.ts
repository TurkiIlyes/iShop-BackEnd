import { Request, Response, NextFunction } from "express";
import ApiFeatures from "../utils/ApiFeatures";
import asyncHandler from "express-async-handler";
import { Model as MongooseModel, Document, FilterQuery } from "mongoose";
import ApiError from "../utils/ApiError";
import extractNonEmptyFields from "../utils/extractNonEmptyFields";
import parseArrays from "../utils/parseArray";

// Create a new document
export const createOne = <T extends Document>(Model: MongooseModel<T>) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const parsedArr = parseArrays(req, [
      "colors",
      "sizes",
      "images",
      "address",
    ]);

    const newDoc = await Model.create({ ...req.body, ...parsedArr });
    res.status(201).json({ data: newDoc });
  });

// Update an existing document by ID
export const updateOne = <T extends Document>(Model: MongooseModel<T>) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const parsedArr = parseArrays(req, [
      "colors",
      "sizes",
      "images",
      "address",
    ]);
    const notEmptyData = extractNonEmptyFields<T>(
      { ...req.body, ...parsedArr },
      Model
    );
    const document = await Model.findByIdAndUpdate(
      id,
      { $set: notEmptyData },
      {
        new: true,
      }
    );

    if (!document) {
      return next(new ApiError(`No ${Model.modelName} for this id ${id}`, 404));
    }
    res.status(200).json({ data: document });
  });

// Delete a document by ID
export const deleteOne = <T extends Document>(Model: MongooseModel<T>) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);

    if (!document) {
      return next(new ApiError(`No ${Model.modelName} for this id ${id}`, 404));
    }
    res.status(204).send();
  });

// Get all documents with optional filtering, pagination, etc.
export const getAll = <T extends Document>(Model: MongooseModel<T>) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // let filter: FilterQuery<T> = {};
    // if (req.filterObj) {
    //   filter = req.filterObj;
    // }
    const documentsCounts = await Model.countDocuments();
    const apiFeatures = new ApiFeatures(Model.find(), req.query)
      .paginate(documentsCounts)
      .filter()
      .search(Model.modelName)
      .limitFields()
      .sort();

    const { mongooseQuery, paginationResult } = apiFeatures;
    const documents = await mongooseQuery;

    res
      .status(200)
      .json({ results: documents.length, paginationResult, data: documents });
  });

// Get a single document by ID
export const getOne = <T extends Document>(Model: MongooseModel<T>) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const document = await Model.findById(id);

    if (!document) {
      return next(new ApiError(`No ${Model.modelName} for this id ${id}`, 404));
    }
    res.status(200).json({ data: document });
  });

export default {
  createOne,
  updateOne,
  deleteOne,
  getOne,
  getAll,
};
