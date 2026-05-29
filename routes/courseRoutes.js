const express = require("express");
const { createCourse, getCourses, deleteCourse } = require("../controllers/courseController");
const { verifyToken, isAdmin } = require("../middleware/auth");
const upload = require("../middleware/uploadMiddleware");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

const router = express.Router();

// Admin protected routes with Cloudinary upload and local filesystem fallback
router.post(
  "/",
  verifyToken,
  isAdmin,
  upload.single("image"),
  async (req, res, next) => {
    if (req.file) {
      try {
        // Attempt to upload the locally buffered file to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "ideamagix-courses",
        });

        // Clean up the local temp file since Cloudinary upload succeeded
        try {
          fs.unlinkSync(req.file.path);
        } catch (unlinkErr) {
          console.warn("Could not delete temporary file:", unlinkErr.message);
        }

        // Set path to the Cloudinary URL
        req.file.path = result.secure_url;
      } catch (err) {
        console.warn("⚠️ Cloudinary Upload Failed! Serving the uploaded file locally. Error details:", err.message);

        // Dynamically get the current protocol and host (works for localhost and live servers like Render!)
        const host = req.get("host");
        const protocol = req.protocol === "https" || req.headers["x-forwarded-proto"] === "https" ? "https" : "http";
        
        req.file.path = `${protocol}://${host}/uploads/${req.file.filename}`;
      }
    }
    next();
  },
  createCourse
);

router.get("/", verifyToken, getCourses); // both admin and instructor can view courses
router.delete("/:id", verifyToken, isAdmin, deleteCourse);

module.exports = router;