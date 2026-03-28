const express = require("express");
const { protect } = require("../middlewares/auth.middleware");
const healthController = require("../controllers/healthController");
const redis = require("../config/redis");
const Joi = require("joi");
const validateRequest = require("../middlewares/validateRequest");
const router = express.Router();

// Joi schema for health check query params
const healthCheckQuerySchema = Joi.object({
  ping: Joi.string().optional(),
});

router
  .route("/")
  .get(
    validateRequest(healthCheckQuerySchema, "query"),
    healthController.healthCheck,
  );

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
