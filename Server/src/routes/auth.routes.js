const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

// Rate Limiters
const authRateLimiter = require("../middleware/authRateLimiter");
const readRateLimiter = require("../middleware/readRateLimiter");
const writeRateLimiter = require("../middleware/writeRateLimiter");

// Controllers
const {
  userRegisterController,
  userLoginController,
  userLogoutController,
  getMeController,
  addBucketController,
  getBucketsController,
  deleteBucketController,
} = require("../controllers/auth.controller");

// Authentication
router.post(
  "/register",
  authRateLimiter,
  userRegisterController
);

router.post(
  "/login",
  authRateLimiter,
  userLoginController
);

router.post(
  "/logout",
  userLogoutController
);

router.get(
  "/me",
  authMiddleware.authMiddleware,
  readRateLimiter,
  getMeController
);

// Buckets
router.post(
  "/buckets",
  authMiddleware.authMiddleware,
  writeRateLimiter,
  addBucketController
);

router.get(
  "/buckets",
  authMiddleware.authMiddleware,
  readRateLimiter,
  getBucketsController
);

router.delete(
  "/buckets/:bucketId",
  authMiddleware.authMiddleware,
  writeRateLimiter,
  deleteBucketController
);

module.exports = router;