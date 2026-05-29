const express = require("express");
const {
  createLecture,
  getLectures,
  getLecturesByInstructor,
  updateLecture,
  deleteLecture,
} = require("../controllers/lectureController");
const { verifyToken, isAdmin } = require("../middleware/auth");

const router = express.Router();

// Admin routes
router.post("/", verifyToken, isAdmin, createLecture);
router.get("/", verifyToken, isAdmin, getLectures);
router.put("/:id", verifyToken, isAdmin, updateLecture);
router.delete("/:id", verifyToken, isAdmin, deleteLecture);

// Instructor can fetch their own lectures
router.get("/instructor/:instructorId", verifyToken, getLecturesByInstructor);

module.exports = router;
