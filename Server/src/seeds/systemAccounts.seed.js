const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);
require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });

const connectToDB = require("../config/db");
const systemAccountModel = require("../models/systemAccount.model");

async function seed() {
  try {
    await connectToDB();

    const exists = await systemAccountModel.findOne({
      code: "1001",
    });

    if (exists) {
      console.log("Cash On Hand already exists");
      process.exit(0);
    }

    await systemAccountModel.create({
      name: "Cash On Hand",
      code: "1001",
      type: "ASSET",
    });

    console.log("Cash On Hand created successfully!");
    process.exit(0);

  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed();