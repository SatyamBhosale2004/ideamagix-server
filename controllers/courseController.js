const Course = require("../models/Course");

// @desc    Create a new course (with image upload)
// @route   POST /api/courses
const createCourse = async (req, res) => {
  try {
    const { name, level, description } = req.body;

    if (!name || !level || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Course image is required" });
    }

    const course = await Course.create({
      name,
      level,
      description,
      image: req.file.path, // cloudinary URL
    });

    res.status(201).json({
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all courses with pagination + search
// @route   GET /api/courses?page=1&limit=10&search=react
const getCourses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";

    // Search by course name (case insensitive)
    const filter = search
      ? { name: { $regex: search, $options: "i" } }
      : {};

    const total = await Course.countDocuments(filter);
    const courses = await Course.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      courses,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalCourses: total,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { createCourse, getCourses, deleteCourse };
