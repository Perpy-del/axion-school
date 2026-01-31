const { password } = require("../../../_common/schema.models");

module.exports = {
  school: {
    name: {
      type: "String",
      required: true,
      length: { min: 3, max: 200 },
    },
    email: {
      type: "String",
      format: "email",
    },
    phone: {
      type: "String",
      length: { min: 10, max: 15 },
    },
    street: {
      type: "String",
      length: { min: 10, max: 300 },
      required: true,
    },
    city: {
      type: "String",
      length: { min: 3, max: 100 },
      required: true,
    },
    state: {
      type: "String",
      length: { min: 2, max: 100 },
      required: true,
    },
    schoolLogo: {
      type: "String",
    },
    schoolAdminId: {
      type: "String",
      required: true,
      ref: "schoolAdmin",
    },
    isDeleted: {
      type: "Boolean",
      default: false,
    },
  },

    schoolTeacher: {
    firstName: {
      type: "String",
      length: { min: 3, max: 100 },
    },
    lastName: {
      type: "String",
      length: { min: 3, max: 100 },
    },
    email: {
      type: "String",
      regex:
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      required: true,
    },
    phone: {
      type: "String",
      length: { min: 10, max: 13 },
    },
    password: {
      type: "String",
      length: { min: 8, max: 100 },
      required: true,
    },
    schoolId: {
      type: "String",
      required: true,
      ref: "school",
    },
  },

  schoolAdmin: {
    firstName: {
      type: "String",
      required: true,
      length: { min: 3, max: 100 },
    },
    lastName: {
      type: "String",
      required: true,
      length: { min: 3, max: 100 },
    },
    email: {
      type: "String",
      format: "email",
      required: true,
    },
    phone: {
      type: "String",
      length: { min: 10, max: 15 },
      required: true,
    },
    address: {
      type: "String",
      length: { min: 10, max: 300 },
      required: true,
    },
    password,
    role: {
      type: "String",
      length: { min: 3, max: 50 },
    },
    staffId: {
      type: "String",
      required: true,
    },
    schoolId: {
      type: "String",
      required: true,
      ref: "school",
    },
  },
};
