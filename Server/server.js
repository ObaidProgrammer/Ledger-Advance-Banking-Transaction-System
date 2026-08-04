require("dotenv").config();
const app = require("./src/app");
const connectToDB = require("./src/config/db");
const userModel = require("./src/models/user.model");
const dns = require("dns");

dns.setServers(["1.1.1.1", "8.8.8.8"]);

connectToDB().then(async () => {
  console.log("Checking for Super Admin...");
  try {
    const exists = await userModel.findOne({ role: "SUPER_ADMIN" });
    
    if (!exists) {
      await userModel.create({
        name: "System Admin",
        email: "admin@ledger.com",
        password: "admin123",
        role: "SUPER_ADMIN",
      });
      console.log(" Super Admin created successfully via Server Boot!");
    } else {
      console.log(" Super Admin already exists in Database.");
    }
  } catch (err) {
    console.error("Error during automatic seeding:", err.message);
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});