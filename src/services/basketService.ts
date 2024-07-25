import asyncHandler from "express-async-handler";
import Basket, { BasketType, BasketItemType } from "../models/Basket";
import Product from "../models/Product";
import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError";

export const getBasket = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const basket = await Basket.findOne({ userId: id }).populate(
      "items.productId"
    );
    if (!basket) {
      return next(new ApiError("Basket not found", 404));
    }
    res.status(200).json({ data: basket });
  }
);

export const addItemToBasket = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { productId, quantity } = req.body;
    let basket = await Basket.findOne({ userId: id });

    const product = await Product.findById(productId);
    if (!product) {
      return next(new ApiError("Product not found", 404));
    }

    const newItemData: BasketItemType = {
      productId,
      quantity,
      price: product.priceAfterDiscount || product.price,
      total: product.price * quantity,
    };

    if (!basket) {
      basket = await Basket.create({
        userId: id,
        items: [newItemData],
      });
    } else {
      const existingItem = basket.items.find(
        (e) => e.productId.toString() === productId
      );
      if (!existingItem) {
        basket.items.push(newItemData);
        await basket.save();
      }
    }

    res.status(201).json({ message: "Item added to basket", data: basket });
  }
);

export const updateBasket = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { productId, newQuantity } = req.body;

    const basket = await Basket.findOne({ userId: id });

    if (!basket) {
      return next(new ApiError("Basket not found", 404));
    }

    const existingItem = basket.items.find(
      (e) => e.productId.toString() === productId
    );

    if (!existingItem) {
      return next(new ApiError("Item not found in basket", 404));
    }
    existingItem.quantity = newQuantity;
    await basket.save();
    res.status(200).json({ message: "Item quantity updated", data: basket });
  }
);

export const removeItemFromBasket = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id, itemId } = req.params;
    console.log(id);
    console.log(itemId);
    const basket = await Basket.findOne({ userId: id });

    if (!basket) {
      return next(new ApiError("Basket not found", 404));
    }

    const itemIndex = basket.items.findIndex(
      (item: any) => item._id.toString() === itemId
    );
    if (itemIndex === -1) {
      return next(new ApiError("Item not found in basket", 404));
    }
    basket.items.splice(itemIndex, 1);
    await basket.save();

    res.status(200).json({ message: "Item removed from basket", data: basket });
  }
);

export const clearBasket = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const basket = await Basket.findOne({ userId: id });

    if (!basket) {
      return next(new ApiError("Basket not found", 404));
    }

    basket.items = [];
    await basket.save();

    res.status(200).json({ message: "Basket cleared", data: basket });
  }
);
