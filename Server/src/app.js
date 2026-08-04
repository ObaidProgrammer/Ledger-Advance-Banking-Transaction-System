const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
app.set("trust proxy", 1);

app.use(
  cors({
    origin: function (origin, callback) {

      const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:5174",
        process.env.CLIENT_URL,
        process.env.ADMIN_URL,
      ];

      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

/* Routes */
const authRouter = require("./routes/auth.routes");
const accountRouter = require("./routes/account.routes");
const transactionRoutes = require("./routes/transaction.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const adminRoutes = require("./routes/admin.routes");
const adminAuthRoutes = require("./routes/adminAuth.routes");


/* Use Routes */
app.use("/api/auth", authRouter);
app.use("/api/accounts", accountRouter);
app.use("/api/transactions", transactionRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin", adminAuthRoutes);

module.exports = app;
