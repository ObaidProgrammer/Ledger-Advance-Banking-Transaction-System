const mongoose = require("mongoose");

const LedgerSchema = new mongoose.Schema({
  account: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "account",
  default: null,
  index: true,
  immutable: true,
},

systemAccount: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "systemAccount",
  default: null,
  index: true,
  immutable: true,
},
  amount: {
    type: Number,
    required: [true, "Amount is required for creating a ledger entry"],
    immutable: true,
  },
  transaction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "transaction",
    required: [true, "Ledger must be associated a trasaction"],
    index: true,
    immutable: true,
  },
  type: {
    type: String,
    enum: {
      values: ["CREDIT", "DEBIT"],
      message: "Type can be either CREDIT or DEBIT",
    },
    required: [true, "Ledger type is required"],
    immutable: true,
  },
  
},
{
    timestamps: true,
  }
);

LedgerSchema.pre("validate", function () {

  if (!this.account && !this.systemAccount) {
    throw new Error("Either account or systemAccount is required.");
  }

  if (this.account && this.systemAccount) {
    throw new Error("Cannot use account and systemAccount together.");
  }

});

function preventLedgerModification() {
  throw new Error(
    "Ledger entries are immutable and cannot be modified or deleted",
  );
}

LedgerSchema.pre("findOneAndUpdate", preventLedgerModification);
LedgerSchema.pre("updateOne", preventLedgerModification);
LedgerSchema.pre("deleteOne", preventLedgerModification);
LedgerSchema.pre("remove", preventLedgerModification);
LedgerSchema.pre("deleteMany", preventLedgerModification);
LedgerSchema.pre("updateMany", preventLedgerModification);
LedgerSchema.pre("findOneAndDelete", preventLedgerModification);
LedgerSchema.pre("findOneAndReplace", preventLedgerModification);

const ledgerModel = mongoose.model("ledger", LedgerSchema);

module.exports = ledgerModel;
