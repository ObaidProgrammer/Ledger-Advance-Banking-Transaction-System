const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const accountController = require("../controllers/account.controller");
const router = express.Router();
const readRateLimiter = require("../middleware/readRateLimiter");
const writeRateLimiter = require("../middleware/writeRateLimiter");
const verifyRateLimiter = require("../middleware/verifyRateLimiter");

/*
 * - POST /api/accounts/
 * - Create a new account
 * - Protected Route
 */
router.post(
  "/",
  authMiddleware.authMiddleware,
  writeRateLimiter,
  accountController.createAccountController,
);

/**
 * - GET /api/accounts/
 * - GET all account of logged-in user
 * - Protected Route
 */
router.get(
  "/",
  authMiddleware.authMiddleware,
  readRateLimiter,
  accountController.getUserAccountsController,
);

/**
 * - GET /api/accounts/balance/:accountId
 */
router.get(
  "/balance/:accountId",
  authMiddleware.authMiddleware,
  readRateLimiter,
  accountController.getAccountsBalanceController,
);

/**
 *  - Get /api/lookup/:accountId
 */
router.get(
  "/lookup/:accountId",
  authMiddleware.authMiddleware,
  verifyRateLimiter,
  accountController.getlookupAccountController,
);

module.exports = router;
