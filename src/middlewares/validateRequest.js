const Joi = require("joi");
const Event = require("../models/event.model");

// Generic validation middleware factory
function validateRequest(schema, property = "body") {
  return (req, res, next) => {
    const { error } = schema.validate(req[property], { abortEarly: false });
    if (error) {
      // Log tampering attempt to MongoDB (Event model) and terminal
      const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      const userAgent = req.headers["user-agent"];
      const userId = req.user
        ? req.user.id || req.user._id || req.user.username || req.user.email
        : "anonymous";
      const tamperingDetails = {
        route: req.originalUrl,
        method: req.method,
        ip,
        userAgent,
        userId,
        invalidParams: req[property],
        validationErrors: error.details.map((d) => d.message),
        timestamp: new Date().toISOString(),
      };
      // Log to terminal
      console.warn('[Parameter Tampering Detected]', tamperingDetails);
      // Log to DB
      Event.create({
        type: "parameter_tampering",
        token: req.token || "none",
        userId,
        ip,
        userAgent,
        details: {
          route: req.originalUrl,
          method: req.method,
          invalidParams: req[property],
          validationErrors: error.details.map((d) => d.message),
        },
        timestamp: new Date(),
      }).catch((err) => {
        // Fallback: log to terminal if DB logging fails
        console.warn("[Parameter Tampering DB Log Failed]", err);
      });
      return res.status(400).json({
        success: false,
        message: "Invalid request parameters",
        details: error.details.map((d) => d.message),
      });
    }
    next();
  };
}

module.exports = validateRequest;
