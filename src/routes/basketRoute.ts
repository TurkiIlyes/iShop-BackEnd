import express from "express";
import { protect } from "../services/authService";
import {
  addItemToBasket,
  getBasket,
  updateBasket,
  removeItemFromBasket,
  clearBasket,
} from "../services/basketService";
import {
  addItemValidator,
  updateBasketValidator,
  removeItemValidator,
} from "../utils/validators/basketValidator";
import extractUserId from "../middlewares/extractUserId";

const router = express.Router();

router.use(protect);
router.get("/", extractUserId, getBasket);

router.post("/", extractUserId, addItemValidator, addItemToBasket);

router.put("/", extractUserId, updateBasketValidator, updateBasket);

router.delete(
  "/:itemId",
  extractUserId,
  removeItemValidator,
  removeItemFromBasket
);

router.delete("/", extractUserId, clearBasket);

export default router;
