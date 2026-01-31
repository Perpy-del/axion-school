# Axion Educational Management System

A high-performance, modular Node.js backend designed for school administration. This project utilizes a custom **Manager-Loader** architecture to ensure clear separation of concerns, scalability, and automated dependency injection.

---

## 📂 Project Structure

The project is organized by functional entities. Each entity is self-contained with its own validation, database blueprint, and business logic.

```text
root/
├── loaders/                  # System initializers
│   ├── MongoLoader.js        # Turns .schema.js into live Mongoose Models
│   ├── ValidatorsLoader.js   # Compiles Joi schemas into executable functions
│   └── ManagersLoader.js     # The "Brain" that wires everything together
├── managers/
│   ├── _common/              # Shared schemas and validation logic
│   ├── api/                  # HTTP/Cortex API Handlers
│   ├── entities/             # Core Business Domains
│   │   └── school/           
│   │       ├── student/      # Student Entity
│   │       │   ├── student.manager.js    # Business Logic
│   │       │   ├── student.schema.js     # Mongoose Blueprint (DB Structure)
│   │       │   └── student.validator.js  # Joi Gatekeeper (Input Validation)
│   │       └── schools/      # School Entity
│   └── response_dispatcher/  # Standardized JSON output & Error handling
├── libs/                     # Shared utilities (Encryption, Utils)
└── static_arch/              # System architecture definitions
