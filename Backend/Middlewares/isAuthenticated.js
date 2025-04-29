// Middlewares/isAuthenticated.js
import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.id = decode.id; // ✅ Correct field
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default isAuthenticated;
