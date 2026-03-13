const express = require("express");
const authController = require("../middlewares/authmiddleware");
const healthController = require("../controllers/healthController");
const router = express.Router();

router.route("/").get(healthController.healthCheck);

router
  .route("/protected")
  .get(authController.protect, healthController.protectedHealthCheck);

module.exports = router;
