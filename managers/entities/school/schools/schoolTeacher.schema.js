const mongoose = require("mongoose");

const schoolTeacherSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 100,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 100,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please enter a valid email",
      ],
    },
    phone: { type: String, minlength: 10, maxlength: 13 },
    address: { type: String, minLength: 15, maxlength: 100 },
    password: { type: String, required: true, minlength: 8 },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
    teacherStaffId: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.password;
        delete ret.__v;
        ret.id = ret._id;
        return ret;
      },
    },
  },
);

schoolTeacherSchema.pre(["find", "findOne", "findById"], function () {
  this.select("-__v");
});

module.exports = schoolTeacherSchema;
