const mongoose = require("mongoose");

const cashBookSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "CASH_DEPOSIT",
        "CASH_WITHDRAW",
        "OPENING_BALANCE",
        "CASH_ADJUSTMENT",
      ],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account",
      required: true,
      index: true,
    },

    cashier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },

    transaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "transaction",
      default: null,
    },

    remarks: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("cashBook", cashBookSchema);