const Joi = require("joi");

module.exports = {
  create: Joi.object({
    firstName: Joi.string().min(3).max(100).required(),
    lastName: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().min(10).max(15).required(),
    address: Joi.string().min(10).max(300).required(),
    password: Joi.string().min(8).max(100).required(), // Derived from common password logic
    role: Joi.string().min(3).max(50).default("admin"),
    schoolId: Joi.string().optional(),
  }),

  update: Joi.object({
    firstName: Joi.string().min(3).max(100),
    lastName: Joi.string().min(3).max(100),
    phone: Joi.string().min(10).max(15),
    address: Joi.string().min(10).max(300),
    role: Joi.string().min(3).max(50),
  }).min(1),
};
