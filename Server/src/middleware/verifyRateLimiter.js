const { rateLimit, ipKeyGenerator } = require("express-rate-limit");

const verifyRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,

   keyGenerator: (req) => {
    return req.user?._id?.toString() || ipKeyGenerator(req);
  },

  standardHeaders: true,
  legacyHeaders: false,
  statusCode: 429,

  message: {
    success: false,
    message:
      "Too many account verification requests. Please try again in 1 minute.",
  },
});

module.exports = verifyRateLimiter;