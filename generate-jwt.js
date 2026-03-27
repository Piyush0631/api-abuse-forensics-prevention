const jwt = require("jsonwebtoken");
require("dotenv").config();

// Use your JWT secret from .env
const secret =
  process.env.JWT_SECRET ||
  "my_jwt_secret_key_not_to_be_shared_2026_backend_auth";

// Example payload (customize as needed)
const payload = {
  id: "testuser",
  role: "user",
};

// Token options (optional)
const options = {
  expiresIn: "1d",
};

const token = jwt.sign(payload, secret, options);
console.log("Your JWT token:", token);
