const mongoose = require("mongoose");

module.exports = class SchoolManager {
  constructor({ config, cache, cortex, mongomodels, validators, utils }) {
    this.config = config;
    this.cache = cache;
    this.cortex = cortex;
    this.utils = utils;
    this.mongomodels = mongomodels;
    this.validators = validators;
    this.httpExposed = [
      "post=create",
      "get=schoolDetails",
      "put=updateSchool",
      "delete=deleteSchool",
      "delete=deleteSchoolDetails",
      "post=createNewAdmin",
      "get=getAdminDetails",
      "put=updateAdminDetails",
      "get=getAdmins",
      "delete=deleteAdmin",
    ];
  }

  async create({ res, ...data }) {
    // Validation
    const result = await this.validators.school.create(data);

    const adminResult = await this.validators.schoolAdmin.create(data.admin);
    result.admin = adminResult;

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
      status: 201,
      message: "School created successfully.",
      data: { schoolId: newSchool._id, adminId: newSchoolAdmin._id },
    };
  }

  async schoolDetails({ schoolId }) {
    const school = await this.mongomodels.school.findById(schoolId).lean();

    if (!school) {
      return { ok: false, message: "School not found." };
    }

    return {
      ok: true,
      status: 200,
      message: "School details retrieved successfully.",
      data: school,
    };
  }

  async updateSchool({ res, schoolId, ...data }) {
    const existingSchool = await this.mongomodels.school.findById(schoolId);

    if (!existingSchool) {
      return { ok: false, message: "School not found." };
    }

    const updatedSchool = await this.mongomodels.school.findByIdAndUpdate(
      schoolId,
      data,
      { new: true },
    );

    return {
      ok: true,
      status: 200,
      message: "School updated successfully.",
      data: updatedSchool,
    };
  }

  async deleteSchool({ res, schoolId }) {
    const existingSchool = await this.mongomodels.school.findById(schoolId);

    if (!existingSchool) {
      return { ok: false, message: "School not found." };
    }

    // Soft delete
    await this.mongomodels.school.findByIdAndUpdate(schoolId, {
      deleted: true,
    });

    return { ok: true, message: "School deleted successfully." };
  }

  async deleteSchoolDetails({ res, schoolId }) {
    const existingSchool = await this.mongomodels.school.findById(schoolId);
    if (!existingSchool) {
      return { ok: false, message: "School not found." };
    }

    // Hard delete
    await this.mongomodels.school.findByIdAndDelete(schoolId);

    return { ok: true, message: "School permanently deleted successfully." };
  }

  // School Admin
  async createNewAdmin({ res, data }) {
    const existingSchool = await this.mongomodels.findById({
      schoolId: data.schoolId,
    });

    if (!existingSchool) {
      return { ok: false, message: "School not found." };
    }

    const existingAdmin = await this.mongomodels.findOne({ email: data.email });

    if (existingAdmin) {
      return {
        ok: false,
        message: "School admin with this credential already exist.",
      };
    }

    const hashedPassword = await this.utils.encryptPassword(data.password);

    const newAdmin = await this.mongomodels.create({
      ...data,
      password: hashedPassword,
    });
    await newAdmin.save();

    return {
      ok: true,
      status: 201,
      message: "School admin created successfully.",
      data: { adminId: newSchoolAdmin._id },
    };
  }

  async getAdminDetails({ res, adminId }) {
    const admin = await this.mongomodels.schoolAdmin
      .findById(adminId)
      .lean()
      .select("-password");
    if (!admin) {
      return { ok: false, message: "School admin not found." };
    }
    return {
      ok: true,
      status: 200,
      message: "School Admin retrieved successfully.",
      data: admin,
    };
  }

  async updateAdminDetails({ res, adminId, ...data }) {
    const existingAdmin = await this.mongomodels.schoolAdmin.findById(adminId);
    if (!existingAdmin) {
      return { ok: false, message: "School admin not found." };
    }

    const updatedAdmin = await this.mongomodels.schoolAdmin.findByIdAndUpdate(
      adminId,
      data,
      { new: true },
    );

    return {
      ok: true,
      status: 200,
      message: "School admin updated successfully.",
      data: updatedAdmin,
    };
  }

  async getAdmins({ res, schoolId }) {
    const school = await this.mongomodels.school.findById({ schoolId });

    if (!school) {
      return { ok: false, message: "School not found." };
    }

    const allAdminsInSchool = await this.mongomodels.schoolAdmin.findById({
      schoolId,
    });

    return {
      ok: true,
      status: 200,
      message: "School admins retrieved successfully.",
      data: allAdminsInSchool,
    };
  }

  async deleteAdmin({ res, adminId }) {
    const existingAdmin = await this.mongomodels.schoolAdmin.findById({
      adminId,
    });

    if (!existingAdmin) {
      return { ok: false, message: "School admin not found." };
    }

    await this.mongomodels.schoolAdmin.findByIdAndDelete(schoolId);

    return { ok: true, message: "School admin deleted successfully." };
  }
};
