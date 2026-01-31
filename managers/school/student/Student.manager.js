module.exports = class StudentManager {
  constructor({ config, cache, cortex, mongoDB }) {
    this.config = config;
    this.cache = cache;
    this.cortex = cortex;
    this.mongomodels = mongomodels;

    this.httpExposed = [];
  }

  async createStudent({ data, res }) {
    // Validation
    let result = await this.validators.student(data);

    if (result.errors) {
      return { ok: false, errors: result.errors };
    }

    // Logic
    // check if student exists
    const existingStudent = await this.mongomodels.Student.findOne({
      email: data.email,
    });
    if (existingStudent) {
      return { ok: false, message: "Student with this email already exists." };
    }

    // check if the class is full
    const classroom = await this.mongomodels.Classroom.findById(data.classId);

    const studentCount = await this.mongomodels.Student.countDocuments({
      classId: data.classId,
    });
    if (studentCount >= classroom.capacity) {
      return { ok: false, message: "Classroom is full." };
    }

    // create student
    const newStudent = new this.mongomodels.Student(data);
    await newStudent.save();
    console.log("Creating student:", data.id);
    return {
      ok: true,
      message: "Student created successfully.",
      data: { userId: newStudent._id },
    };
  }
};
