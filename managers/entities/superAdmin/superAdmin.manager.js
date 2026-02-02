const bcrypt = require("bcrypt");

class SuperAdminManager {
  constructor({ config, cache, mongoDB, utils }) {
    this.config = config;
    this.cache = cache;
    this.mongoDB = mongoDB;
    this.utils = utils; // Assuming utils contains your hashing/token logic
    this.superAdminModel = mongoDB.models.SuperAdmin;
    this.httpExposed = ["createSuperAdmin", "login"];
  }

  async createSuperAdmin({ __user, firstName, lastName, email, password }) {
    if (!__user || __user.role !== "superAdmin") {
      return {
        error: "Forbidden: Only SuperAdmins can create other admins",
        code: 403,
      };
    }

    const exists = await this.superAdminModel.findOne({ email });
    if (exists) return { error: "Admin already exists", code: 409 };

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await this.superAdminModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: "superAdmin",
    });

    return { ok: true, data: { id: newAdmin._id, email: newAdmin.email } };
  }

  async login({ email, password }) {
    const admin = await this.superAdminModel.findOne({ email });
    if (!admin) return { error: "Invalid credentials", code: 401 };

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return { error: "Invalid credentials", code: 401 };

    const token = this.utils.createToken({
      id: admin._id,
      role: "superAdmin",
    });

    return {
      token,
      user: { username: admin.username, email: admin.email },
    };
  }
}

module.exports = SuperAdminManager;
