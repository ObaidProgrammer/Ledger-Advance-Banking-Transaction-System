const mongoose = require("mongoose");
const accountModel = require("../models/account.model");
const transactionModel = require("../models/transaction.model");
const cashBookModel = require("../models/cashBook.model");
const systemAccountModel = require("../models/systemAccount.model");
const userModel = require("../models/user.model");
const activityModel = require("../models/activityLog.model");
const adminService = require("../services/admin.service");
const activityService = require("../services/activity.service")


async function getDashboard(req, res) {
  try {
    /**
     * Cash On Hand
     */

    const cashOnHand = await systemAccountModel.findOne({
      code: "1001",
    });

    const cashBalance = cashOnHand
      ? await cashOnHand.getBalance()
      : 0;

    /**
     * Total Customers
     */

const totalCustomers = await userModel.countDocuments({
  role: "CUSTOMER",
});

    /**
     * Total Accounts
     */

    const totalAccounts = await accountModel.countDocuments();

    /**
     * Total Transactions
     */

    const totalTransactions =
      await transactionModel.countDocuments();

    /**
     * Total Deposit
     */

    const deposit = await cashBookModel.aggregate([
      {
        $match: {
          type: "CASH_DEPOSIT",
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$amount",
          },
        },
      },
    ]);

    /**
     * Total Withdraw
     */

    const withdraw = await cashBookModel.aggregate([
      {
        $match: {
          type: "CASH_WITHDRAW",
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$amount",
          },
        },
      },
    ]);

    /**
     * Latest Transactions
     */

    const latestTransactions =
      await transactionModel
        .find()
        .sort({ createdAt: -1 })
        .limit(10)
        .populate({
  path: "performedBy",
  select: "name email role",
})
.populate({
  path: "fromAccount",
  populate: {
    path: "user",
    select: "name",
  },
})
.populate({
  path: "toAccount",
  populate: {
    path: "user",
    select: "name",
  },
});

    return res.status(200).json({
      success: true,
      cashOnHand: cashBalance,

      totalCustomers,

      totalAccounts,

      totalTransactions,

      totalDeposit: deposit[0]?.total || 0,

      totalWithdraw: withdraw[0]?.total || 0,

      latestTransactions,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success:false,
      message: "Unable to load dashboard",
    });
  }}
