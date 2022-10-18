// In this server, we're going to work with forms and the HTTP POST method
// The POST method requests that the server accepts a payload
// The payload is part of the request and houses the actual intended message
// The action attribute of a form defines where the data gets sent, ie
// which server route we're going to direct to

// for a field like <input type="text" name="username">
// we can access it as request.payload.username

// Note - even if I'm only logging a value in a handler for a route,
// the handler method MUST return a value

// @hapi/vision is a plugin that enables us to use a templating engine 

'use strict';

const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const path = require('path');

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
  ]);

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
        return h.file('welcome.html');
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
