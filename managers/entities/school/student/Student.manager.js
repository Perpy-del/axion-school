module.exports = class StudentManager {
  constructor({ config, cache, cortex, mongomodels, validators }) {
    this.config = config;
    this.cache = cache;
    this.cortex = cortex;
    this.mongomodels = mongomodels;
    this.validators = validators;
    this.httpExposed = ["post=createStudent"];
  }

  async createStudent({ res, ...data }) {
    // Validation
    let result = await this.validators.student.student({ student: data });

    if (!result) {
      return { ok: false, message: "Validation failed to return a result." };
    }

    if (result.errors && result.errors.length > 0) {
      return {
        ok: false,
        message: "Validation Error",
        errors: result.errors,
      };
    }

    if (result.errors) {
      return { ok: false, errors: result.errors };
    }

    // Logic
    // check if student exists
    const existingStudent = await this.mongomodels.student.findOne({
      email: data.email,
    });
    if (existingStudent) {
      return { ok: false, message: "Student with this email already exists." };
    }

    // check if the class is full
    // const classroom = await this.mongomodels.Classroom.findById(data.classId);

    // const studentCount = await this.mongomodels.Student.countDocuments({
    //   classId: data.classId,
    // });
    // if (studentCount >= classroom.capacity) {
    //   return { ok: false, message: "Classroom is full." };
    // }

    // create student
    const newStudent = new this.mongomodels.student(data);
    await newStudent.save();
    console.log("Creating student:", newStudent.id);
    return {
      ok: true,
      message: "Student created successfully.",
      data: { userId: newStudent._id },
    };
  }
};
