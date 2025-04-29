import express from "express";
import { login, logout, register } from "../Controllers/user.controllers.js"; // FIXED: It was `auth.controller.js` (file doesn't exist)
import isAuthenticated from "../Middlewares/isAuthenticated.js"; // FIXED: Added `.js` for ESM
import {
  editProfile,
  followOrUnfollow,
  getProfile,
  getSuggestedUsers,
} from "../Controllers/user.controllers.js"; // FIXED: Missing `.js` extension
import upload from "../Controllers/multer.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/:id/profile").get(isAuthenticated, getProfile);

router
  .route("/profile/edit")
  .post(isAuthenticated, upload.single("profilePicture"), editProfile);

router.route("/suggested").get(isAuthenticated, getSuggestedUsers);
router.route("/followorunfollow/:id").post(isAuthenticated, followOrUnfollow);

export default router;
