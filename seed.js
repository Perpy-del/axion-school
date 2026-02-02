require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const config = require("./config/index.config");

const superAdminSchema = require("./managers/entities/superAdmin/superAdmin.schema");
const SuperAdmin = mongoose.model("SuperAdmin", superAdminSchema);

const seed = async () => {
  try {
    const mongoDB = config.MONGO_URI
      ? require("./connect/mongo")({
          uri: config.MONGO_URI,
        })
      : null;

    await mongoose.connect(mongoDB);

    const email = config.INITIAL_ADMIN_EMAIL;
    const password = config.INITIAL_ADMIN_PASSWORD;

    const existing = await SuperAdmin.findOne({ email });
    if (existing) {
      console.log("SuperAdmin already exists.");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await SuperAdmin.create({
      firstName: "Axion",
      lastName: "School",
      email: email,
      password: hashedPassword,
      role: "superAdmin",
    });

    console.log("First SuperAdmin created successfully!");
    process.exit();
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
};

seed();
