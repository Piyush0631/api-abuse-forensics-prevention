const express = require("express");
const User = require("../models/user.model");
const { protect } = require("../middlewares/auth.middleware");
const Event = require("../models/event.model");
const jwt = require("jsonwebtoken");
const router = express.Router();

// POST /user/register - Register a new user
router.post("/register", async (req, res) => {
  try {
    const { username, email } = req.body;
    if (!username || !email) {
      return res
        .status(400)
        .json({ success: false, message: "Username and email are required" });
    }
    const existing = await User.findOne({ $or: [{ username }, { email }] });
    if (existing) {
      return res
        .status(409)
        .json({ success: false, message: "Username or email already exists" });
    }
    const user = await User.create({ username, email });
    res.status(201).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /user/login - Login and get JWT (no password for demo)
router.post("/login", async (req, res) => {
  try {
    const { username, email } = req.body;
    if (!username && !email) {
      return res
        .status(400)
        .json({ success: false, message: "Username or email required" });
    }
    const user = await User.findOne(username ? { username } : { email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }
    // For demo, no password check
    const token = jwt.sign(
      { id: user._id.toString(), username: user.username, email: user.email },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "1h" },
    );
    res.json({ success: true, token, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /user/:id - Protected, BOLA check
router.get("/:id", protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    // BOLA check: Only allow access if JWT user matches resource owner
    if (
      req.user.id !== user._id.toString() &&
      req.user._id !== user._id.toString() &&
      req.user.username !== user.username &&
      req.user.email !== user.email
    ) {
      // Log BOLA violation
      await Event.create({
        type: "bola_violation",
        token: req.token || "none",
        userId:
          req.user.id || req.user._id || req.user.username || req.user.email,
        ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
        userAgent: req.headers["user-agent"],
        details: {
          attemptedUserId: req.params.id,
          jwtUser: req.user,
        },
        timestamp: new Date(),
      });
      return res
        .status(403)
        .json({ success: false, message: "Access denied (BOLA violation)" });
    }
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
