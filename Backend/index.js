import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";

// Corrected route imports based on your actual file names
import userRoutes from "./Routes/user.routes.js";
import postRoutes from "./Routes/post.route.js";
import messageRoutes from "./Routes/message.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Test route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "I am coming from backend",
    success: true,
  });
});

// API Routes
app.use("/api/v1/users", userRoutes);

app.use("/api/v1/post", postRoutes);
app.use("/api/v1/message", messageRoutes);

// Start server
connectDB();
app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`);
});
