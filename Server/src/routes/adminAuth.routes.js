const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");

const authRateLimiter = require("../middleware/authRateLimiter");
const readRateLimiter = require("../middleware/readRateLimiter");

const {
  adminLoginController,
  adminMeController,
  adminLogoutController,
} = require("../controllers/adminAuth.controller");

router.post(
  "/login",
  authRateLimiter,
  adminLoginController
);

router.get(
  "/me",
  authMiddleware,
  authorize("ADMIN", "SUPER_ADMIN", "CASHIER"),
  readRateLimiter,
  adminMeController
);

router.post(
  "/logout",
  authMiddleware,
  authorize("ADMIN", "SUPER_ADMIN", "CASHIER"),
  adminLogoutController
);

module.exports = router;