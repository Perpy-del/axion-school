const loader = require("./_common/fileLoader");
const Pine = require("qantra-pineapple");

/**
 * load any file that match the pattern of function file and require them
 * @return an array of the required functions
 */
module.exports = class ValidatorsLoader {
  constructor({ models, customValidators } = {}) {
    this.models = models;
    this.customValidators = customValidators;
  }
  load() {
    const validators = {};

    /**
     * load schemes
     * load models ( passed to the consturctor )
     * load custom validators
     */
    const schemes = loader("./managers/**/*.schema.js");

    Object.keys(schemes).forEach((sk) => {
      let pine = new Pine({
        models: this.models,
        customValidators: this.customValidators,
      });
      validators[sk] = {};
      Object.keys(schemes[sk]).forEach((s) => {
        validators[sk][s] = async (data) => {
          const result = await pine.validate(data, schemes[sk][s]);
          if (result === false) {
        return {
            ok: false,
            errors: (pine.errors && pine.errors.length > 0) 
                    ? pine.errors 
                    : ["Validation failed: Check required fields or labels"]
        };
    }

          return {
            ok: true,
            data: result,
          }
        };
        /** also exports the trimmer function for the same */
        validators[sk][`${s}Trimmer`] = async (data) => {
          const result = await pine.trim(data, schemes[sk][s]);
          if (result === false || (result && result.errors)) {
            return {
              ok: false,
              errors: result.errors ||
                (result.output && result.output.errors) ||
                pine.errors || ["Validation failed"],
            };
          }
          return result;
        };
      });
    });

    return validators;
  }
};
