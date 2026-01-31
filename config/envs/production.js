module.exports = {
  ENV: "production",
  DEBUG: false,
  PORT: process.env.USER_PORT || 8000,
  MONGO_URI:
    process.env.MONGO_URI_PROD || "mongodb://localhost:27017/axion-prod",
  REDIS_URI: process.env.REDIS_URI_PROD || "redis://localhost:6379",
  CACHE_REDIS: process.env.CACHE_REDIS_PROD || null,
  LONG_TOKEN_SECRET: process.env.LONG_TOKEN_SECRET_PROD || null,
  SHORT_TOKEN_SECRET: process.env.SHORT_TOKEN_SECRET_PROD || null,
  NACL_SECRET: process.env.NACL_SECRET_PROD || null,
};
