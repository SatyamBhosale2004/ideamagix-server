const Instructor = require("../models/Instructor");
const Course = require("../models/Course");
const Lecture = require("../models/Lecture");

// @desc    Get dashboard stats for admin
// @route   GET /api/dashboard/stats
const getDashboardStats = async (req, res) => {
  try {
    const totalInstructors = await Instructor.countDocuments();
    const totalCourses = await Course.countDocuments();
    const totalLectures = await Lecture.countDocuments();

    // Get upcoming lectures (today or future)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingLectures = await Lecture.countDocuments({
      date: { $gte: today },
    });

    res.status(200).json({
      totalInstructors,
      totalCourses,
      totalLectures,
      upcomingLectures,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getDashboardStats };
