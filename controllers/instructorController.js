const bcrypt = require("bcryptjs");
const Instructor = require("../models/Instructor");

// @desc    Create a new instructor
// @route   POST /api/instructors
const createInstructor = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if email already exists
    const existing = await Instructor.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Instructor with this email already exists" });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const instructor = await Instructor.create({
      name,
      email,
      password: hashedPassword,
    });

    // Don't send password back
    res.status(201).json({
      message: "Instructor created successfully",
      instructor: {
        _id: instructor._id,
        name: instructor.name,
        email: instructor.email,
        role: instructor.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all instructors with pagination
// @route   GET /api/instructors?page=1&limit=10
const getInstructors = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Instructor.countDocuments();
    const instructors = await Instructor.find()
      .select("-password") // don't send passwords
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      instructors,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalInstructors: total,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get single instructor
// @route   GET /api/instructors/:id
const getInstructorById = async (req, res) => {
  try {
    const instructor = await Instructor.findById(req.params.id).select("-password");

    if (!instructor) {
      return res.status(404).json({ message: "Instructor not found" });
    }

    res.status(200).json(instructor);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete instructor
// @route   DELETE /api/instructors/:id
const deleteInstructor = async (req, res) => {
  try {
    const instructor = await Instructor.findByIdAndDelete(req.params.id);

    if (!instructor) {
      return res.status(404).json({ message: "Instructor not found" });
    }

    res.status(200).json({ message: "Instructor deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { createInstructor, getInstructors, getInstructorById, deleteInstructor };
