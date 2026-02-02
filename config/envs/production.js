module.exports = {
  ENV: "production",
  DEBUG: false,
  PORT: process.env.USER_PORT || 8000,
  MONGO_URI:
    process.env.MONGO_URI_PROD || "mongodb://localhost:27017/axion-prod",
  REDIS_URI: process.env.REDIS_URI_PROD || "redis://localhost:6379",
  CACHE_REDIS: process.env.CACHE_REDIS_PROD || null,
  CACHE_PREFIX: process.env.CACHE_PREFIX || 'axion-school',
  LONG_TOKEN_SECRET: process.env.LONG_TOKEN_SECRET || null,
  SHORT_TOKEN_SECRET: process.env.SHORT_TOKEN_SECRET || null,
  NACL_SECRET: process.env.NACL_SECRET || null,
  CORTEX_REDIS: process.env.CORTEX_REDIS_DEV || process.env.REDIS_URI_DEV || "redis://localhost:6379",
  CORTEX_PREFIX: process.env.CORTEX_PREFIX || 'none',
  CORTEX_TYPE: process.env.CORTEX_TYPE || process.env.SERVICE_NAME || 'axion-school',
  OYSTER_REDIS: process.env.OYSTER_REDIS || process.env.REDIS_URI_DEV || "redis://localhost:6379",
  OYSTER_PREFIX: process.env.OYSTER_PREFIX || 'none',
  INITIAL_ADMIN_EMAIL: process.env.INITIAL_ADMIN_EMAIL,
  INITIAL_ADMIN_PASSWORD: process.env.INITIAL_ADMIN_PASSWORD
};
