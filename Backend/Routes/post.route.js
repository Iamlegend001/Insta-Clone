
import express from "express";
import isAuthenticated from "../Middlewares/isAuthenticated.js";
import upload from "../Controllers/multer.js";
import {
  addNewPost,
  getAllPosts,
  getUserPost,
  likePost,
  dislikePost,
  addComment,
  getCommentsOfPost,
  deletePost,
  bookmarkPost,
} from "../Controllers/post.controller.js";

const router = express.Router();

router.route("/addpost").post(isAuthenticated, upload.single("image"), addNewPost);
router.route("/all").get(isAuthenticated, getAllPosts);
router.route("/userposts/all").get(isAuthenticated, getUserPost);
router.route("/like/:id").post(isAuthenticated, likePost);
router.route("/dislike/:id").post(isAuthenticated, dislikePost);
router.route("/comment/:id").post(isAuthenticated, addComment);
router.route("/comments/:id").get(isAuthenticated, getCommentsOfPost);
router.route("/bookmark/:id").post(isAuthenticated, bookmarkPost);
router.route("/delete/:id").post(isAuthenticated, deletePost);

export default router;
