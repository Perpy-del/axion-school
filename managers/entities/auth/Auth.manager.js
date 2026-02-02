const mongoose = require("mongoose");

module.exports = class SchoolManager {
  constructor({ config, cache, cortex, mongomodels, validators, utils, managers }) {
    this.config = config;
    this.cache = cache;
    this.cortex = cortex;
    this.utils = utils;
    this.mongomodels = mongomodels;
    this.validators = validators;
    this.managers = managers;
    this.httpExposed = ["post=login"];
  }

  async login({ email, password }) {
    let user = await this.mongomodels.schoolAdmin.findOne({
      email,
      isDeleted: false,
    });
    let userType = "school_admin";

    if (!user) {
      user = await this.mongomodels.schoolTeacher.findOne({
        email,
        isDeleted: false,
      });
      userType = "teacher";
    }

    if (!user) {
      return { ok: false, message: "Invalid email or password." };
    }

    const isMatch = await this.utils.verifyPassword(password, user.password);
    if (!isMatch) {
      return { ok: false, message: "Invalid email or password." };
    }

    const longToken = this.managers.token.genLongToken({
      userId: user._id,
      userKey: user.email,
      userType: userType,
    });

    return {
      ok: true,
      status: 200,
      message: `Welcome back, ${user.firstName || "User"}!`,
      data: {
        token: longToken,
        userType: userType,
        user: {
          id: user._id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
        },
      },
    };
  }
};
