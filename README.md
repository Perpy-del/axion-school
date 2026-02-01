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
```

* `index.js`: The entry point of the application. It initializes the server and listens for requests.
* `app.js`: Contains the core Express application logic, middleware configurations, and route definitions.
* `package.json`: Manages project dependencies, metadata, and execution scripts.
* `.env`: Stores environment-specific variables like `PORT` and API keys (should be kept out of version control).
* `.gitignore`: Specifies files and folders (like `node_modules` and `.env`) that Git should ignore.

## Tech Stack
- **Node.js & Express**
- **Mongoose** (MongoDB Object Modeling)
- **Joi** (Data Valida**tion) - _Formerly Quantra-Pineapple_
- **Cortex** (Dependency Injection & Routing)

## Deployment Guide

### 1. Build & Start Commands
To ensure the application runs correctly, use these settings in the Railway Dashboard:
* **Build Command:** `npm install`
* **Start Command:** `node index.js`

### 2. Environment Variables
You add your local `.env` file, to add your variables to the project.

## Recent Improvements
* **Dynamic Port Binding**: Updated `index.js` to use `process.env.PORT` instead of a hardcoded port. This allows Railway to dynamically assign a port to the container.
* **Host Binding**: Configured the server to listen on `0.0.0.0` to ensure it accepts external traffic from the Railway proxy.

## 📈 Future Enhancements
* **Security**: Implement `helmet` middleware to secure HTTP headers.
* **Compression**: Use the compression middleware to reduce the size of the response body.
* **Rate Limiting**: Protect your API from brute force attacks.
* **Database Transaction (ACID)**: Implement transaction so that if any of the CRUD setup fails, the entire operation rolls back.
* **Response Standardization**: Ensuring the `ResponseManager` to ensure every API response follows the same structure

## Live URL
[Base URL](https://axion-school-production.up.railway.app/api)

## API Docs
[Postman Docs](https://documenter.getpostman.com/view/43233732/2sBXVoAUKE)

