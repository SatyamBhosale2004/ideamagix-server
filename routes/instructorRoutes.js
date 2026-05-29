const express = require("express");
const {
  createInstructor,
  getInstructors,
  getInstructorById,
  deleteInstructor,
} = require("../controllers/instructorController");
const { verifyToken, isAdmin } = require("../middleware/auth");

const router = express.Router();

// All instructor routes are admin-protected
router.post("/", verifyToken, isAdmin, createInstructor);
router.get("/", verifyToken, isAdmin, getInstructors);
router.get("/:id", verifyToken, isAdmin, getInstructorById);
router.delete("/:id", verifyToken, isAdmin, deleteInstructor);

module.exports = router;