module.exports = class Health {
  constructor({ config, cortex }) {
    this.config = config;
    this.cortex = cortex;
    this.httpExposed = ["get=check"];
  }

  async check() {
    return {
      ok: true,
      message: "Axion School Server is live",
    };
  }
};
