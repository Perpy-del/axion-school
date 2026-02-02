const Joi = require("joi");

module.exports = {
  createSuperAdmin: {
    firstName: Joi.string().min(3).max(30).required(),
    lastName: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  },

  login: {
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  },

  updateSuperAdmin: {
    firstName: Joi.string().min(3).max(30).optional(),
    lastName: Joi.string().min(3).max(30).optional(),
    email: Joi.string().email().optional(),
    isActive: Joi.boolean().optional(),
  },
};
