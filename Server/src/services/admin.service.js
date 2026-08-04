const accountModel = require("../models/account.model");
const userModel = require("../models/user.model");
const transactionModel = require("../models/transaction.model");
const cashBookModel = require("../models/cashBook.model");
const mongoose = require("mongoose");

async function getCustomerAggregation(match = {}) {

  const page = Number(match.page) || 1;
  const limit = Number(match.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = {
    "user.role": "CUSTOMER",
  };
if (match["user._id"]) {
  filter["user._id"] = match["user._id"];
}
  if (match.filterBy && match.value) {

    switch (match.filterBy) {

      case "name":

        filter["user.name"] = {
          $regex: match.value,
          $options: "i",
        };

        break;

      case "email":

        filter["user.email"] = {
          $regex: match.value,
          $options: "i",
        };

        break;

      case "accountId":

        if (mongoose.Types.ObjectId.isValid(match.value)) {

          filter["_id"] =
            new mongoose.Types.ObjectId(match.value);

        }

        break;

      case "status":

        filter.status = match.value;

        break;

    }

  }

  // Total Customers
  const totalResult = await accountModel.aggregate([

    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },

    {
      $unwind: "$user",
    },

    {
      $match: filter,
    },

    {
      $count: "total",
    },

  ]);

  const total =
    totalResult.length > 0
      ? totalResult[0].total
      : 0;

  // Customers
  const customers = await accountModel.aggregate([

    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },

    {
      $unwind: "$user",
    },

    {
      $match: filter,
    },

    {
      $lookup: {
        from: "ledgers",
        let: {
          accountId: "$_id",
        },
        pipeline: [

          {
            $match: {
              $expr: {
                $eq: [
                  "$account",
                  "$$accountId",
                ],
              },
            },
          },

          {
            $group: {

              _id: null,

              totalCredit: {
                $sum: {
                  $cond: [
                    {
                      $eq: [
                        "$type",
                        "CREDIT",
                      ],
                    },
                    "$amount",
                    0,
                  ],
                },
              },

              totalDebit: {
                $sum: {
                  $cond: [
                    {
                      $eq: [
                        "$type",
                        "DEBIT",
                      ],
                    },
                    "$amount",
                    0,
                  ],
                },
              },

            },
          },

        ],
        as: "balanceData",
      },
    },

    {
      $addFields: {

        balance: {

          $subtract: [

            {
              $ifNull: [
                {
                  $arrayElemAt: [
                    "$balanceData.totalCredit",
                    0,
                  ],
                },
                0,
              ],
            },

            {
              $ifNull: [
                {
                  $arrayElemAt: [
                    "$balanceData.totalDebit",
                    0,
                  ],
                },
                0,
              ],
            },

          ],

        },

      },
    },

    {
      $project: {

        customerId: "$user._id",

        name: "$user.name",

        email: "$user.email",

        accountId: "$_id",

        status: 1,

        currency: 1,

        balance: 1,

        createdAt: "$user.createdAt",

      },
    },

    {
      $sort: {
        createdAt: -1,
      },
    },

    {
      $skip: skip,
    },

    {
      $limit: limit,
    },

  ]);

  return {

    total,

    page,

    pages: Math.ceil(total / limit),

    customers,

  };

}
async function createSystemUser(data, role,createdBy,) {
  const { name, email, password } = data;

  const exists = await userModel.findOne({ email });

  if (exists) {
    throw new Error("Email already exists");
  }

  const user = await userModel.create({
    name,
    email,
    password,
    role,
    status: "ACTIVE",
    createdBy
  });

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt,
  };
}
async function getSystemUsers(role, currentUser, query = {}) {

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = { role };

  // ADMIN sirf apne create kiye huye users dekhe
  if (currentUser.role === "ADMIN") {
    filter.createdBy = currentUser._id;
  }

  // Filtering
  if (query.filterBy && query.value) {

    switch (query.filterBy) {

      case "name":
        filter.name = {
          $regex: query.value,
          $options: "i",
        };
        break;

      case "email":
        filter.email = {
          $regex: query.value,
          $options: "i",
        };
        break;

      case "status":
        filter.status = query.value;
        break;

    }

  }

  const total = await userModel.countDocuments(filter);

  const users = await userModel
    .find(filter)
    .select("name email role status createdBy createdAt")
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return {

    total,

    page,

    pages: Math.ceil(total / limit),

    users,

  };

}
async function getSystemUser(id, role, currentUser) {

  const filter = {
    _id: id,
    role,
  };

  if (currentUser.role === "ADMIN") {
    filter.createdBy = currentUser._id;
  }

  const user = await userModel
    .findOne(filter)
    .select("name email role status createdBy createdAt")
    .populate("createdBy", "name email");

  return user;
}
async function updateSystemUser(id, role, data, currentUser) {
 const filter = {
    _id:id,
    role,
};

if(currentUser.role==="ADMIN"){
    filter.createdBy=currentUser._id;
}

const user = await userModel.findOne(filter);

  if (!user) {
    throw new Error("User not found");
  }

  if (data.email && data.email !== user.email) {
    const exists = await userModel.findOne({
      email: data.email,
    });

    if (exists) {
      throw new Error("Email already exists");
    }

    user.email = data.email;
  }

  if (data.name) {
    user.name = data.name;
  }

  await user.save();

  return user;
}
async function updateSystemUserStatus(
    id,
    role,
    status,
    currentUser
) {

    const filter = {
        _id: id,
        role,
    };

    if (currentUser.role === "ADMIN") {
        filter.createdBy = currentUser._id;
    }

    const user = await userModel.findOne(filter);

    if (!user) {
        throw new Error("User not found");
    }

    user.status = status;

    await user.save();

    return user;

}
async function getAllTransactions(query) {

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    const filter = {};

    if (query.filterBy && query.value) {

        switch (query.filterBy) {

            case "accountId":

                filter.$or = [
                    {
                        fromAccount: query.value,
                    },
                    {
                        toAccount: query.value,
                    },
                ];

                break;

            case "transactionType":

                filter.transactionType = query.value;

                break;

            case "status":

                filter.status = query.value;

                break;

        }

    }

    const total =
        await transactionModel.countDocuments(filter);

    const transactions =
        await transactionModel
            .find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate({
                path: "performedBy",
                select: "name email role",
            })
            .populate({
                path: "fromAccount",
                populate: {
                    path: "user",
                    select: "name email",
                },
            })
            .populate({
                path: "toAccount",
                populate: {
                    path: "user",
                    select: "name email",
                },
            });

    return {

        total,

        page,

        pages: Math.ceil(total / limit),

        transactions,

    };

}
async function getTransactionDetails(transactionId) {

    if (
        !mongoose.Types.ObjectId.isValid(transactionId)
    ) {
        throw new Error("Invalid Transaction ID");
    }

    const transaction =
        await transactionModel

            .findById(transactionId)

            .populate({
                path: "performedBy",
                select: "name email role",
            })

            .populate({
                path: "fromAccount",
                populate: {
                    path: "user",
                    select: "name email",
                },
            })

            .populate({
                path: "toAccount",
                populate: {
                    path: "user",
                    select: "name email",
                },
            });

    if (!transaction) {
        throw new Error("Transaction not found");
    }

    return transaction;

}
async function verifyAccount(accountId) {

  if (!mongoose.Types.ObjectId.isValid(accountId)) {
    throw new Error("Invalid Account ID");
  }

  const account = await accountModel
    .findById(accountId)
    .populate({
      path: "user",
      select: "name email",
    });

  if (!account) {
    throw new Error("Account not found");
  }

  if (account.status !== "ACTIVE") {
    throw new Error("Account is not active");
  }

  const balance = await account.getBalance();

  return {

    accountId: account._id,

    customerId: account.user._id,

    name: account.user.name,

    email: account.user.email,

    status: account.status,

    currency: account.currency,

    balance,

  };

}
async function getCashBook(query) {

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;

const filter = {};

if (query.filterBy && query.value) {

  switch (query.filterBy) {

    case "accountId":

      filter.account = query.value;

      break;

    case "type":

      filter.type = query.value;

      break;

    case "status":

      break;

  }

}

  const total =
    await cashBookModel.countDocuments(filter);

  const cashBook =
    await cashBookModel

      .find(filter)

      .sort({ createdAt: -1 })

      .skip((page - 1) * limit)

      .limit(limit)

      .populate({
        path: "account",
        populate: {
          path: "user",
          select: "name email",
        },
      })

      .populate({
        path: "cashier",
        select: "name email role",
      })

      .populate({
        path: "transaction",
      });

  return {

    total,

    page,

    pages: Math.ceil(total / limit),

    cashBook,

  };

}
async function getCashBookDetails(cashBookId) {

  if (!mongoose.Types.ObjectId.isValid(cashBookId)) {
    throw new Error("Invalid Cash Book ID");
  }

  const cashBook = await cashBookModel
    .findById(cashBookId)

    .populate({
      path: "account",
      populate: {
        path: "user",
        select: "name email",
      },
    })

    .populate({
      path: "cashier",
      select: "name email role",
    })

    .populate({
      path: "transaction",
      populate: {
        path: "performedBy",
        select: "name email role",
      },
    });

  if (!cashBook) {
    throw new Error("Cash Book entry not found");
  }

  return cashBook;
}
module.exports = {
  getCustomerAggregation,
  createSystemUser,
  getSystemUsers,
  getSystemUser,
  updateSystemUser,
  updateSystemUserStatus,
  getAllTransactions,
  getTransactionDetails,
  verifyAccount,
  getCashBook,
  getCashBookDetails,
};