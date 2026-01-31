const mongoose = require("mongoose");
const loader = require("./_common/fileLoader");

module.exports = class MongoLoader {
  constructor({ schemaExtension }) {
    this.schemaExtension = schemaExtension;
  }

  load() {
    /** load Mongo Models */
    const schemas = loader(`./managers/**/*.${this.schemaExtension}`);
    const models = {};

    Object.keys(schemas).forEach((key) => {
      if (mongoose.models[key]) {
        models[key] = mongoose.models[key];
      } else {
        const definition = schemas[key][key] ? schemas[key][key] : schemas[key];
        
        const schema = new mongoose.Schema(definition, { timestamps: true });
        models[key] = mongoose.model(key, schema);
      }
    });

    return models;
  }
};
