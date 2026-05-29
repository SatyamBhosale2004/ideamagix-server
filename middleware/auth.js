const jwt = require("jsonwebtoken");

// Verify JWT token - protects routes that need login
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided, access denied" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Only allow admins
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

// Only allow instructors
const isInstructor = (req, res, next) => {
  if (req.user.role !== "instructor") {
    return res.status(403).json({ message: "Access denied. Instructors only." });
  }
  next();
};

module.exports = { verifyToken, isAdmin, isInstructor };
