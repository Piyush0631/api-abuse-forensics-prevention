const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  type: { type: String, required: true }, // e.g., 'token_misuse'
  token: { type: String, required: true },
  userId: { type: String, required: true },
  ip: { type: String, required: true },
  userAgent: { type: String },
  details: { type: Object },
  timestamp: { type: Date, default: Date.now, index: true },
});

eventSchema.index({ type: 1, token: 1, timestamp: 1 });

module.exports = mongoose.model("Event", eventSchema);
