const rateLimit = require("express-rate-limit");

const authRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,

  standardHeaders: true,
  legacyHeaders: false,
  statusCode: 429,

  message: {
    success: false,
    message: "Too many login attempts. Please wait 1 minute before trying again.",
  },
});

module.exports = authRateLimiter;