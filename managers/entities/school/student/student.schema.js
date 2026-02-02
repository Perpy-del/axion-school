const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ["male", "female", "other"] },
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: "School" },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: "Classroom" },
    parents: [{ name: String, phone: String }],
    password: { type: String, required: true },
    role: {
      type: String,
      default: "student",
      enum: ["student"],
      immutable: true,
    },
  },
  { timestamps: true },
);

module.exports = studentSchema;
