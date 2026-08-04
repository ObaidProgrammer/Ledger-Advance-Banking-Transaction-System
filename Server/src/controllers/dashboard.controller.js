const ledgerModel = require("../models/ledger.model");
const accountModel = require("../models/account.model");
const transactionModel = require("../models/transaction.model");

async function getDashboard(req, res) {
  const userId = req.user._id;

  // 1. user accounts
  const accounts = await accountModel.find({ user: userId });

  const accountIds = accounts.map((a) => a._id.toString());

  // 2. total balance
  let totalBalance = 0;

  for (let acc of accounts) {
    totalBalance += await acc.getBalance();
  }

  // 3. total sent
  const sentAgg = await ledgerModel.aggregate([
    {
      $match: {
        account: { $in: accounts.map((a) => a._id) },
        type: "DEBIT",
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" },
      },
    },
  ]);

  const totalSent = sentAgg[0]?.total || 0;

  // 4. total received
  const receivedAgg = await ledgerModel.aggregate([
    {
      $match: {
        account: { $in: accounts.map((a) => a._id) },
        type: "CREDIT",
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" },
      },
    },
  ]);

  const totalReceived = receivedAgg[0]?.total || 0;

  // 5. latest transactions
  const latestTransactions = await transactionModel
    .find({
      $or: [
        { fromAccount: { $in: accounts.map((a) => a._id) } },
        { toAccount: { $in: accounts.map((a) => a._id) } },
      ],
    })
    .sort({ createdAt: -1 })
    .limit(10)
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

  return res.status(200).json({
    totalBalance,
    totalSent,
    totalReceived,
    latestTransactions,
    myAccounts: accountIds,
  });
}

module.exports = { getDashboard };
