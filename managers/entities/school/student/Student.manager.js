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
    console.log("Validator Keys:", Object.keys(this.validators));
    if (this.validators.student) {
      console.log(
        "Internal Keys for 'student':",
        Object.keys(this.validators.student),
      );
    }

    // Validation
    if (!this.validators.student) {
      console.error(
        "❌ Validator 'student' not found. Available:",
        Object.keys(this.validators),
      );
      return { ok: false, message: "Internal validation error" };
    }

    let result = await this.validators.student.student(data);

    if (result.errors) {
      return { ok: false, errors: result.errors };
    }

    // Logic
    // check if student exists
    console.log("Available Mongo Models:", Object.keys(this.mongomodels));
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
