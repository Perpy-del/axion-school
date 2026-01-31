module.exports = {
  schoolTeacher: ({
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
  }),
};
