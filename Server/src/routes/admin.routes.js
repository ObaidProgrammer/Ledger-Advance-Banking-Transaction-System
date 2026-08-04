const { Router } = require("express");
const adminController = require("../controllers/admin.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");
const readRateLimiter = require("../middleware/readRateLimiter");
const writeRateLimiter = require("../middleware/writeRateLimiter");
const verifyRateLimiter = require("../middleware/verifyRateLimiter");

const router = Router();

router.get(
  "/dashboard",
  authMiddleware.authMiddleware,
  readRateLimiter,
  adminController.getDashboard
);

router.get(
    "/customers",
    authMiddleware.authMiddleware,
    authorize("SUPER_ADMIN","ADMIN","CASHIER"),
    readRateLimiter,
    adminController.getAllCustomers
);

router.get(
    "/customers/:customerId",
    authMiddleware.authMiddleware,
    authorize("SUPER_ADMIN", "ADMIN", "CASHIER"),
    readRateLimiter,
    adminController.getCustomerDetails
);

router.post(
  "/admins",
  authMiddleware.authMiddleware,
  authorize("SUPER_ADMIN"),
  writeRateLimiter,
  adminController.createAdmin
);

router.get(
  "/admins",
  authMiddleware.authMiddleware,
  authorize("SUPER_ADMIN"),
  readRateLimiter,
  adminController.getAllAdmins
);

router.get(
  "/admins/:adminId",
  authMiddleware.authMiddleware,
  authorize("SUPER_ADMIN"),
  readRateLimiter,
  adminController.getAdminDetails
);

router.patch(
  "/admins/:adminId",
  authMiddleware.authMiddleware,
  authorize("SUPER_ADMIN"),
  writeRateLimiter,
  adminController.updateAdmin
);

router.patch(
  "/admins/:adminId/status",
  authMiddleware.authMiddleware,
  authorize("SUPER_ADMIN"),
  writeRateLimiter,
  adminController.updateAdminStatus
);

router.post(
  "/cashiers",
  authMiddleware.authMiddleware,
  authorize("SUPER_ADMIN", "ADMIN",),
  writeRateLimiter,
  adminController.createCashier
);

router.get(
  "/cashiers",
  authMiddleware.authMiddleware,
  authorize("SUPER_ADMIN", "ADMIN"),
  readRateLimiter,
  adminController.getAllCashiers
);

router.get(
  "/cashiers/:cashierId",
  authMiddleware.authMiddleware,
  authorize("SUPER_ADMIN", "ADMIN"),
  readRateLimiter,
  adminController.getCashierDetails
);

router.patch(
  "/cashiers/:cashierId",
  authMiddleware.authMiddleware,
  authorize("SUPER_ADMIN", "ADMIN"),
  writeRateLimiter,
  adminController.updateCashier
);

router.patch(
  "/cashiers/:cashierId/status",
  authMiddleware.authMiddleware,
  authorize("SUPER_ADMIN", "ADMIN"),
  writeRateLimiter,
  adminController.updateCashierStatus
);

router.get(
  "/transactions",
  authMiddleware.authMiddleware,
  authorize("SUPER_ADMIN", "ADMIN", "CASHIER"),
  readRateLimiter,
  adminController.getAllTransactions
);

router.get(
  "/transactions/:transactionId",
  authMiddleware.authMiddleware,
  authorize("SUPER_ADMIN", "ADMIN", "CASHIER"),
  readRateLimiter,
  adminController.getTransactionDetails
);

router.get(
  "/activities",
  authMiddleware.authMiddleware,
  authorize("SUPER_ADMIN", "ADMIN"),
  readRateLimiter,
  adminController.getActivityLogs
);

router.get(
  "/activities/:activityId",
  authMiddleware.authMiddleware,
  authorize("SUPER_ADMIN", "ADMIN"),
  readRateLimiter,
  adminController.getActivityDetails
);

router.get(
  "/accounts/verify/:accountId",
  authMiddleware.authMiddleware,
  authorize("SUPER_ADMIN", "ADMIN", "CASHIER"),
  verifyRateLimiter,
  adminController.verifyAccount
);

router.get(
  "/cash-book",
  authMiddleware.authMiddleware,
  authorize("SUPER_ADMIN", "ADMIN", "CASHIER"),
  readRateLimiter,
  adminController.getCashBook
);

router.get(
  "/cash-book/:cashBookId",
  authMiddleware.authMiddleware,
  authorize("SUPER_ADMIN", "ADMIN", "CASHIER"),
  readRateLimiter,
  adminController.getCashBookDetails
);

module.exports = router;