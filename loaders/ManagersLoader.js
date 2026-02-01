const MiddlewaresLoader = require("./MiddlewaresLoader");
const ApiHandler = require("../managers/api/Api.manager");
const LiveDB = require("../managers/live_db/LiveDb.manager");
const UserServer = require("../managers/http/UserServer.manager");
const ResponseDispatcher = require("../managers/response_dispatcher/ResponseDispatcher.manager");
const VirtualStack = require("../managers/virtual_stack/VirtualStack.manager");
const ValidatorsLoader = require("./ValidatorsLoader");
const MongoLoader = require("./MongoLoader");
const ResourceMeshLoader = require("./ResourceMeshLoader");
const utils = require("../libs/utils");

const systemArch = require("../static_arch/main.system");
const TokenManager = require("../managers/token/Token.manager");
const SharkFin = require("../managers/shark_fin/SharkFin.manager");
const TimeMachine = require("../managers/time_machine/TimeMachine.manager");

/**
 * load sharable modules
 * @return modules tree with instance of each module
 */
module.exports = class ManagersLoader {
  constructor({ config, cortex, cache, oyster, aeon }) {
    this.managers = {};
    this.config = config;
    this.cache = cache;
    this.cortex = cortex;

    this._preload();
    this.injectable = {
      utils,
      cache,
      config,
      cortex,
      oyster,
      aeon,
      managers: this.managers,
      validators: this.validators,
      mongomodels: this.mongomodels,
      resourceNodes: this.resourceNodes,
    };
  }

  _preload() {
    const studentValidators = require("../managers/entities/school/student/student.validators");
    const schoolValidators = require("../managers/entities/school/schools/school.validator");
    const schoolAdminValidators = require("../managers/entities/school/schools/schoolAdmin.validator");

    const studentSchemas = require("../managers/entities/school/student/student.schema");
    const schoolSchemas = require("../managers/entities/school/schools/school.schema");
    const schoolAdminSchemas = require("../managers/entities/school/schools/schoolAdmin.schema");

    const commonModels = require("../managers/_common/schema.models");

    const allModels = {
      ...studentSchemas,
      ...schoolSchemas,
      ...schoolAdminSchemas,
      ...commonModels,
    };

    const allValidators = {
      student: studentValidators,
      school: schoolValidators,
      schoolAdmin: schoolAdminValidators,
    };

    const validatorsLoader = new ValidatorsLoader({
      models: allModels,
      validators: allValidators,
      customValidators: require("../managers/_common/schema.validators"),
    });
    const resourceMeshLoader = new ResourceMeshLoader({});

    const mongoLoader = new MongoLoader();

    this.validators = validatorsLoader.load();
    this.mongomodels = mongoLoader.load({
      student: studentSchemas,
      school: schoolSchemas,
      schoolAdmin: schoolAdminSchemas,
    });
    this.resourceNodes = resourceMeshLoader.load();
  }

  load() {
    this.managers.responseDispatcher = new ResponseDispatcher();
    this.managers.liveDb = new LiveDB(this.injectable);
    const middlewaresLoader = new MiddlewaresLoader(this.injectable);
    const mwsRepo = middlewaresLoader.load();
    const { layers, actions } = systemArch;
    this.injectable.mwsRepo = mwsRepo;
    /*****************************************CUSTOM MANAGERS*****************************************/
    this.managers.shark = new SharkFin({ ...this.injectable, layers, actions });
    this.managers.timeMachine = new TimeMachine(this.injectable);
    this.managers.token = new TokenManager(this.injectable);
    /*************************************************************************************************/
    this.managers.mwsExec = new VirtualStack({
      ...{ preStack: [/* '__token', */ "__device"] },
      ...this.injectable,
    });

    const StudentManager = require("../managers/entities/school/student/Student.manager");
    this.managers.student = new StudentManager({
      ...this.injectable,
      mongomodels: this.mongomodels,
    });

    const SchoolManager = require("../managers/entities/school/schools/School.manager");
    this.managers.school = new SchoolManager({
      ...this.injectable,
      mongomodels: this.mongomodels,
    });

    const HealthManager = require("../managers/entities/health/Health.manager");
    this.managers.health = new HealthManager(this.injectable);

    this.managers.userApi = new ApiHandler({
      ...this.injectable,
      ...{ prop: "httpExposed" },
    });
    this.managers.userServer = new UserServer({
      config: this.config,
      managers: this.managers,
    });

    return this.managers;
  }
};
