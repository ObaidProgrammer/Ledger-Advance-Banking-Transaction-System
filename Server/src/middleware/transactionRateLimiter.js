const { rateLimit, ipKeyGenerator } = require("express-rate-limit");

const transactionRateLimiter = rateLimit({
  windowMs: 60 * 1000,
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
      "Too many transaction requests. Please wait 1 minute before trying again.",
  },
});

module.exports = transactionRateLimiter;