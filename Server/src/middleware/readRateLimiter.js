const { rateLimit, ipKeyGenerator } = require("express-rate-limit");
const readRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute

  max: 60,

 keyGenerator: (req) => {
    return req.user?._id?.toString() || ipKeyGenerator(req);
  },

  standardHeaders: true,

  legacyHeaders: false,

  statusCode: 429,

  message: {
    success: false,
    message: "Request limit exceeded. Please try again in 1 minute.",
  },
});

module.exports = readRateLimiter;