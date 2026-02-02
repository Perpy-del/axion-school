const Joi = require("joi");

module.exports = {
  create: Joi.object({
    firstName: Joi.string().min(3).max(100).required(),
    lastName: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().required(),
    age: Joi.number().integer().required(),
    gender: Joi.string().valid("male", "female", "other"),
    schoolId: Joi.string().required(),
    classId: Joi.string(),
    parents: Joi.array().items(
      Joi.object({
        name: Joi.string(),
        phone: Joi.string().min(10).max(13),
      }),
    ),
    password: Joi.string().min(8).required(),
  }),
};
