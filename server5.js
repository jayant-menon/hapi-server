// We will set a cookie in this server.
'use strict';

const Hapi = require('@hapi/hapi');

// Server setup
const init = async () => {
  // Create server object
  const server = Hapi.server({
    host: 'localhost',
    port: 8000,
  });

  // register plugins
  await server.register([
    {
      plugin: require('@hapi/cookie'),
    },
    {
      plugin: require('@hapi/inert'),
    },
  ]);

  // strategy
  server.auth.strategy('login', 'cookie', {
    cookie: {
      name: 'session',
      password: 'hello123hello123hello123hello123',
      isSecure: false,
    },
    // where to redirect the user if an unauthenticated
    // user tries to access a protected page
    redirectTo: '/',

    // the validateFunc verifies that the user session
    // with the server is still valid
    // the params this function will take are 1. the request obj
    // that contains the cookie and 2. the session object
    // that is created if the user has successfully logged in
    // that is set via request.cookieAuth.set()
    // The method must return an object with the key 'valid'
    // and the value to be 'true' or 'false' depending
    // on whether authenticated

    // Here, we've created a session with the username and
    // password, which we've hardcoded one pair into the route
    // itself. We've stored the same username and password
    // into the session, and set a cookie too with the same data
    // here, we're verifying if the cookie has that.

    // Ideally, we'd have multiple users in a DB that we would first
    // check if the user exists, then if pwd matches,
    // then we would create a session in the DB, which would
    // have a session ID. that session ID is sent to the
    // client in a coookie, and then we check if there's
    // a cookie in subsequent requests, and whether the
    // sessionID on there (if there) matches something in our DB
    // and then redirect appropriately from there.
    validateFunc: async (request, session) => {
      const sessionUsername = session.username;
      const sessionPassword = session.password;

      if (sessionUsername === 'Jayant' && sessionPassword === 'Hapijs') {
        return { valid: true };
      }
      return { valid: false };
    },
  });

  // Once we've got our startegy, we need to register it with
  // every/spercific routes. We're going to register with every route here
  // Here, we're passing in the same name we assigned when registering the
  // strategy
  server.auth.default('login');

  // routes
  server.route([
    {
      method: 'GET',
      path: '/',
      handler: (request, h) => {
        return h.file('static/login.html');
      },
      options: {
        auth: {
          mode: 'try',
        },
      },
    },
    {
      method: 'POST',
      path: '/login',
      handler: (request, h) => {
        const username = request.payload.username;
        const password = request.payload.password;

        const isValidUser = username === 'Jayant';
        const isValidPass = password === 'Hapijs';

        if (isValidUser && isValidPass) {
          // request.cookieAuth.set() sets the session object
          request.cookieAuth.set({
            username,
            password,
          });
          return h.redirect('/welcome');
        }
        return h.redirect('/');
      },
      options: {
        auth: {
          mode: 'try',
        },
      },
    },
    {
      method: 'GET',
      path: '/welcome',
      handler: (request, h) => {
        return h.file('static/logged-in.html');
      },
    },
  ]);

  //start the server
  await server.start();
  console.log(`Server 5 started on: ${server.info.uri}`);
};

// Handle failing promise of init function
process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

// Start up
init();
