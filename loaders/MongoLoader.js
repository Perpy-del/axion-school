const mongoose = require("mongoose");

module.exports = class MongoLoader {
  load(entities) {
    const models = {};
    // entities is an object where key is name and value is the .schema.js export
    Object.keys(entities).forEach((name) => {
      const schema = entities[name];
      // Initialize the Mongoose Model
      models[name] = mongoose.model(name, schema);
    });
    return models;
  }
};
