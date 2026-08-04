const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const bucketSchema = new mongoose.Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true, min: 0 },
  createdAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required for creating user"],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
      unique: [true, "Email already exists."],
    },
    name: {
      type: String,
      required: [true, "Name is required for creating an account"],
    },
    password: {
      type: String,
      required: [true, "Password is required for creating an account"],
      minlength: [6, "password should contain more than 6 character"],
      select: false,
    },
role: {
  type: String,
  enum: ["CUSTOMER", "ADMIN", "CASHIER","SUPER_ADMIN"],
  default: "CUSTOMER",
},
createdBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "user",
  default: null,
  index: true,
},
status: {
    type: String,
    enum: ["ACTIVE", "INACTIVE"],
    default: "ACTIVE",
},

    buckets: {
  type: [bucketSchema],
  validate: [
    {
      validator: function(val) {
        return val.length <= 10; // Limit: Maximum 10 buckets
      },
      message: "You cannot have more than 10 buckets."
    }
  ]
}
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return;
  }

  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;

  return;
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
