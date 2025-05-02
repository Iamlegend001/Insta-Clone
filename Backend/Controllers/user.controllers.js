import { User } from "../Model/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

// Register
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res
        .status(401)
        .json({ message: "All fields are required", success: false });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(401)
        .json({ message: "User already exists", success: false });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    await User.create({ username, email, password: hashPassword });

    return res
      .status(201)
      .json({ message: "User created successfully", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(401)
        .json({ message: "All fields are required", success: false });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid credentials", success: false });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res
        .status(401)
        .json({ message: "Invalid credentials", success: false });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });

    const populatedPosts = await Promise.all(
      user.posts.map(async (postId) => {
        const post = await User.findById(postId);
        if (post.author.equals(user._id)) {
          return post;
        } else {
          return null;
        }
      })
    );

    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: `Welcome back ${user.username}`,
        success: true,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          profilePicture: user.profilePicture,
          bio: user.bio,
          followers: user.followers,
          following: user.following,
          posts: populatedPosts,
        },
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

// Logout
export const logout = async (_, res) => {
  try {
    return res
      .cookie("token", "", { maxAge: 0 })
      .json({ message: "Logged out", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

// Get Profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    return res.status(200).json({ user, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

// Edit Profile
export const editProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { bio, gender } = req.body;
    const profilePicture = req.file;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    if (profilePicture) {
      const fileUri = getDataUri(profilePicture);
      const cloudResponse = await cloudinary.uploader.upload(fileUri);
      user.profilePicture = cloudResponse.secure_url;
    }

    if (bio) user.bio = bio;
    if (gender) user.gender = gender;

    await user.save();

    return res.json({
      message: "Profile updated successfully",
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

// Suggested Users
export const getSuggestedUsers = async (req, res) => {
  try {
    const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select(
      "-password"
    );
    if (!suggestedUsers.length) {
      return res
        .status(400)
        .json({ message: "No users found", success: false });
    }
    return res.status(200).json({ success: true, suggestedUsers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

// Follow or Unfollow
export const followOrUnfollow = async (req, res) => {
  try {
    const whoFollowed = req.id;
    const usfollowing = req.params.id;

    if (whoFollowed === usfollowing) {
      return res
        .status(400)
        .json({ message: "You cannot follow yourself", success: false });
    }

    const user = await User.findById(whoFollowed);
    const targetUser = await User.findById(usfollowing);

    if (!user || !targetUser) {
      return res
        .status(400)
        .json({ message: "User not found", success: false });
    }

    const isFollowing = user.following.includes(usfollowing);

    if (isFollowing) {
      await Promise.all([
        User.updateOne(
          { _id: whoFollowed },
          { $pull: { following: usfollowing } }
        ),
        User.updateOne(
          { _id: usfollowing },
          { $pull: { followers: whoFollowed } }
        ),
      ]);
      return res.status(200).json({ message: "Unfollowed", success: true });
    } else {
      await Promise.all([
        User.updateOne(
          { _id: whoFollowed },
          { $push: { following: usfollowing } }
        ),
        User.updateOne(
          { _id: usfollowing },
          { $push: { followers: whoFollowed } }
        ),
      ]);
      return res.status(200).json({ message: "Followed", success: true });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};
