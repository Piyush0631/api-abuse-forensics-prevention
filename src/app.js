const express = require("express");
const healthRoutes = require("./routes/healthroutes");
const userRoutes = require("./routes/userroutes");
const eventRoutes = require("./routes/eventroutes");
const errorMiddleware = require("./middlewares/errormiddleware");
const { jwtAuth } = require("./middlewares/auth.middleware");
const rateLimit = require("./middlewares/rateLimit.middleware");
const logTokenUsage = require("./middlewares/logTokenUsage.middleware");

const app = express();

app.use(express.json());

app.use("/health", healthRoutes);

app.use("/user", userRoutes);
app.use("/events", eventRoutes);

// Protected and rate-limited routes (for other protected APIs)
app.use(jwtAuth);
app.use(logTokenUsage);
app.use(rateLimit);

app.use(errorMiddleware);

module.exports = app;
