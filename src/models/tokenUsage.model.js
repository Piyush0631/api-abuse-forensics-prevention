const mongoose = require("mongoose");

const tokenUsageSchema = new mongoose.Schema({
  token: { type: String, required: true },
  userId: { type: String, required: true },
  ip: { type: String, required: true },
  userAgent: { type: String },
  timestamp: { type: Date, default: Date.now, index: true },
});

tokenUsageSchema.index({ token: 1, timestamp: 1 });

tokenUsageSchema.index({ token: 1, ip: 1, timestamp: 1 });

module.exports = mongoose.model("TokenUsage", tokenUsageSchema);
