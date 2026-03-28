const express = require("express");
const Event = require("../models/event.model");
const router = express.Router();

// GET /events?type=token_misuse (or any type)
router.get("/", async (req, res) => {
  try {
    const { type } = req.query;
    const filter = type ? { type } : {};
    const events = await Event.find(filter).sort({ timestamp: -1 }).limit(100);
    res.json({ success: true, count: events.length, events });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
