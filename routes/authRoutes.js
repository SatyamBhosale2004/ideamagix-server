const express = require("express");
const { adminLogin, adminRegister, instructorLogin } = require("../controllers/authController");

const router = express.Router();

// Admin auth
router.post("/admin/register", adminRegister);
router.post("/admin/login", adminLogin);

// Instructor auth
router.post("/instructor/login", instructorLogin);

module.exports = router;
