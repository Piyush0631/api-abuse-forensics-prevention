const express = require("express");
const healthRoutes = require("./routes/healthroutes");
const errorMiddleware = require("./middlewares/errormiddleware");
const { jwtAuth } = require("./middlewares/auth.middleware");
const rateLimit = require("./middlewares/rateLimit.middleware");
const logTokenUsage = require("./middlewares/logTokenUsage.middleware");

const app = express();

app.use(express.json());

app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));

// Protected and rate-limited routes
app.use(jwtAuth);
app.use(logTokenUsage); // Log token usage after JWT auth
app.use(rateLimit);
app.use("/health", healthRoutes);

app.use(errorMiddleware);

module.exports = app;
