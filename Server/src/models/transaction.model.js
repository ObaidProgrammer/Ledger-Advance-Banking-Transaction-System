const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
fromAccount: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "account",
  default: null,
  index: true,
},
toAccount: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "account",
  default: null,
  index: true,
},
    status: {
      type: String,
      enum: {
        values: ["PENDING", "COMPLETED", "FAILED", "REVERSED"],
        message: "Status can be either PENDING, COMPLETED, FAILED or REVERSED",
      },
      default: "PENDING",
    },
    amount: {
      type: Number,
      required: [true, "Amount idd required for creating a transaction"],
      min: [0, "Transaction amount cannot be negative"],
    },
    transactionType: {
  type: String,
  enum: [
    "TRANSFER",
    "CASH_DEPOSIT",
    "CASH_WITHDRAW",
    "OPENING_BALANCE",
    "REVERSAL",
  ],
  default: "TRANSFER",
},
    idempotencyKey: {
      type: String,
      required: [
        true,
        "Idempontency Key is required for creating a transaction",
      ],
      index: true,
      unique: true,
    },
    performedBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "user",
  // required: true,
  default: null,
},
  },
  {
    timestamps: true,
  },
);

transactionSchema.pre("validate", function () {

  if (this.transactionType === "TRANSFER") {
    if (!this.fromAccount || !this.toAccount) {
      throw new Error("TRANSFER requires fromAccount and toAccount");
    }
  }

  if (this.transactionType === "CASH_DEPOSIT") {
    if (!this.toAccount) {
      throw new Error("CASH_DEPOSIT requires toAccount");
    }
  }

  if (this.transactionType === "CASH_WITHDRAW") {
    if (!this.fromAccount) {
      throw new Error("CASH_WITHDRAW requires fromAccount");
    }
  }

});

const transactionModel = mongoose.model("transaction", transactionSchema);

module.exports = transactionModel;
