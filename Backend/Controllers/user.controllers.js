import { User } from "../Model/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res
        .status(401)
        .json({ message: "All fields are required", success: false });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(401)
        .json({ message: "User already exists", success: false });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    await User.create({
      username,
      email,
      password: hashPassword,
    });
    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(401)
        .json({ message: "All fields are required", success: false });
    }
    let user = await User.findOne({ email });
    if (!User) {
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

    user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      posts: user.posts,
    };
    const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });

    return res
      .cookie("token", token, {
        httpOnly: true,
        samesite: "strict",
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: `Welcome back ${user.username}`,
        success: true,
        user,
      });
  } catch (error) {
    console.log(error);
  }
};

export const logout = async (_,res)=>{
  try{
    return res.cookie('token','',{maxAge:0}).json({message:'Logged out',success:true})
  }
  catch(err){
    console.log(err);
  }
}

export const getProfile=async(req,res)=>{
  try{
    const userId = req.param.id;
    let user = await User.findById(userId);
    return res.status(200).json({user,success:true});
  }
  catch(err){console.log(err)}
}


export const editProfile = async(req,res)=>{
  try{

  }catch(err){
      console.log(error)
  }
}

