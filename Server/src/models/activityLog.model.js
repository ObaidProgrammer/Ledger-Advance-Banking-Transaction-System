const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },

    action: {
      type: String,
      required: true,
      trim: true
    },

    entity: {
      type: String,
      enum: [
        "CUSTOMER",
        "ACCOUNT",
        "TRANSACTION",
        "ADMIN",
        "CASHIER",
        "SYSTEM",
      ],
      required: true,
    },

    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      index: true,
    },

    description: {
      type: String,
      required: true,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

activityLogSchema.index({ createdAt: -1 });

const activityLogModel = mongoose.model(
  "activityLog",
  activityLogSchema
);

module.exports = activityLogModel;