async function getAllCustomers(req, res) {

  try {

    const result =
      await adminService.getCustomerAggregation(
        req.query
      );

    return res.status(200).json(result);

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      message:
        "Unable to fetch customers",

    });

  }

}
async function getCustomerDetails(req, res) {
  try {
    const { customerId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({
        message: "Invalid Customer ID",
      });
    }

    const result = await adminService.getCustomerAggregation({
      "user._id": new mongoose.Types.ObjectId(customerId),
    });

    if (!result.customers || result.customers.length === 0) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    return res.status(200).json({
      customer: result.customers[0],
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Unable to fetch customer details",
    });
  }
}
async function createAdmin(req, res) {
  try {
    const admin = await adminService.createSystemUser(
      req.body,
      "ADMIN",
      req.user._id
    );

try {
      await activityService.createActivity({
        user: req.user._id,
        action: "CREATE_ADMIN",
        entity: "ADMIN",
        entityId: admin._id,
        description: `${req.user.name} created admin ${admin.name}`,
      });
    } catch (err) {
      console.error("Activity Log Error:", err.message);
    }
    return res.status(201).json({
      message: "Admin created successfully",
      admin,
    });

  } catch (error) {

    if (error.message === "Email already exists") {
      return res.status(409).json({
        message: error.message,
      });
    }

    console.error(error);

    return res.status(500).json({
      message: "Unable to create admin",
    });
  }
}
async function getAllAdmins(req, res) {

  try {

    const result =
      await adminService.getSystemUsers(
        "ADMIN",
        req.user,
        req.query
      );

    return res.status(200).json({

      total: result.total,

      page: result.page,

      pages: result.pages,

      admins: result.users,

    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      message: "Unable to fetch admins",

    });

  }

}
async function getAdminDetails(req, res) {
  try {
    const admin = await adminService.getSystemUser(
      req.params.adminId,
      "ADMIN",
      req.user
    );

    return res.status(200).json({
      admin,
    });

  } catch (error) {

    if (
      error.message === "Invalid ID" ||
      error.message === "Admin not found"
    ) {
      return res.status(404).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Unable to fetch admin details",
    });
  }
}
async function updateAdmin(req, res) {
  try {

    const admin = await adminService.updateSystemUser(
      req.params.adminId,
      "ADMIN",
      req.body,
      req.user
    );
    try {
    await activityService.createActivity({
        user: req.user._id,
        action: "UPDATE_ADMIN",
        entity: "ADMIN",
        entityId: admin._id,
        description: `${req.user.name} updated admin ${admin.name}`,
    });
} catch (err) {
    console.error("Activity Log Error:", err.message);
}

    return res.status(200).json({
      message: "Admin updated successfully",
      admin,
    });

  } catch (error) {

    if (
      error.message === "Invalid ID" ||
      error.message === "Admin not found" ||
      error.message === "Email already exists"
    ) {
      return res.status(400).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Unable to update admin",
    });
  }
}
async function updateAdminStatus(req, res) {
  try {

    const admin = await adminService.updateSystemUserStatus(
      req.params.adminId,
      "ADMIN",
      req.body.status,
      req.user
    );

    try {
    await activityService.createActivity({
        user: req.user._id,
        action: "UPDATE_ADMIN_STATUS",
        entity: "ADMIN",
        entityId: admin._id,
        description: `${req.user.name} changed admin ${admin.name} status to ${admin.status}`,
    });
} catch (err) {
    console.error("Activity Log Error:", err.message);
}

    return res.status(200).json({
      message: `Admin ${admin.status.toLowerCase()} successfully`,
      admin,
    });

  } catch (error) {

    if (
      error.message === "Invalid ID" ||
      error.message === "Admin not found" ||
      error.message === "Invalid Status"
    ) {
      return res.status(400).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Unable to update admin status",
    });
  }
}
async function createCashier(req, res) {
  try {
    const cashier = await adminService.createSystemUser(
      req.body,
      "CASHIER",
      req.user._id
    );
try {
await activityService.createActivity({
  user: req.user._id,
  action: "CREATE_CASHIER",
  entity: "CASHIER",
  entityId: cashier._id,
  description: `${req.user.name} created cashier ${cashier.name}`,
});
         } catch (err) {

      console.error("Activity Log Error:", err.message);

    }
    return res.status(201).json({
      message: "Cashier created successfully",
      cashier,
    });

  } catch (error) {

    if (error.message === "Email already exists") {
      return res.status(409).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Unable to create cashier",
    });
  }
}
async function getAllCashiers(req, res) {

  try {

    const result =
      await adminService.getSystemUsers(
        "CASHIER",
        req.user,
        req.query
      );

    return res.status(200).json({

      total: result.total,

      page: result.page,

      pages: result.pages,

      cashiers: result.users,

    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      message: "Unable to fetch cashiers",

    });

  }

}
async function getCashierDetails(req, res) {
  try {
    const { cashierId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(cashierId)) {
      return res.status(400).json({
        message: "Invalid Cashier ID",
      });
    }
    const cashier = await adminService.getSystemUser(
      cashierId,
      "CASHIER",
      req.user
    );
if (!cashier) {
    return res.status(404).json({
        message: "Cashier not found or access denied"
    });
}
    return res.status(200).json({
      cashier,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Unable to fetch cashier",
    });
  }
}
async function updateCashier(req, res) {
  try {
const cashier =
  await adminService.updateSystemUser(
    req.params.cashierId,
    "CASHIER",
    req.body,
    req.user
  );
      try {
     await activityService.createActivity({
    user: req.user._id,
    action: "UPDATE_CASHIER",
    entity: "CASHIER",
    entityId: cashier._id,
    description: `${req.user.name} updated cashier ${cashier.name}`,
});
    } catch (err) {
      console.error("Activity Log Error:", err.message);
    }
    return res.status(200).json({
      message: "Cashier updated successfully",
      cashier,
    });
  } catch (error) {
    if (error.message === "Email already exists") {
      return res.status(409).json({
        message: error.message,
      });
    }
    if (error.message === "User not found") {
      return res.status(404).json({
        message: error.message,
      });
    }
    return res.status(500).json({
      message: "Unable to update cashier",
    });
  }
}
async function updateCashierStatus(req, res) {
  try {
    const { status } = req.body;
    if (!["ACTIVE", "INACTIVE"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }
    const cashier = await adminService.updateSystemUserStatus(
    req.params.cashierId,
    "CASHIER",
    req.body.status,
    req.user
)
      try {
    await activityService.createActivity({
    user: req.user._id,
    action: "UPDATE_CASHIER_STATUS",
    entity: "CASHIER",
    entityId: cashier._id,
    description: `${req.user.name} changed cashier ${cashier.name} status to ${cashier.status}`,
});
    } catch (err) {
      console.error("Activity Log Error:", err.message);
    }
    return res.status(200).json({
      message: "Cashier status updated successfully",
      cashier,
    });
  } catch (error) {
    if (error.message === "User not found") {
      return res.status(404).json({
        message: error.message,
      });
    }
    return res.status(500).json({
      message: "Unable to update cashier status",
    });
  }
}
async function getAllTransactions(req, res) {
  try {

    const transactions =
      await adminService.getAllTransactions(req.query);

    return res.status(200).json(transactions);

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      message: "Unable to fetch transactions",
    });

  }
}
async function getTransactionDetails(req, res) {
  try {

    const transaction =
      await adminService.getTransactionDetails(
        req.params.transactionId
      );

    return res.status(200).json({
      transaction,
    });

  } catch (error) {

    if (
      error.message === "Invalid Transaction ID" ||
      error.message === "Transaction not found"
    ) {
      return res.status(404).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Unable to fetch transaction",
    });

  }
}
async function getActivityLogs(req, res) {
  try {

    const filters = [];

    /**
     * Permission Filter
     */

    if (req.user.role === "ADMIN") {

      const myCreatedUsers = await userModel
        .find({
          createdBy: req.user._id,
        })
        .select("_id");

      const userIds = myCreatedUsers.map(user => user._id);

      filters.push({
        $or: [
          { user: req.user._id },
          { user: { $in: userIds } },
          { entityId: { $in: userIds } },
        ],
      });

    }

    /**
     * Action Filter
     */

    if (req.query.action) {

      filters.push({
        action: req.query.action,
      });

    }

    /**
     * Entity Filter
     */

    if (req.query.entity) {

      filters.push({
        entity: req.query.entity,
      });

    }
    /**
 * Role Filter
 */

if (req.query.role) {

  const users = await userModel
    .find({
      role: req.query.role,
    })
    .select("_id");

  const userIds = users.map(user => user._id);

  filters.push({
    user: {
      $in: userIds,
    },
  });

}
/**
 * Entity ID Filter
 */

if (req.query.entityId) {

  if (mongoose.Types.ObjectId.isValid(req.query.entityId)) {

    filters.push({
      entityId: req.query.entityId,
    });

  }

}
/**
 * User ID Filter
 */

if (req.query.userId) {

  if (mongoose.Types.ObjectId.isValid(req.query.userId)) {

    filters.push({
      user: req.query.userId,
    });

  }

}
    /**
     * Date Filter
     */

if (req.query.from || req.query.to) {

  const createdAt = {};

  if (req.query.from) {

    const fromDate = new Date(req.query.from);
    fromDate.setUTCHours(0, 0, 0, 0);

    createdAt.$gte = fromDate;
  }

  if (req.query.to) {

    const toDate = new Date(req.query.to);
    toDate.setUTCHours(23, 59, 59, 999);

    createdAt.$lte = toDate;
  }

  filters.push({
    createdAt,
  });

}

    /**
     * Final Query
     */

    const query =
      filters.length > 0
        ? { $and: filters }
        : {};

    /**
     * Pagination
     */

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const total =
      await activityModel.countDocuments(query);

    const logs =
      await activityModel
        .find(query)
        .populate(
          "user",
          "name email role"
        )
        .sort({
          createdAt: -1,
        })
        .skip((page - 1) * limit)
        .limit(limit);

    return res.status(200).json({

      success: true,

      total,

      count: logs.length,

      page,

      pages: Math.ceil(total / limit),

      logs,

    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message: "Unable to fetch activity logs",

    });

  }
}
async function getActivityDetails(req, res) {
  try {

    const { activityId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(activityId)) {
      return res.status(400).json({
        message: "Invalid Activity ID",
      });
    }

    let query = {
      _id: activityId,
    };

    // Admin can only access own team's activities
    if (req.user.role === "ADMIN") {

      const myCreatedUsers = await userModel
        .find({
          createdBy: req.user._id,
        })
        .select("_id");

      const userIds = myCreatedUsers.map(
        user => user._id
      );

      query = {
        _id: activityId,
        $or: [
          {
            user: req.user._id,
          },
          {
            user: {
              $in: userIds,
            },
          },
          {
            entityId: {
              $in: userIds,
            },
          },
        ],
      };

    }

    const activity = await activityModel
      .findOne(query)
     .populate(
  "user",
  "_id name email role"
);

    if (!activity) {
      return res.status(404).json({
        message: "Activity not found",
      });
    }

    return res.status(200).json({
      activity,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      message: "Unable to fetch activity details",
    });

  }
}
async function verifyAccount(req, res) {

  try {

    const account =
      await adminService.verifyAccount(
        req.params.accountId
      );

    return res.status(200).json({
      success: true,
      account,
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: error.message,
    });

  }

}
async function getCashBook(req, res) {

  try {

    const cashBook =
      await adminService.getCashBook(req.query);

    return res.status(200).json(cashBook);

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      message: "Unable to fetch cash book",
    });

  }

}
async function getCashBookDetails(req, res) {

  try {

    const cashBook =
      await adminService.getCashBookDetails(
        req.params.cashBookId
      );

    return res.status(200).json({
      cashBook,
    });

  } catch (error) {

    if (
      error.message === "Invalid Cash Book ID" ||
      error.message === "Cash Book entry not found"
    ) {
      return res.status(404).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Unable to fetch cash book details",
    });

  }

}
module.exports = {
  getDashboard,
  getAllCustomers,
  getCustomerDetails,
  createAdmin,
  getAllAdmins,
  getAdminDetails,
  updateAdmin,
  updateAdminStatus,
  createCashier,
  getAllCashiers,
  getCashierDetails,
  updateCashier,
  updateCashierStatus,
  getAllTransactions,
  getTransactionDetails,
  getActivityLogs,
  getActivityDetails,
  verifyAccount,
  getCashBook,
  getCashBookDetails
};