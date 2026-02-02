const Joi = require("joi");

module.exports = {
  create: Joi.object({
    firstName: Joi.string().min(3).max(100).required().messages({
      "string.min": "First name must be at least 3 characters long",
    }),
    lastName: Joi.string().min(3).max(100).required(),
    email: Joi.string()
      .pattern(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      )
      .required()
      .lowercase()
      .messages({
        "string.pattern.base": "Invalid email format",
      }),
    phone: Joi.string().min(10).max(13).allow("", null),
    address: Joi.string().min(15).max(100).allow("", null),
    password: Joi.string().min(8).max(100).required(),
    schoolId: Joi.string().required(),
  }),

  update: Joi.object({
    firstName: Joi.string().min(3).max(100),
    lastName: Joi.string().min(3).max(100),
    phone: Joi.string().min(10).max(15),
    address: Joi.string().min(10).max(300)
  }),
};
