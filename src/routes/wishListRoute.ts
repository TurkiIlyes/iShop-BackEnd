import express from "express";
import { protect } from "../services/authService";
import {
  addToWishList,
  removeFromWishList,
  getLoggedUserWishList,
  clearWishList,
} from "../services/wishListService";
import {
  addToWishListValidator,
  removeFromWishListValidator,
} from "../utils/validators/wishListValidator";
import extractUserId from "../middlewares/extractUserId";

const router = express.Router();

router.use(protect); // Protect wishlist routes

// Get logged-in user's wishlist
router.get("/me", extractUserId, getLoggedUserWishList);

// Add product to wishlist
router.post(
  "/me/:productId",
  extractUserId,
  addToWishListValidator,
  addToWishList
);

// Remove product from wishlist
router.delete(
  "/me/:productId",
  extractUserId,
  removeFromWishListValidator,
  removeFromWishList
);

// clear wishlist
router.delete("/me", extractUserId, clearWishList);

export default router;
