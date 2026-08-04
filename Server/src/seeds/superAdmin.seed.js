const connectToDB = require("../config/db");
const userModel = require("../models/user.model");

async function seed() {
  try {
    await connectToDB();

    const exists = await userModel.findOne({
      role: "SUPER_ADMIN",
    });

    if (exists) {
      console.log("Super Admin already exists");
      process.exit(0);
    }

    await userModel.create({
      name: "System Admin",
      email: "admin@ledger.com",
      password: "admin123",
      role: "SUPER_ADMIN",
    });

    console.log("Super Admin created successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed();