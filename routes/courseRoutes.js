const express = require("express");
const { createCourse, getCourses, deleteCourse } = require("../controllers/courseController");
const { verifyToken, isAdmin } = require("../middleware/auth");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Admin protected routes - wrapped upload with fallback for invalid Cloudinary config
router.post(
  "/",
  verifyToken,
  isAdmin,
  (req, res, next) => {
    upload.single("image")(req, res, (err) => {
      if (err) {
        console.warn("⚠️ Cloudinary Upload Failed! Check your credentials in .env. Error details:", err.message);
        // Fallback placeholder image URL
        req.file = {
          path: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=60"
        };
      }
      next();
    });
  },
  createCourse
);
router.get("/", verifyToken, getCourses); // both admin and instructor can view courses
router.delete("/:id", verifyToken, isAdmin, deleteCourse);

module.exports = router;