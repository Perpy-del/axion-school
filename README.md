flowchart TB
  A[app.js / index.js] --> L[loaders/ManagersLoader]
  L --> M[managers/* (domain)]
  L --> MW[mws/* (middleware)]
  M --> DB[Mongoose / LiveDb / Oyster]
  M --> CACHE[Redis / Cortex]
  M --> RESP[ResponseDispatcher]
  API[Api.manager] -->|mounts| USER[UserServer.manager]
  USER --> HTTP[Express route /api/:module/:fnName]
  HTTP --> API

  - Set up the different environment and add it to script to run development and production environment separately

  - Set up nodemon for reload anytime we save new changes without having to stop and start the project process over and over again.
  
  