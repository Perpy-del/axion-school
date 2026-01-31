module.exports = {
  student: {
    firstName: {
      type: "String",
      length: {
        min: 3,
        max: 100,
      },
      required: true,
    },
    lastName: {
      type: String,
      length: {
        min: 3,
        max: 100,
      },
      required: true,
    },
    email: {
      type: "String",
      length: { min: 3, max: 100 },
      format: "email",
      required: true,
    },
    age: { type: Number },
    classId: { type: String, required: false },
    gender: {
      type: "String",
      oneOf: ["male", "female", "other"],
    },
    schoolId: {
      type: String,
    },
    profileImage: {
      type: "String",
    },
    parents: [
      {
        name: {
          type: "String",
          length: { min: 3, max: 100 },
        },
        phone: {
          type: "String",
          length: { min: 10, max: 13 },
        },
      },
    ],
    password: {
      type: "String",
      length: { min: 8, max: 100 },
      required: true,
    },
  },
};
