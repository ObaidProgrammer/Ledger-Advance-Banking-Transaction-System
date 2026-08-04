const mongoose = require("mongoose");
const ledgerModel = require("./ledger.model");

const systemAccountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },

    code: {
      type: String,
      required: true,
      unique: true,
    },

    type: {
      type: String,
      enum: [
        "ASSET",
        "LIABILITY",
        "INCOME",
        "EXPENSE",
        "EQUITY",
      ],
      required: true,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
  },
);

systemAccountSchema.methods.getBalance = async function () {

  const balanceData = await ledgerModel.aggregate([
    {
      $match: {
        systemAccount: this._id,
      },
    },
    {
      $group: {
        _id: null,

        totalDebit: {
          $sum: {
            $cond: [
              { $eq: ["$type", "DEBIT"] },
              "$amount",
              0,
            ],
          },
        },

        totalCredit: {
          $sum: {
            $cond: [
              { $eq: ["$type", "CREDIT"] },
              "$amount",
              0,
            ],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,

        balance: {
          $subtract: [
            "$totalDebit",
            "$totalCredit",
          ],
        },
      },
    },
  ]);

  if (balanceData.length === 0) {
    return 0;
  }

  return balanceData[0].balance;
};

const systemAccountModel = mongoose.model(
  "systemAccount",
  systemAccountSchema,
);

module.exports = systemAccountModel;
