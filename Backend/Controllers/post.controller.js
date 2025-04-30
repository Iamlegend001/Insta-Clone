// import sharp from "sharp";
// import { Post } from "../Model/post.model.js";
// import { User } from "../Model/user.model.js";
// import { Comment } from "../Model/comment.model.js";
// import cloudinary from "../utils/cloudinary.js";

// export const addNewPost = async (req, res) => {
//   try {
//     const { caption } = req.body;
//     const image = req.file;
//     const authorId = req.id;

//     if (!image) return res.status(400).json({ message: "Image required" });

//     const optimizedImageBuffer = await sharp(image.buffer)
//       .resize(1000, 1000, { fit: "inside" })
//       .toFormat("jpeg", {
//         quality: 95,
//       })
//       .toBuffer();

//     const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
//       "base64"
//     )}`;
//     const cloudResponse = await cloudinary.uploader.upload(fileUri);
//     const post = await Post.create({
//       caption,
//       image: cloudResponse.secure_url,
//       author: authorId,
//     });

//     const user = await User.findById(authorId);
//     if (user) {
//       user.posts.push(post._id);
//       await user.save();
//     }

//     await post.populate({ path: "author", select: "-password" });

//     return res
//       .status(201)
//       .json({ message: "Post created successfully", post, success: true });
//   } catch (error) {
//     console.log(error);
//   }
// };

// export const getAllPosts = async (req, res) => {
//   try {
//     const posts = await Post.find()
//       .populate({ path: "author", select: "username profilePic" })
//       .populate({
//         path: "comments",
//         sort: { createdAt: -1 },
//         populate: { path: "author", select: "username profilePic" },
//       });
//     return res.status(200).json({ posts, success: true });
//   } catch (error) {
//     console.log(error);
//   }
// };
// export const getUserPost = async (req, res) => {
//   try {
//     const authorId = req.id;
//     const posts = await Post.find({ author: authorId })
//       .sort({
//         createdAt: -1,
//       })
//       .populate({
//         path: "comments",
//         sort: { createdAt: -1 },
//         populate: { path: "author", select: "username profilePic" },
//       });
//     return res.status(200).json({ posts, success: true });
//   } catch (error) {
//     console.log(error);
//   }
// };

// export const likePost = async (req, res) => {
//   try {
//     const likedPostId = req.id;
//     const postId = req.params.id;
//     const post = await Post.findById(postId);
//     if (!post) {
//       return res
//         .status(404)
//         .json({ message: "Post not found", success: false });
//     }
//     await post.updateOne({ $addToSet: { likes: likedPostId } });
//     await post.save();

//     // implement socket.io here to notify the client that a new comment has been added

//     return res.status(200).json({ message: "Post liked", success: true });
//   } catch (err) {
//     console.log(err);
//   }
// };
// export const dislikePost = async (req, res) => {
//   try {
//     const dislikedPostId = req.id;
//     const postId = req.params.id;
//     const post = await Post.findById(postId);
//     if (!post) {
//       return res
//         .status(404)
//         .json({ message: "Post not found", success: false });
//     }
//     await post.updateOne({ $pull: { likes: dislikedPostId } });
//     await post.save();
//     return res.status(200).json({ message: "Post disliked", success: true });
//   } catch (err) {
//     console.log(err);
//   }
// };
// export const addComment = async (req, res) => {
//   try {
//     const postId = req.params.id;
//     const commentedId = req.id;
//     const { text } = req.body;
//     const post = await Post.findById(postId);
//     if (!post) {
//       return res
//         .status(404)
//         .json({ message: "Post not found", success: false });
//     }
//     const comment = await Comment.create({
//       text,
//       author: commentedId,
//       post: postId,
//     }).populate({
//       path: "author",
//       select: "username profilePic",
//     });
//     post.comments.push(comment._id);
//     await post.save();
//     return res.status(200).json({ message: "Comment added", success: true });
//   } catch (err) {
//     console.log(err);
//   }
// };
// export const getCommentsOfPost = async (req, res) => {
//   try {
//     const postId = req.params.id;
//     const comments = await Comment.find({ post: postId }).populate({
//       path: "author",
//       select: "username profilePic",
//     });
//     if (!comments) {
//       return res
//         .status(404)
//         .json({ message: "No Comments Found", success: false });
//     }
//     return res.status(200).json({ comments, success: true });
//   } catch (err) {
//     console.log(err);
//   }
// };

// export const deletePost = async (req, res) => {
//   try {
//     const postId = req.params.id;
//     const authorId = req.id;

//     const post = await Post.findById(postId);
//     if (!post) {
//       return res
//         .status(404)
//         .json({ message: "Post not found", success: false });
//     }
//     // check if the user is the owner of the post
//     if (post.author.toString() !== authorId) {
//       return res.status(401).json({
//         message: "You are not authorized to delete this post",
//         success: false,
//       });
//     }
//     await Post.findByIdAndDelete(postId);

//     // remove the post id from the user's posts array

