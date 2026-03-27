const express = require("express");
const { protect } = require("../middlewares/auth.middleware");
const healthController = require("../controllers/healthController");
const redis = require("../config/redis");
const router = express.Router();

router.route("/").get(healthController.healthCheck);

router.route("/protected").get(protect, healthController.protectedHealthCheck);

router.get("/redis-test", async (req, res) => {
  try {
    await redis.set("test-key", "redis is working");
    const value = await redis.get("test-key");
    res.status(200).json({ success: true, value });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
