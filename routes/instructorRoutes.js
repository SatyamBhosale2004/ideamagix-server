const express = require ("express");

const Instructor = require("../models/instructor");

const router = express.Router();

router.post("/", async(req,res) => {
    try{
        const {name, email, password} = req.body;

        const instructor = await Instructor.create({
            name,
            email,
            password
        });

        res.status(201).json({
            message: "Instructor created successfully",
            instructor,
        });
    }catch (err){
        res.status(500).json({
            message: "Server Error",
            error: error.message,
        });
    }
});

router.get("/", async(req,res) => {
    try{
        const instructors = await Instructor.find();

        res.status(200).json(instructors);
    }catch(err){
        res.status(500).json({
            message: "Server Error",
            error: error.message,
        });
    }
})


module.exports = router;