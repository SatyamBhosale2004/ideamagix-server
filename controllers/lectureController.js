const Lecture = require("../models/Lecture");

// @desc    Create a new lecture (with date clash prevention)
// @route   POST /api/lectures
const createLecture = async (req, res) => {
  try {
    const { course, instructor, title, date, time, batch } = req.body;

    if (!course || !instructor || !title || !date || !batch) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    // --- CLASH PREVENTION LOGIC ---
    // Check if this instructor already has a lecture on the same date
    const lectureDate = new Date(date);
    const startOfDay = new Date(lectureDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(lectureDate.setHours(23, 59, 59, 999));

    const existingLecture = await Lecture.findOne({
      instructor,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    if (existingLecture) {
      return res.status(409).json({
        message: "This instructor already has a lecture scheduled on this date. Please choose a different date or instructor.",
      });
    }
    // --- END CLASH PREVENTION ---

    const lecture = await Lecture.create({
      course,
      instructor,
      title,
      date,
      time,
      batch,
    });

    // Populate course and instructor details before sending response
    const populatedLecture = await Lecture.findById(lecture._id)
      .populate("course", "name level")
      .populate("instructor", "name email");

    res.status(201).json({
      message: "Lecture created successfully",
      lecture: populatedLecture,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all lectures with pagination
// @route   GET /api/lectures?page=1&limit=10
const getLectures = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Lecture.countDocuments();
    const lectures = await Lecture.find()
      .populate("course", "name level image")
      .populate("instructor", "name email")
      .skip(skip)
      .limit(limit)
      .sort({ date: -1 });

    res.status(200).json({
      lectures,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalLectures: total,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get lectures for a specific instructor
// @route   GET /api/lectures/instructor/:instructorId
const getLecturesByInstructor = async (req, res) => {
  try {
    const lectures = await Lecture.find({ instructor: req.params.instructorId })
      .populate("course", "name level image")
      .populate("instructor", "name email")
      .sort({ date: -1 });

    res.status(200).json(lectures);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update a lecture
// @route   PUT /api/lectures/:id
const updateLecture = async (req, res) => {
  try {
    const { course, instructor, title, date, time, batch } = req.body;

    // If date or instructor is being changed, check for clash
    if (date || instructor) {
      const lectureDate = new Date(date || (await Lecture.findById(req.params.id)).date);
      const instructorId = instructor || (await Lecture.findById(req.params.id)).instructor;

      const startOfDay = new Date(new Date(lectureDate).setHours(0, 0, 0, 0));
      const endOfDay = new Date(new Date(lectureDate).setHours(23, 59, 59, 999));

      const existingLecture = await Lecture.findOne({
        instructor: instructorId,
        date: { $gte: startOfDay, $lte: endOfDay },
        _id: { $ne: req.params.id }, // exclude current lecture
      });

      if (existingLecture) {
        return res.status(409).json({
          message: "This instructor already has a lecture on this date.",
        });
      }
    }

    const updatedLecture = await Lecture.findByIdAndUpdate(
      req.params.id,
      { course, instructor, title, date, time, batch },
      { new: true, runValidators: true }
    )
      .populate("course", "name level")
      .populate("instructor", "name email");

    if (!updatedLecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    res.status(200).json({
      message: "Lecture updated successfully",
      lecture: updatedLecture,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete a lecture
// @route   DELETE /api/lectures/:id
const deleteLecture = async (req, res) => {
  try {
    const lecture = await Lecture.findByIdAndDelete(req.params.id);

    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    res.status(200).json({ message: "Lecture deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createLecture,
  getLectures,
  getLecturesByInstructor,
  updateLecture,
  deleteLecture,
};
