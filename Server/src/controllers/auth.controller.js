const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const tokenBlackListModel = require("../models/blackList.model");
const accountModel = require("../models/account.model");
/*
 * - User register controller
 * - Post /api//auth/register
 */
async function userRegisterController(req, res) {
  const { email, password, name } = req.body;

  const isExists = await userModel.findOne({
    email: email,
  });
  if (isExists) {
    return res.status(422).json({
      message: "User already exists with email",
      status: "failed",
    });
  }

const user = await userModel.create({
  email,
  password,
  name,
  role: "CUSTOMER",
});

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });

  res.cookie("token", token);

res.status(201).json({
  user: {
    _id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
  },
  token,
});
}

/*
 * - User Login Controller
 * - POST /api/auth/login
 */
async function userLoginController(req, res) {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({
      message: "Email or password is Invalid",
    });
  }
  const isValidPassword = await user.comparePassword(password);
  if (!isValidPassword) {
    return res.status(401).json({
      message: "Email or password is Invalid",
    });
  }

  if (user.status !== "ACTIVE") {
  return res.status(403).json({
    message: "Your account has been disabled.",
  });
}

const token = jwt.sign(
  {
    userId: user._id,
    role: user.role,
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "3d",
  }
);

  res.cookie("token", token);

res.status(200).json({
  user: {
    _id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
  },
  token,
});
}

/**
 * - User Logout Controller
 * - POST /api/auth/logout
 */
async function userLogoutController(req, res) {
  try {
    // Cookie aur Header dono options fallback support ke sath secure kiye
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(200).json({
        message: "User logged out successfully (No token provided)",
      });
    }

    // Database mein entry generate hone ka properly await karein
    await tokenBlackListModel.create({
      token: token.trim(), // secure edge spaces trim
    });

    res.clearCookie("token");

    return res.status(200).json({
      message: "User logged out successfully",
    });
  } catch (error) {
    // Agar terminal mein koi error aayega to yahan lazmi dikhega
    console.error("CRITICAL LOGOUT ERR:", error);

    // Agar token pehle se blacklisted ho (MongoDB Code 11000), tab bhi user ko ok bolo
    if (error.code === 11000) {
      res.clearCookie("token");
      return res.status(200).json({
        message: "User logged out successfully",
      });
    }

    return res.status(500).json({
      message: "Internal server error during logout processing",
    });
  }
}

async function getMeController(req, res) {
  return res.status(200).json({
    user: req.user,
  });
}

/*
 * - Add/Remove Bucket Controllers
 */

async function addBucketController(req, res) {
  try {
    const { description, amount } = req.body;
    const bucketAmount = Number(amount);

    // Validation for negative or zero
    if (!description || bucketAmount <= 0) {
      return res.status(400).json({ message: "Invalid description or amount." });
    }

    const account = await accountModel.findOne({ user: req.user._id });
    if (!account) return res.status(404).json({ message: "Account not found." });

    const availableBalance = await account.getBalance();
    const user = await userModel.findById(req.user._id);

    if (user.buckets.length >= 10) {
      return res.status(400).json({ message: "Maximum 10 buckets allowed." });
    }

    const totalBucketedAmount = user.buckets.reduce((acc, b) => acc + b.amount, 0);
    
    if ((totalBucketedAmount + bucketAmount) > availableBalance) {
      return res.status(400).json({ message: "Insufficient balance for this bucket." });
    }

    user.buckets.push({ description, amount: bucketAmount });
    await user.save();
    
    res.status(200).json({ buckets: user.buckets });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
}

// 2. Get All Buckets
async function getBucketsController(req, res) {
  try {
    const user = await userModel.findById(req.user._id);
    res.status(200).json({ buckets: user.buckets });
  } catch (error) {
    res.status(500).json({ message: "Error fetching buckets", error: error.message });
  }
}

// 3. Delete Bucket
async function deleteBucketController(req, res) {
  try {
    const { bucketId } = req.params;
    const user = await userModel.findById(req.user._id);
    
    // Bucket filter out karna (Array se remove)
    user.buckets = user.buckets.filter(b => b._id.toString() !== bucketId);
    await user.save();

    res.status(200).json({ message: "Bucket deleted", buckets: user.buckets });
  } catch (error) {
    res.status(500).json({ message: "Error deleting bucket", error: error.message });
  }
}

module.exports = {
  userRegisterController,
  userLoginController,
  userLogoutController,
  getMeController,
  addBucketController,
  getBucketsController,
  deleteBucketController
};