//     let user = await User.findById(authorId);
//     user.posts = user.posts.filter((id) => id.toString() !== postId);
//     await user.save();
//     //delete all comments associated with the post
//     await Comment.deleteMany({ post: postId });

//     return res.status(200).json({ message: "Post deleted", success: true });
//   } catch (err) {
//     console.log(err);
//   }
// };
// export const bookmarkPost = async (req, res) => {
//   try {
//     const authorId = req.id;
//     const postId = req.params.id;
//     const post = await Post.findById(postId);
//     if (!post) {
//       return res
//         .status(404)
//         .json({ message: "Post not found", success: false });
//     }
//     const user = await User.findById(authorId);
//     if (user.bookmarks.includes(post._id)) {
//       await user.updateOne({ $pull: { bookmarks: post._id } });
//       await user.save();
//       return res
//         .status(200)
//         .json({ type: "unsaved", message: "Post unbookmarked", success: true });
//     } else {
//       await user.updateOne({ $addToSet: { bookmarks: post._id } });
//       await user.save();
//       return res
//         .status(200)
//         .json({ type: "saved", message: "Post bookmarked", success: true });
//     }
//     // await post.updateOne({ $addToSet: { bookmarks: bookmarkedPostId } });
//     // await post.save();
//     // return res.status(200).json({ message: "Post bookmarked", success: true });
//   } catch (err) {
//     console.log(err);
//   }
// };


import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../Model/post.model.js";
import { User } from "../Model/user.model.js";
import { Comment } from "../Model/comment.model.js";

// Create a new post
export const addNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.id;

    if (!image) {
      return res.status(400).json({ message: "Image required", success: false });
    }

    const optimizedImageBuffer = await sharp(image.buffer)
      .resize(1000, 1000, { fit: "inside" })
      .toFormat("jpeg", { quality: 95 })
      .toBuffer();

    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString("base64")}`;

    const cloudResponse = await cloudinary.uploader.upload(fileUri);
    const post = await Post.create({
      caption,
      image: cloudResponse.secure_url,
      author: authorId,
    });

    const user = await User.findById(authorId);
    if (!user) throw new Error("User not found");

    user.posts.push(post._id);
    await user.save();

    await post.populate({ path: "author", select: "-password" });

    return res.status(201).json({
      message: "Post created successfully",
      post,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message || "Internal server error", success: false });
  }
};

// Get all posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username profilePic" })
      .populate({
        path: "comments",
        options: { sort: { createdAt: -1 } },
        populate: { path: "author", select: "username profilePic" },
      });

    return res.status(200).json({ posts, success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch posts", success: false });
  }
};

// Get posts of a logged-in user
export const getUserPost = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.id })
      .sort({ createdAt: -1 })
      .populate({
        path: "comments",
        options: { sort: { createdAt: -1 } },
        populate: { path: "author", select: "username profilePic" },
      });

    return res.status(200).json({ posts, success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch user posts", success: false });
  }
};

// Like a post
export const likePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { likes: req.id } },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ message: "Post not found", success: false });
    }

    return res.status(200).json({
      message: "Post liked",
      likes: post.likes,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to like post", success: false });
  }
};

// Dislike a post
export const dislikePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $pull: { likes: req.id } },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ message: "Post not found", success: false });
    }

    return res.status(200).json({
      message: "Post disliked",
      likes: post.likes,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to dislike post", success: false });
  }
};

// Add comment to a post
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const { id: postId } = req.params;
    const userId = req.id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found", success: false });

    const comment = await Comment.create({ text, author: userId, post: postId });
    await comment.populate({ path: "author", select: "username profilePic" });

    post.comments.push(comment._id);
    await post.save();

    return res.status(201).json({
      message: "Comment added",
      comment,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to add comment", success: false });
  }
};

// Get comments of a post
export const getCommentsOfPost = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.id })
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username profilePic" });

    return res.status(200).json({ comments, success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch comments", success: false });
  }
};

// Delete a post
export const deletePost = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const userId = req.id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found", success: false });

    if (post.author.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized to delete this post", success: false });
    }

    await Post.findByIdAndDelete(postId);
    await User.findByIdAndUpdate(userId, { $pull: { posts: postId } });
    await Comment.deleteMany({ post: postId });

    return res.status(200).json({ message: "Post deleted successfully", success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to delete post", success: false });
  }
};

// Bookmark/unbookmark a post
export const bookmarkPost = async (req, res) => {
  try {
    const userId = req.id;
    const postId = req.params.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found", success: false });

    const isBookmarked = user.bookmarks.includes(postId);
    const update = isBookmarked
      ? { $pull: { bookmarks: postId } }
      : { $addToSet: { bookmarks: postId } };

    await User.findByIdAndUpdate(userId, update);

    return res.status(200).json({
      message: isBookmarked ? "Post unbookmarked" : "Post bookmarked",
      type: isBookmarked ? "unsaved" : "saved",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to update bookmark", success: false });
  }
};
