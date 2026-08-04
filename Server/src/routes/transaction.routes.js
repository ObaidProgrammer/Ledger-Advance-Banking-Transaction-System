const { Router } = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const transactionController = require("../controllers/transaction.controller");
const transactionRoutes = Router();
const { authorize } = require("../middleware/role.middleware");
const transactionRateLimiter = require("../middleware/transactionRateLimiter");

/**
 * - POST /api/transactions/
 * - Create a new transaction
 */

transactionRoutes.post(
  "/",
  authMiddleware.authMiddleware,
  transactionRateLimiter,
  transactionController.createTransaction,
);

transactionRoutes.post(
    "/cash/deposit",
    authMiddleware.authMiddleware,
    authorize("SUPER_ADMIN","ADMIN","CASHIER"),
    transactionRateLimiter,
    transactionController.cashDepositController
);

transactionRoutes.post(
    "/cash/withdraw",
    authMiddleware.authMiddleware,
    authorize("SUPER_ADMIN","ADMIN","CASHIER"),
    transactionRateLimiter,
    transactionController.cashWithdrawController
);

module.exports = transactionRoutes;
