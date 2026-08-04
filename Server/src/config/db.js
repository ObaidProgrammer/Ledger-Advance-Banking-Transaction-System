const mongoose = require("mongoose");

async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Server is Connected to DB");
  } catch (err) {
    console.log("Error connecting to DB");
    console.error("MongoDB Connection Error:", err.message);
    process.exit(1);
  }
}

module.exports = connectToDB;