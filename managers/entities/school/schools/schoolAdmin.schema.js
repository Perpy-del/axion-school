const mongoose = require("mongoose");

const schoolAdminSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: "admin" },
    staffId: { type: String, required: true, unique: true },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

schoolAdminSchema.pre(
  ["find", "findOne", "findById", "findOneAndUpdate"],
  function () {
    this.select("-__v");
  },
);

module.exports = schoolAdminSchema;
