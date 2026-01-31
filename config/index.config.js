require("dotenv").config();
const env = (process.env.NODE_ENV || "development").trim();
const production = require("./envs/production");
const development = require("./envs/development");
const pjson = require("../package.json");
const utils = require("../libs/utils");

const SERVICE_NAME = process.env.SERVICE_NAME
  ? utils.slugify(process.env.SERVICE_NAME)
  : pjson.name;

const LONG_TOKEN_SECRET = process.env.LONG_TOKEN_SECRET;
const SHORT_TOKEN_SECRET = process.env.SHORT_TOKEN_SECRET;
const NACL_SECRET = process.env.NACL_SECRET;

const configs = {
  development: development,
  production: production
};


if(!LONG_TOKEN_SECRET || !SHORT_TOKEN_SECRET || !NACL_SECRET) {
  throw Error('missing .env variables check index.config');
}

module.exports = {
  ...configs[env],
  serviceName: SERVICE_NAME || "axion-school",
};
