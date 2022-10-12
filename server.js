"use strict";

const Hapi = require("@hapi/hapi");

// creating a server object
// a common practice with hapi is to wrap the server object in an async function
// to be able to use the await keyword
// Note: an async function always returns a promise object
const init = async () => {
  // The hapi server accepts an object as a param, the most imp keys in the
  // param object are 'host' and the 'port'
  const server = Hapi.Server({
    host: "localhost",
    port: 3000,
  });

  // setting the home route
  // server.route() creates a route
  // Each route accepts an object as a param, the object accepts at least
  // a HTTP method, a url path, and a handler that performs the business logic
  // the parameters that the handler function takes can be names anything,
  // but hapi convention is (request, h)
  // the request object is created internally by hapi for each incoming request,
  // contains details about the request
  // contains request.auth, request.query, request.path, params, etc.
  // h is a response toolkit which we can use to do things (like redirect the user, etc.)
  server.route({
    method: "GET",
    path: "/",
    handler: (request, h) => {
      return `<h1>Hello World!</h1>`;
    },
  });

  // In this route, we're using params. params is an object where
  // each key is a path parameter name
  // so if i go to /users/jayant
  // request.params = { user: "jayant"}
  server.route({
    method: "GET",
    path: "/users/{user}",
    handler: (request, h) => {
      return `<h1>Hello ${request.params.user}</h1>`;
    },
  });

  await server.start();
  // logging the fact the server started, server.info.uri refers to the passed in param to the server object,
  // in this case http://localhost:3000
  console.log(`Server started on {server.info.uri}`);
};

// The process object is a global object that provides information about the current node process
// that's running
// The 'unhandledRejection' event is emitted when a promise is rejected and no error handler is
// attached to the promise within a turn of the event loop

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

// Since our init function is async, it will return a promise.
// So we need to handle the case in which the promise is rejected
// that we're doing above - instead of doing something like `init().catch()`

// starting the server
init();
