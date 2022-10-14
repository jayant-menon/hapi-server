// Implementing authentication with hapi/basic

// The way auth works in Hapi is through the use of schemes and strategies
// Basic authentication is a popup that shows up on the page that prompts the
// user for a login and password

// Schemes are a way of handling authentication within hapi
// Some schemes in hapi are the basic scheme, digest scheme, and cookie scheme

// A strategy is a configured instance of a scheme with an assigned name
// You can have multiple strategies for a scheme
// Strategies exist so you can use the same scheme several times in a slightly different way

// In short, a scheme is an overall type of authentication, and a strategy is how you implement that scheme

'use strict';

const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const Basic = require('@hapi/basic');
const path = require('path');

const users = {
  jmenon: {
    username: 'jmenon',
    password: '1234',
    id: 0,
    name: 'Jayant Menon',
  },
  suraj: {
    username: 'suraj',
    password: '1234',
    id: 0,
    name: 'Suraj Nanavare',
  },
};

// defining the validate function to be used in accordance with our 'basic' scheme - this will validate the user/credentials
// request must be provided as an param for the sake of ordering, but h is optional
const validate = function (request, username, password, h) {
  if (!users[username]) {
    return { isValid: false };
  }

  const user = users[username];

  // The object passed to credentials can be accessed in the handler in the request object with `request.auth.credentials`
  if (user.password === password) {
    return { isValid: true, credentials: { id: user.id, name: user.name } };
  }

  return { isValid: false };
};

const init = async () => {
  const server = Hapi.Server({
    host: '127.0.0.1',
    port: '8080',
    routes: {
      files: {
        relativeTo: path.join(__dirname, 'static'),
      },
    },
  });

  // register plugins
  await server.register([
    {
      plugin: Inert,
    },
    {
      plugin: Basic,
    },
  ]);

  // implementing strategy - first argument name of strategy (decided by us)
  // 2nd arg is scheme - which has to be 'basic' since that's what we are using,
  // 3 arg is an object with options - based on the scheme requirements
  // For 'basic', our scheme, validate is a required key in options,
  // validate is basically the function that will validate the user
  // credentials. The return value of the validate function must return
  // isValid
  server.auth.strategy('login', 'basic', { validate });

  // routes
  server.route([
    {
      method: 'GET',
      path: '/',
      handler: (request, h) => {
        return `<h1>Hello</h1>`;
      },
    },
    {
      method: 'GET',
      path: '/login',
      handler: (request, h) => {
        return `Successfully logged in`;
      },
      // Here, what we're passing to auth is the name of the startegy we created, which is 'login' (look at convention here - what's the standard naming? )
      options: {
        auth: 'login',
      },
    },
    {
      method: 'POST',
      path: '/login',
      handler: (request, h) => {
        console.log(request.payload.username);
        console.log(request.payload.password);
        return `Hi`;
      },
    },
  ]);

  await server.start();
  console.log(`Server listening on ${server.info.uri}`);
};

// catch an error with my server

process.on('unhandledRejection', (error) => {
  console.log(error);
  process.exit(1);
});

// initialize my server
init();
