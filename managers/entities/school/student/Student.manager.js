// const { encryptPassword } = require("../../../../libs/utils");

module.exports = class StudentManager {
  constructor({ config, cache, cortex, mongomodels, validators, utils }) {
    this.config = config;
    this.cache = cache;
    this.cortex = cortex;
    this.mongomodels = mongomodels;
    this.validators = validators;
    this.utils = utils;
    this.httpExposed = ["post=createStudent"];
  }

  async createStudent({ res, ...data }) {
    // Validation
    const result = await this.validators.student.create(data);

    // Logic
    // check if student exists
    const existingStudent = await this.mongomodels.student.findOne({
      email: result.email,
    });
    if (existingStudent) {
      return { ok: false, message: "Student with this email already exists." };
    }

    // encrypt password
    const hashedPassword = await this.utils.encryptPassword(result.password);
    result.password = hashedPassword;

    // check if the class is full
    // const classroom = await this.mongomodels.Classroom.findById(result.classId);

    // const studentCount = await this.mongomodels.Student.countDocuments({
    //   classId: result.classId,
    // });
    // if (studentCount >= classroom.capacity) {
    //   return { ok: false, message: "Classroom is full." };
    // }

    // create student
    const newStudent = new this.mongomodels.student(result);
    await newStudent.save();
    console.log("Creating student:", newStudent.id);
    return {
      ok: true,
      message: "Student created successfully.",
      data: { userId: newStudent._id },
    };
  }

  async loginStudent({ res, email, password }) {
    // Find student by email
    const student = await this.mongomodels.student.findOne({ email });
    if (!student) {
      return { ok: false, message: "Student not found." };
    }
    // Check password
    if (student.password !== password) {
      return { ok: false, message: "Invalid password." };
    }
  }
};
