const mongoose = require("mongoose");

module.exports = class SchoolManager {
  constructor({ config, cache, cortex, mongomodels, validators, utils }) {
    this.config = config;
    this.cache = cache;
    this.cortex = cortex;
    this.utils = utils;
    this.mongomodels = mongomodels;
    this.validators = validators;
    this.httpExposed = ["post=createSchool"];
  }

  async createSchool({ res, ...data }) {
    // Validation
    const result =
      (await this.validators.school.create(data)) ||
      (data = await this.validators.schoolAdmin.create(data.admin));

    console.log("Result:", result.email);

    // Logic
    // check if school exists
    const existingSchool = await this.mongomodels.school.findOne({
      email: result.email,
    });

    if (existingSchool) {
      return { ok: false, message: "School with this email already exists." };
    }

    const existingSchoolAdmin = await this.mongomodels.schoolAdmin.findOne({
      email: result.admin.email,
    });

    if (existingSchoolAdmin) {
      return {
        ok: false,
        message: "School admin with this email already exists.",
      };
    }

    // // create school
    const newSchool = new this.mongomodels.school({
      ...result,
      schoolAdminId: new mongoose.Types.ObjectId(),
    });
    await newSchool.save();

    // create school admin
    const adminHashedPassword = await this.utils.encryptPassword(
      result.admin.password,
    );
    result.admin.password = adminHashedPassword;

    const newSchoolAdmin = new this.mongomodels.schoolAdmin({
      ...result.admin,
      schoolId: newSchool._id,
    });
    await newSchoolAdmin.save();

    newSchool.schoolAdminId = newSchoolAdmin._id;
    await newSchool.save();

    return {
      ok: true,
      message: "School created successfully.",
      data: { schoolId: newSchool._id, adminId: newSchoolAdmin._id },
    };
  }
};
