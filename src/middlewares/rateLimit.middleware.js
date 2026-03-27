const redis = require("../config/redis");

const WINDOW_SIZE_IN_MINUTES = 15;
const MAX_REQUESTS = 100;

/**
 * Rate limiting middleware using Redis.
 * Tracks requests per user (or IP if not authenticated) in a rolling window.
 */
async function rateLimit(req, res, next) {
  try {
    // Use user id if available, otherwise fallback to IP
    const identifier = req.user?.id || req.requestMeta?.ip || req.ip;
    if (!identifier) {
      return res
        .status(400)
        .json({ error: "Cannot identify user or IP for rate limiting." });
    }
    const key = `rate-limit:${identifier}`;
    // Increment the count for this user/IP
    const current = await redis.incr(key);
    if (current === 1) {
      await redis.expire(key, WINDOW_SIZE_IN_MINUTES * 60);
    }
    if (current > MAX_REQUESTS) {
      return res.status(429).json({
        error: `Rate limit exceeded. Max ${MAX_REQUESTS} requests per ${WINDOW_SIZE_IN_MINUTES} minutes.`,
      });
    }
    next();
  } catch (err) {
    console.error("Rate limit middleware error:", err);
    return res
      .status(503)
      .json({ error: "Rate limiting unavailable. Try again later." });
  }
}

module.exports = rateLimit;
