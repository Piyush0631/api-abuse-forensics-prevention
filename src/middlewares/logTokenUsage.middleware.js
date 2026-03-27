const TokenUsage = require("../models/tokenUsage.model");
const Event = require("../models/event.model");

// Middleware to log token usage and detect misuse
async function logTokenUsage(req, res, next) {
  try {
    // Only log if user is authenticated (JWT middleware should run before this)
    if (!req.user || !req.token) return next();

    const userId = req.user.id || req.user._id || req.userId;
    const token = req.token;
    // Use X-Forwarded-For for local/dev testing, fallback to socket address
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"] || "";
    const now = new Date();

    // Log this usage
    await TokenUsage.create({
      token,
      userId,
      ip,
      userAgent,
      timestamp: now,
    });

    // Check for token misuse: same token, different IPs in last 10 min
    const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);
    const recentUsages = await TokenUsage.find({
      token,
      timestamp: { $gte: tenMinutesAgo },
    });
    const uniqueIps = new Set(recentUsages.map((u) => u.ip));

    if (uniqueIps.size > 1) {
      req.tokenMisuseDetected = true;
      console.log(
        "[Token Misuse Detected] Token:",
        token,
        "User:",
        userId,
        "IPs:",
        Array.from(uniqueIps),
      );
      // Log a dedicated misuse event for analytics/monitoring
      await Event.create({
        type: "token_misuse",
        token,
        userId,
        ip,
        userAgent,
        details: {
          uniqueIps: Array.from(uniqueIps),
          recentUsages: recentUsages.map((u) => ({
            ip: u.ip,
            timestamp: u.timestamp,
          })),
        },
        timestamp: now,
      });
    }

    next();
  } catch (err) {
    console.error("Token usage logging error:", err);
    next();
  }
}

module.exports = logTokenUsage;
