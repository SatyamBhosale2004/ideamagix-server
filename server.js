const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const instructorRoutes = require("./routes/instructorRoutes");
const courseRoutes = require("./routes/courseRoutes");
require("dotenv").config();

const app = express();

app.use(cors()); 

app.use(express.json());
app.use("/api/instructors", instructorRoutes);
app.use("/api/courses", courseRoutes);
app.get("/", (req, res) => {
  res.send("api running");
});


const PORT = process.env.PORT || 5000;



mongoose 
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Mongo connected");

    app.listen(PORT, () => {
    console.log(`Backend server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(err);
  });
