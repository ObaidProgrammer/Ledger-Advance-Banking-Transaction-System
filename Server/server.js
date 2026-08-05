require("dotenv").config();
const app = require("./src/app");
const connectToDB = require("./src/config/db");
const userModel = require("./src/models/user.model");
const dns = require("dns");

dns.setServers(["1.1.1.1", "8.8.8.8"]);

connectToDB().then(async () => {
  console.log("Checking for Super Admin...");

  try {
    const exists = await userModel.findOne({
      role: "SUPER_ADMIN",
    });

    // if (!exists) {
    //   await userModel.create({
    //     name: "Your Name",
    //     email: "Super Admin Email",
    //     password: "Your Password 123",
    //     name: "System Admin",
    //     email: "your AdminEmail",
    //     password: "your Password",
    //     role: "SUPER_ADMIN",
    //   });

    //   console.log("Super Admin created successfully via Server Boot!");
    // } else {
    //   console.log("Super Admin already exists in Database.");
    // }
  } catch (err) {
    console.error("Error during automatic seeding:", err.message);
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
