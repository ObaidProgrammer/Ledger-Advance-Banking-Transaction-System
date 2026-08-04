const mongoose = require("mongoose");
const accountModel = require("../models/account.model");
const userModel = require("../models/user.model");

async function createAccountController(req, res) {
  try {
    const user = req.user;

    // GUARD 1: Check karein agar user ka pehle se koi account active ya majood hai
    const existingAccount = await accountModel.findOne({ user: user._id });
    
    if (existingAccount) {
      // 1 se zyada account banane nahi dega, balki purana wala hi bhej dega safe exit ke liye
      return res.status(200).json({
        message: "Account already exists for this user",
        account: existingAccount,
      });
    }

    // Optional Guard 2: Idempotency Key header check (jo humne frontend headers me lagayi thi)
    const idempotencyKey = req.headers["idempotency-key"];
    // Agar aap isay database me track karna chahein to schema me field add kar sakte hain, 
    // par user check hi kafi hai yahan kyunki 1 user = 1 account strict rule hai.

    // Agar koi account nahi mila, to hi naya create hoga
    const account = await accountModel.create({
      user: user._id,
      status: "ACTIVE",
      currency: "PKR"
    });

    return res.status(201).json({
      message: "Banking Ledger Account Created Successfully!",
      account,
    });

  } catch (error) {
    console.error("ACCOUNT CREATION ERROR:", error);
    return res.status(500).json({
      message: "Internal server error during account initialization",
      error: error.message
    });
  }
}

async function getUserAccountsController(req, res) {
  const accounts = await accountModel.find({
    user: req.user._id,
  });
  res.status(200).json({
    accounts,
  });
}

async function getAccountsBalanceController(req, res) {
  const { accountId } = req.params;

  const account = await accountModel.findOne({
    _id: accountId,
    user: req.user._id,
  });

  if (!account) {
    return res.status(404).json({
      message: "Account not found",
    });
  }
  const balance = await account.getBalance();

  res.status(200).json({
    accountId: account._id,
    balance: balance,
  });
}
/**
 * - User LookupAccount Controller
 *  - Get /api/lookup/:accountId
 */
async function getlookupAccountController(req, res) {
  try {
    const { accountId } = req.params;

    // 1. Check ID Format
    if (!mongoose.Types.ObjectId.isValid(accountId)) {
      return res.status(400).json({ message: "Invalid Account ID format" });
    }

    // 2. Find Account cleanly without immediate population crashing
    const account = await accountModel.findById(accountId);

    if (!account) {
      return res
        .status(404)
        .json({ message: "Account not found in our ledger system" });
    }

    // 3. Manually fetch user data safely using the reference ID
    const userDetails = await userModel
      .findById(account.user)
      .select("name email");

    // 4. Send clean structured JSON data back to frontend
    return res.status(200).json({
      accountId: account._id,
      status: account.status,
      receiverName: userDetails ? userDetails.name : "Unknown User",
    });
  } catch (error) {
    // Is se aapke backend terminal mein exact debug point pata chalega
    console.error("DETAILED LOOKUP CRASH LOG:", error.message, error.stack);

    return res.status(500).json({
      message: "Internal server error during account verification layout",
      error: error.message,
    });
  }
}

module.exports = {
  createAccountController,
  getUserAccountsController,
  getAccountsBalanceController,
  getlookupAccountController,
};
