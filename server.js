const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const connectDB = require("./config/db");

// Import routes
const authRoutes = require("./routes/authRoutes");
const instructorRoutes = require("./routes/instructorRoutes");
const courseRoutes = require("./routes/courseRoutes");
const lectureRoutes = require("./routes/lectureRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

// Custom request logger middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(cors());

// Rate limiting - max 100 requests per 15 min per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: "Too many requests, please try again later" },
});
app.use(limiter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve local uploads folder statically
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/instructors", instructorRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/lectures", lectureRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Global error handler - catches errors from middleware like multer
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  console.error(err.stack);
  res.status(500).json({ message: "Server error", error: err.message });
});

const PORT = process.env.PORT || 5000;

// Connect to MongoDB then start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
