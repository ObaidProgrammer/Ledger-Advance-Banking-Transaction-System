const userModel = require("../models/user.model");
const ledgerModel = require("../models/ledger.model");
const accountModel = require("../models/account.model");
const transactionModel = require("../models/transaction.model");
const cashBookModel = require("../models/cashBook.model");
const systemAccountModel = require("../models/systemAccount.model");


const mongoose = require("mongoose");

/**
 * - Create a new transaction
 * The 10-STEP TRANSFER FLOW:
 * 1. Validate request
 * 2. Validate idempotency key
 * 3. Check account status
 * 4. Derive sender balance from ledger
 * 5. Create transaction (PENDING)
 * 6. Create DEBIT Ledger entry
 * 7. Create CREDIT Ledger entry
 * 8. Mark transaction COMPLETED
 * 9. Commit MongoDB session
 * 10. Send email notification
 */

async function createTransaction(req, res) {
  /**
   * 1. Validate request
   */
  const { fromAccount, toAccount, amount, idempotencyKey } = req.body;
  if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({
      message:
        "FromAccount, toAccount, amount and idemportencyKey are required",
    });
  }

  const fromUserAccount = await accountModel.findOne({
    _id: fromAccount,
  });
  const toUserAccount = await accountModel.findOne({
    _id: toAccount,
  });

  if (!fromUserAccount || !toUserAccount) {
    return res.status(400).json({
      message: "Invalid form Account or toAccount",
    });
  }
  /**
   * 2. Validate idempotency key
   */
  const isTransactionAlreadyExists = await transactionModel.findOne({
    idempotencyKey: idempotencyKey,
  });

  if (isTransactionAlreadyExists) {
    if (isTransactionAlreadyExists.status === "COMPLETED") {
      return res.status(200).json({
        message: "Transaction already processed",
        transaction: isTransactionAlreadyExists,
      });
    }
    if (isTransactionAlreadyExists.status === "PENDING") {
      return res.status(200).json({
        message: "Transaction is still processing",
      });
    }
    if (isTransactionAlreadyExists.status === "FAILED") {
      return res.status(500).json({
        message: "Transaction processing failed, please retry",
      });
    }
    if (isTransactionAlreadyExists.status === "REVERSED") {
      return res.status(500).json({
        message: "Transaction was reversed, please retry",
      });
    }
  }
  /**
   *  3.Check account status
   */
  if (
    fromUserAccount.status !== "ACTIVE" ||
    toUserAccount.status !== "ACTIVE"
  ) {
    return res.status(400).json({
      message:
        "Both fromAccount and toAccount must be ACTIVE to process transaction",
    });
  }
  /**
   * 4. Derive sender balance from ledger
   */
  const balance = await fromUserAccount.getBalance();

  if (balance < amount) {
    return res.status(400).json({
      message: `Insuddicient balance.Current balance is ${balance}. Requested amount is ${amount}`,
    });
  }

  let transaction;
  let session;

  try {
    /**
     * 5. Create transaction (PENDING)
     */
    session = await mongoose.startSession();
    session.startTransaction();

transaction = (
  await transactionModel.create(
    [
      {
        fromAccount,
        toAccount,
        amount,
        idempotencyKey,
        status: "PENDING",
        transactionType: "TRANSFER",
        performedBy: req.user._id,
      },
    ],
    { session },
  )
)[0];
    const debitLedgerEntry = await ledgerModel.create(
      [
        {
          account: fromAccount,
          amount: amount,
          transaction: transaction._id,
          type: "DEBIT",
        },
      ],
      { session },
    );
    await (() => {
      return new Promise((resolve) => setTimeout(resolve, 1000));
    });

    const creditLedgerEntry = await ledgerModel.create(
      [
        {
          account: toAccount,
          amount: amount,
          transaction: transaction._id,
          type: "CREDIT",
        },
      ],
      { session },
    );

    await transactionModel.findOneAndUpdate(
      { _id: transaction._id },
      { status: "COMPLETED" },
      { session },
    );

    await session.commitTransaction();
    session.endSession();
  } 
  catch (error) {
  console.error("TRANSFER ERROR:", error);

  await session.abortTransaction();

  session.endSession();

  return res.status(500).json({
    message: error.message,
    error,
  });

  }
  return res.status(201).json({
  message: "Transaction completed successfully",
  transaction: {
    ...transaction.toObject(),
    senderName: req.user.name,
    receiverName: toUserAccount.name || "Recipient" // setup if available
  },
});
}

