import express from "express";
const router = express.Router();

import { protect, allowedTo } from "../services/authService";
import {
  createUser,
  updateUser,
  deleteUser,
  getUser,
  getUsers,
  updateLoggedUserPassword,
} from "../services/userService";
import {
  createUserValidator,
  updateUserValidator,
  updateLoggedUserPasswordValidator,
  updatePasswordValidator,
  deleteLoggedUserValidator,
  getUserValidator,
  deleteUserValidator,
  updateLoggedUserValidator,
  getLoggedUserValidator,
} from "../utils/validators/userValidator";
import {
  uploadUserImage,
  resizeProfilImage,
} from "../middlewares/uploadImage/uploadUserImage";
import extractUserId from "../middlewares/extractUserId";

// Protecting all routes below this middleware with authentication
router.use(protect);

// Routes for operations on logged-in user's by ID
router.use("/me:id", extractUserId);
router
  .route("/me:id")
  .get(getLoggedUserValidator, getUser)
  .put(
    uploadUserImage,
    resizeProfilImage,
    updateLoggedUserValidator,
    updateUser
  )
  .delete(deleteLoggedUserValidator, deleteUser);

// Route for updating logged-in user's password
router.put(
  "/update-password",
  updateLoggedUserPasswordValidator,
  updateLoggedUserPassword
);

// Authorization middleware for admin-only routes
router.use(allowedTo("admin"));

// Routes for operations on all users
router
  .route("/")
  .get(getUsers)
  .post(uploadUserImage, resizeProfilImage, createUserValidator, createUser);

// Routes for operations on a specific user by ID (admin operations)
router
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(uploadUserImage, resizeProfilImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

// Route for changing password by ID
router.put("/changePassword/:id", updatePasswordValidator, updateUser);

export default router;
