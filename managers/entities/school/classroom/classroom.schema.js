module.exports = {
  classroom: {
    name: {
      type: "String",
      required: true,
      length: { min: 3, max: 100 },
    },
    capacity: {
      type: "Number",
      required: true,
    },
    classTeacherId: {
      type: "String",
      ref: "teacher",
    },
    subjects: {
      type: "Array",
      items: {
        type: "String",
      },
    },
    schoolId: {
      type: "String",
      required: true,
      ref: "school",
    },
    courseMaterials: {
      type: "Array",
      items: {
        type: "String",
        ref: "courseMaterial",
      },
    },
    exams: {
      type: "Array",
      items: {
        type: "String",
        ref: "exam",
      },
    },
  },

  // Resources
  courseMaterial: {
    title: {
      type: "String",
      required: true,
      length: { min: 3, max: 200 },
    },
    files: {
      type: "Array",
      items: {
        type: "String",
        format: "url",
      },
    },
    subjectId: {
      type: "String",
      required: true,
      ref: "subject",
    },
    uploadedBy: {
      type: "String",
      ref: "teacher",
    },
    uploadDate: {
      type: "Date",
      default: Date.now,
    },
    classId: {
      type: "String",
      ref: "classroom",
    },
    schoolId: {
      type: "String",
      ref: "school",
    },
  },

  exam: {
    title: {
      type: "String",
      required: true,
      length: { min: 3, max: 200 },
    },
    date: {
      type: "Date",
      required: true,
    },
    subjectId: {
      type: "String",
      required: true,
      ref: "subject",
    },
    totalMarks: {
      type: "Number",
      required: true,
    },
    classId: {
      type: "String",
      ref: "classroom",
    },
    passMark: {
      type: "Number",
    },
    examMode: {
      type: "String",
      oneOf: ["manual", "automated"],
    },
    startTime: {
      type: "String",
    },
    endTime: {
      type: "String",
    },
    instruction: {
      type: "String",
      length: { min: 0, max: 1000 },
    },
    questions: {
      type: "Array",
      items: {
        question: {
          type: "String"
        },
        options: {
          type: "Array",
          items: {
            type: "String"
          }
        },
        correctOption: {
          type: "String",
          required: true
        },
        selectedOption: {
          type: "String"
        }
      }
    }
  },
};
