import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoutes from "./Routes/user.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:5173", // frontend origin
    credentials: true,
  })
);

// Routes
app.get("/", (req, res) => {
  res.status(200).json({
    message: "I am coming from backend",
    success: true,
  });
});

app.use("/api/v1/user", userRoutes);

// Start server
connectDB();
app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`);
});
