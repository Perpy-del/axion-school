const config = require("./config/index.config.js");
const Cortex = require("ion-cortex");
const ManagersLoader = require("./loaders/ManagersLoader.js");

const mongoDB = config.MONGO_URI
  ? require("./connect/mongo")({
      uri: config.MONGO_URI,
    })
  : null;

const cache = require("./cache/cache.dbh")({
  prefix: config.CACHE_PREFIX,
  url: config.CACHE_REDIS,
});

const cortex = new Cortex({
  prefix: config.CORTEX_PREFIX,
  url: config.CORTEX_REDIS,
  type: config.CORTEX_TYPE,
  state: () => {
    return {};
  },
  activeDelay: "50ms",
  idlDelay: "200ms",
});

const seedSuperAdmin = async (managers) => {
  try {
    const SuperAdminModel = managers.mongoDB.models.SuperAdmin;
    const adminCount = await SuperAdminModel.countDocuments();

    if (adminCount === 0) {
      await managers.superAdmin.createSuperAdmin({
        username: "axion_admin", // Ensure this matches your schema (username vs firstName)
        email: process.env.INITIAL_ADMIN_EMAIL,
        password: process.env.INITIAL_ADMIN_PASSWORD,
      });
      console.log("Initial SuperAdmin created successfully.");
    }
  } catch (error) {
    console.error("Failed to seed SuperAdmin:", error);
  }
};

const managersLoader = new ManagersLoader({
  config,
  cache,
  cortex,
  mongoDB,
});
const managers = managersLoader.load();

(async () => {
  await seedSuperAdmin(managers);
  managers.userServer.run();
})();