async function cashDepositController(req, res) {

  const { toAccount, amount, idempotencyKey, remarks } = req.body;

  if (!toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({
      message: "toAccount, amount and idempotencyKey are required",
    });
  }

  const customerAccount = await accountModel.findById(toAccount);

  if (!customerAccount) {
    return res.status(404).json({
      message: "Customer account not found",
    });
  }

  const alreadyExists = await transactionModel.findOne({
    idempotencyKey,
  });

  if (alreadyExists) {
    return res.status(409).json({
      message: "Transaction already processed",
    });
  }

  const cashOnHand = await systemAccountModel.findOne({
  code: "1001",
});

if (!cashOnHand) {
  return res.status(500).json({
    message: "Cash On Hand account not found",
  });
}

  const session = await mongoose.startSession();

  try {

    session.startTransaction();

    /**
     * Create Transaction
     */

    const transaction = (
      await transactionModel.create(
        [
          {
            toAccount,

            amount,

            status: "PENDING",

            idempotencyKey,

            transactionType: "CASH_DEPOSIT",

            performedBy: req.user._id,
          },
        ],
        { session }
      )
    )[0];

    /**
     * Cash Book Entry
     */

    await cashBookModel.create(
      [
        {
          type: "CASH_DEPOSIT",

          amount,

          account: toAccount,

          cashier: req.user._id,

          transaction: transaction._id,

          remarks: remarks || "Cash Deposit",
        },
      ],
      { session }
    );

  /**
     * Ledger Debit
     */

    await ledgerModel.create(
  [
    {
      systemAccount: cashOnHand._id,
      amount,
      transaction: transaction._id,
      type: "DEBIT",
    },
  ],
  { session }
);
    /**
     * Ledger Credit
     */

    await ledgerModel.create(
      [
        {
          account: toAccount,

          amount,

          transaction: transaction._id,

          type: "CREDIT",
        },
      ],
      { session }
    );

    /**
     * Complete Transaction
     */

    transaction.status = "COMPLETED";

    await transaction.save({ session });
await session.commitTransaction();

session.endSession();

const populatedTransaction = await transactionModel
  .findById(transaction._id)
  .populate({
    path: "performedBy",
    select: "name email role",
  });

return res.status(201).json({
  message: "Cash deposited successfully",
  transaction: populatedTransaction,
});

  } catch (error) {

    await session.abortTransaction();
    session.endSession();
    console.log(error);

    return res.status(500).json({

      message: "Cash deposit failed",

    });

  }

}

async function cashWithdrawController(req, res) {
  const { fromAccount, amount, idempotencyKey, remarks } = req.body;

  if (!fromAccount || !amount || !idempotencyKey) {
    return res.status(400).json({
      message: "fromAccount, amount and idempotencyKey are required",
    });
  }

  // Customer Account
  const customerAccount = await accountModel.findById(fromAccount);

  if (!customerAccount) {
    return res.status(404).json({
      message: "Customer account not found",
    });
  }

  // Check Balance
  const balance = await customerAccount.getBalance();

  if (balance < amount) {
    return res.status(400).json({
      message: `Insufficient balance. Current balance is ${balance}`,
    });
  }

  // Idempotency Check
  const alreadyExists = await transactionModel.findOne({
    idempotencyKey,
  });

  if (alreadyExists) {
    return res.status(409).json({
      message: "Transaction already processed",
    });
  }


  const cashOnHand = await systemAccountModel.findOne({
  code: "1001",
});

if (!cashOnHand) {
  return res.status(500).json({
    message: "Cash On Hand account not found",
  });
}


  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Create Transaction
    const transaction = (
      await transactionModel.create(
        [
          {
            fromAccount,

            amount,

            status: "PENDING",

            idempotencyKey,

            transactionType: "CASH_WITHDRAW",

            performedBy: req.user._id,
          },
        ],
        { session }
      )
    )[0];

   await ledgerModel.create(
[
    {
        account: fromAccount,
        amount,
        transaction: transaction._id,
        type: "DEBIT",
    },
],
{
    session,
    ordered: true,
}
);

await ledgerModel.create(
[
    {
        systemAccount: cashOnHand._id,
        amount,
        transaction: transaction._id,
        type: "CREDIT",
    },
],
{
    session,
    ordered: true,
}
);

    // CashBook Entry
    await cashBookModel.create(
      [
        {
          type: "CASH_WITHDRAW",

          amount,

          account: fromAccount,

          cashier: req.user._id,

          transaction: transaction._id,

          remarks: remarks || "Cash Withdraw",
        },
      ],
      { session }
    );

    // Complete Transaction
    transaction.status = "COMPLETED";

    await transaction.save({ session });

    await session.commitTransaction();
    session.endSession();
const populatedTransaction = await transactionModel
  .findById(transaction._id)
  .populate({
    path: "performedBy",
    select: "name email role",
  });
  return res.status(201).json({
  message: "Cash withdrawn successfully",
  transaction: populatedTransaction,
});
  } catch (error) {
    await session.abortTransaction();

    session.endSession();

    console.error(error);

    return res.status(500).json({
      message: "Cash withdraw failed",
    });
  }
}
module.exports = {
  createTransaction,
  cashDepositController,
  cashWithdrawController,
};
