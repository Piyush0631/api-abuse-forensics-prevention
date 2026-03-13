const express = require("express");
const healthRoutes = require("./routes/healthroutes");
const errorMiddleware = require("./middlewares/errormiddleware");

const app = express();

app.use(express.json());

app.use("/health", healthRoutes);

app.use(errorMiddleware);

module.exports = app;
