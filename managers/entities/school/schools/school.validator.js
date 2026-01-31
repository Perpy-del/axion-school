const Joi = require("joi");

module.exports = {
  create: Joi.object({
    name: Joi.string().min(3).max(200).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().min(10).max(15),
    street: Joi.string().min(10).max(300).required(),
    city: Joi.string().min(3).max(100).required(),
    state: Joi.string().min(2).max(100).required(),
    schoolLogo: Joi.string().uri().allow("", null),
    schoolAdminId: Joi.string().optional(),
    isDeleted: Joi.boolean().default(false),
  }),

  update: Joi.object({
    name: Joi.string().min(3).max(200),
    phone: Joi.string().min(10).max(15),
    schoolLogo: Joi.string().uri(),
    isDeleted: Joi.boolean(),
  }).min(1),
};
