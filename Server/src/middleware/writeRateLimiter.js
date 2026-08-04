const { rateLimit, ipKeyGenerator } = require("express-rate-limit");

const writeRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,

   keyGenerator: (req) => {
    return req.user?._id?.toString() || ipKeyGenerator(req);
  },

  standardHeaders: true,
  legacyHeaders: false,
  statusCode: 429,

  message: {
    success: false,
    message:
      "Too many write requests. Please wait 1 minute before trying again.",
  },
});

module.exports = writeRateLimiter;