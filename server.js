"use strict";

const Hapi = require("@hapi/hapi");
const { configureRoutes } = require("./routes/routes");

const server = Hapi.server({
  port: 3000,
  host: "localhost",
});

const init = async () => {
  await server.start();
  await configureRoutes(server);
  console.log("Server running on %s", server.info.uri);
};

// server.route({
//   method: "GET",
//   path: "/home",
//   handler: (request, h) => {
//     return "<h1>Hello Jayant!</h1>";
//   },
// });

// server.route({
//   method: "GET",
//   path: "/home/{name}",
//   handler: (request, h) => {
//     return `Hello ${request.params.name}!`;
//   },
// });

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
