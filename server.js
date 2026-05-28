const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.get("/", (req, res) => {
  res.send("HI");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
