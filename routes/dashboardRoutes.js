const express = require("express");
const { getDashboardStats } = require("../controllers/dashboardController");
const { verifyToken, isAdmin } = require("../middleware/auth");

const router = express.Router();

router.get("/stats", verifyToken, isAdmin, getDashboardStats);

module.exports = router;
