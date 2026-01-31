const { password, label } = require("../../../_common/schema.models");

module.exports = {
  student: {
    firstName: {
      label: "First Name",
      type: "string",
      length: { min: 3, max: 100 },
      message: "First name must be between 3 and 100 characters.",
      required: true,
    },
    lastName: {
      label: "Last Name",
      type: "string",
      length: { min: 3, max: 100 },
      message: "Last name must be between 3 and 100 characters.",
      required: true,
    },
    email: {
      label: "Email Address",
      type: "string",
      length: { min: 3, max: 100 },
      regex: "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$",
      message: "Please enter a valid email address.",
      required: true,
    },
    age: { label: "Age", type: "number", message: "Age must be a number." },
    classId: {
      label: "Class ID",
      type: "string",
      message: "Invalid Class ID.",
      required: false,
      path: "classroom",
    },
    gender: {
      label: "Gender",
      type: "string",
      enum: ["male", "female", "other"],
      message: "Please select a valid gender.",
    },
    schoolId: {
      label: "School ID",
      type: "string",
      required: true,
      path: "school",
      message: "Invalid School ID.",
    },
    profileImage: {
      label: "Profile Image",
      type: "string",
      message: "Profile image must be a valid URL.",
    },
    parents: {
      label: "Parents",
      type: "array",
      message: "Parents must be an array.",
      items: {
        label: "Parent",
        name: {
          label: "Name",
          type: "string",
          length: { min: 3, max: 100 },
          message: "Parent name must be between 3 and 100 characters.",
        },
        phone: {
          label: "Phone Number",
          type: "string",
          length: { min: 10, max: 13 },
          message: "Parent phone number must be between 10 and 13 characters.",
        },
      },
    },
    password: {
      label: "Password",
      type: "string",
      length: { min: 8, max: 100 },
      required: true,
      message: "Password must be between 8 and 100 characters.",
    },
  },
};
