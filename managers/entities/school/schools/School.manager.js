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
      "post=createAdmin",
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

    const session = await this.mongomodels.school.db.startSession();

    // Logic
    try {
      let response;
      await session.withTransaction(async () => {
        // --- CHECK EXISTENCE ---
        const existingSchool = await this.mongomodels.school
          .findOne({
            email: result.email,
          })
          .session(session);

        if (existingSchool) throw new Error("School email already exists");

        const existingAdmin = await this.mongomodels.schoolAdmin
          .findOne({
            email: result.admin.email,
          })
          .session(session);

        if (existingAdmin) throw new Error("Admin email already exists");

        // --- CREATE SCHOOL ---
        const newSchool = new this.mongomodels.school({
          ...result,
          schoolAdminId: new mongoose.Types.ObjectId(), // Placeholder
        });
        await newSchool.save({ session });

        // --- HASH PASSWORD & CREATE ADMIN ---
        const adminHashedPassword = await this.utils.encryptPassword(
          result.admin.password,
        );

        const newSchoolAdmin = new this.mongomodels.schoolAdmin({
          ...result.admin,
          password: adminHashedPassword,
          schoolId: newSchool._id,
        });
        await newSchoolAdmin.save({ session });

        newSchool.schoolAdminId = newSchoolAdmin._id;
        await newSchool.save({ session });

        // Set the success response data inside the transaction
        response = {
          ok: true,
          status: 201,
          message: "School and Admin created successfully.",
          data: { schoolId: newSchool._id, adminId: newSchoolAdmin._id },
        };
      });

      return response;
    } catch (error) {
      return {
        ok: false,
        message: error.message || "Transaction failed. No data was saved.",
      };
    } finally {
      await session.endSession();
    }
  }

  async schoolDetails({ schoolId }) {
    const school = await this.mongomodels.school
      .findById(schoolId)
      .select("-_id")
      .lean();

    const deletedSchool = await this.mongomodels.school.findOne({
      _id: schoolId,
      isDeleted: true,
    });

    if (!school || deletedSchool) {
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
    await this.mongomodels.school.findByIdAndUpdate(
      schoolId,
      {
        isDeleted: true,
      },
      { new: true },
    );

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
  async createAdmin({ res, ...data }) {
    const existingSchool = await this.mongomodels.school.findById(
      data.schoolId,
    );

    if (!existingSchool) {
      return { ok: false, message: "School not found." };
    }

    const existingAdmin = await this.mongomodels.schoolAdmin.findOne({
      email: data.email,
    });

    if (existingAdmin) {
      return {
        ok: false,
        message: "School admin with this credential already exist.",
      };
    }

    const hashedPassword = await this.utils.encryptPassword(data.password);

    const newAdmin = await this.mongomodels.schoolAdmin.create({
      ...data,
      password: hashedPassword,
    });
    await newAdmin.save();

    return {
      ok: true,
      status: 201,
      message: "School admin created successfully.",
      data: { adminId: newAdmin._id },
    };
  }

  async getAdminDetails(data) {
    const { adminId, schoolId, res } = data;

    if (!schoolId) return { ok: false, message: "schoolId is required." };
    if (!adminId) return { ok: false, message: "adminId is required." };

    const query = {
      _id: adminId,
      schoolId: schoolId,
    };

    const admin = await this.mongomodels.schoolAdmin
      .findOne(query)
      .lean()
      .select("-password");

    if (!admin) {
      return {
        ok: false,
        message: "Admin not found with the provided criteria.",
      };
    }

    return {
      ok: true,
      status: 200,
      data: admin,
      message: "School admin retrieved successfully",
    };
  }

  async updateAdminDetails({ res, adminId, ...data }) {
    const existingAdmin = await this.mongomodels.schoolAdmin.findById(adminId);

    if (!existingAdmin) {
      return { ok: false, message: "School admin not found." };
    }

    const updatedAdmin = await this.mongomodels.schoolAdmin
      .findByIdAndUpdate(adminId, data, { new: true })
      .select("-password -_id");

    return {
      ok: true,
      status: 200,
      message: "School admin updated successfully.",
      data: updatedAdmin,
    };
  }

  async getAdmins({ schoolId }) {
    const school = await this.mongomodels.school.findById(schoolId);

    if (!school) {
      return { ok: false, message: "School not found." };
    }

    const allAdminsInSchool = await this.mongomodels.schoolAdmin
      .find({
        schoolId,
      })
      .select("-password -_id");

    return {
      ok: true,
      status: 200,
      message: "School admins retrieved successfully.",
      data: allAdminsInSchool,
    };
  }

  async deleteAdmin({ adminId }) {
    const existingAdmin = await this.mongomodels.schoolAdmin.findById(adminId);

    if (!existingAdmin) {
      return { ok: false, message: "School admin not found." };
    }

    await this.mongomodels.schoolAdmin.findByIdAndDelete(adminId);

    return { ok: true, message: "School admin deleted successfully." };
  }

  // School Teacher
  async createTeacher({ res, ...data }) {
    const validatedData =
      await this.validators.schoolTeacher.validateAsync(data);

    // 2. Check if School exists
    const schoolExists = await this.mongomodels.school.exists({
      _id: validatedData.schoolId,
    });
    
    if (!schoolExists)
      return { ok: false, message: "Assigned school does not exist." };

    // 3. Hash Password & Save
    validatedData.password = await this.utils.encryptPassword(
      validatedData.password,
    );
    const newTeacher =
      await this.mongomodels.schoolTeacher.create(validatedData);

    return {
      ok: true,
      message: "Teacher created successfully",
      data: newTeacher,
    };
  }
};
