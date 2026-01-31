module.exports = class ValidatorsLoader {
  constructor({ validators }) {
    this.validators = validators;
  }

  load() {
    const compiledValidators = {};

    Object.keys(this.validators).forEach((entity) => {
      compiledValidators[entity] = {};
      const actions = this.validators[entity];

      Object.keys(actions).forEach((action) => {
        const joiSchema = actions[action];
        compiledValidators[entity][action] = async (data) => {
          try {
            return await joiSchema.validateAsync(data, {
              abortEarly: false,
              stripUnknown: true,
            });
          } catch (err) {
            throw {
              type: "validation",
              messages: err.details.map(d => d.message.replace(/"/g, '')),
            };
          }
        };
      });
    });
    return compiledValidators;
  }
};
