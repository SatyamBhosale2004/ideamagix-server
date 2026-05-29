const mongoose = require("mongoose");

const lectureSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course is required"],
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Instructor",
      required: [true, "Instructor is required"],
    },
    title: {
      type: String,
      required: [true, "Lecture title is required"],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "Lecture date is required"],
    },
    time: {
      type: String, // optional - like "10:00 AM"
    },
    batch: {
      type: String,
      required: [true, "Batch name is required"],
      trim: true,
    },
  },
  { timestamps: true }
);

const Lecture = mongoose.model("Lecture", lectureSchema);

module.exports = Lecture;
