const mongoose = require("mongoose");

const schoolSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    schoolLogo: { type: String },
    schoolAdminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SchoolAdmin",
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
    },
  },
);

schoolSchema.pre(
  ["find", "findOne", "findById", "findOneAndUpdate"],
  function () {
    this.select("-__v");
  },
);

module.exports = schoolSchema;
