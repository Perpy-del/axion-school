const mongoose = require("mongoose");

const superAdminSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 10,
      maxLength: 100,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      minLength: 10,
      maxLength: 100,
      trim: true,
    },
    role: {
      type: String,
      default: "SuperAdmin",
      immutable: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: "superadmins",
  },
);

module.exports = superAdminSchema;
