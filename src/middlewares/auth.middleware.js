const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const catchAsync = require("../utils/catchasync");
const AppError = require("../utils/apperror");

// Synchronous JWT authentication and metadata extraction
function jwtAuth(req, res, next) {
  const authHeader = req.headers["authorization"];
  let token;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7);
  }
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_jwt_secret",
    );
    req.user = decoded;
    req.token = token; // Add this line to expose the raw JWT for downstream middleware
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
  req.requestMeta = {
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.headers["user-agent"] || "",
    path: req.originalUrl,
    method: req.method,
  };
  next();
}

// Async JWT authentication with AppError/catchAsync, attaches id/role and metadata
const protect = catchAsync
  ? catchAsync(async (req, res, next) => {
      let token;
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer ")
      ) {
        token = req.headers.authorization.split(" ")[1];
      }
      if (!token) {
        return next(
          new AppError("You are not logged in. Please provide a token", 401),
        );
      }
      const decoded = await promisify(jwt.verify)(
        token,
        process.env.JWT_SECRET || "your_jwt_secret",
      );
      req.user = {
        id: decoded.id,
        role: decoded.role,
      };
      req.requestMeta = {
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.headers["user-agent"] || "",
        path: req.originalUrl,
        method: req.method,
      };
      next();
    })
  : undefined;

module.exports = protect ? { jwtAuth, protect } : jwtAuth;
