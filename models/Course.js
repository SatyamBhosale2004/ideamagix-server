const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Course name is required"],
      trim: true,
    },
    level: {
      type: String,
      required: [true, "Course level is required"],
      enum: ["Beginner", "Intermediate", "Advanced"],
    },
    description: {
      type: String,
      required: [true, "Course description is required"],
    },
    image: {
      type: String,
      required: [true, "Course image is required"],
    },
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;