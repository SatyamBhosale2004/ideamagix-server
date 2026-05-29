const express = require("express");

const Course = require("../model/Course");

const upload = require("../middleware/uploadMiddleware");

const router = express.Router();
router.post("/",upload.single("image"), async (req,res) => {
    try{
        const {name,level,description} = req.body;

        const course = await Course.create({
            name,
            level,
            description,
            image: req.file.path,
        });

        res.status(201).json({
            message: "Course created",
            course,
        });
    } catch(err){
        res.status(500).json({
            message: "Server Error",
            error: err.message,
        });
    }
});

router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();

    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
});

module.exports = router;