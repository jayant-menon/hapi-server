// In this Hapi server, we're going to be serving static files to the user.
// using @hapi/inert : to serve static files, partials, static file routing
// downloading and displaying files

// A static file is a file that is delivered to the user without
// having to be modified. Think - login page - that view
// is not going to be needed to be modified on a per user basis generally

// The hapi plugin that we will be using for this is called inert
// Inert adds functionality to the response toolkit, ie, h

// In this server, I'm going to register my plugin slightly differently, by
// importing it atop the file and assigning it to a const, then
// registering the const

// Node allows us to return an entire file as a series of strings
// but that would be insanely inconvenient of course, so we can use
// inert to return an html file

// when using h.file(), which is the method added to h by inert, h.file()
// takes two arguments, first is path to file, (optional)second is options

// In the options, we can specify a default route for our static files, for example

// The server object can also take a routes key, which takes an object as a param which has a files key, the value of which is an object which has a relativeTo key, the value of which is a joined path - now the server will serve files from that path

// Another thing we can do with inert is add routes in your static files
// we can add anchor tags in our static files, and we will be redirected
// accordingly

// with inert we can also download files as well as display them

'use strict';

const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const path = require('path');

// create server
const init = async () => {
  const server = Hapi.Server({
    host: '127.0.0.1',
    port: 8080,
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
        return h.file('welcome.html');
      },
    },
    {
      method: 'GET',
      path: '/location',
      handler: (request, h) => {
        if (request.location) {
          return request.location;
        }
        return `location not found`;
      },
    },
    {
      method: 'GET',
      path: '/hello',
      handler: (request, h) => {
        return `hello world`;
      },
    },
    {
      method: 'GET',
      path: '/download',
      handler: (request, h) => {
        return h.file('welcome.html', {
          mode: 'attachment', // the default is 'inline' where we would be shown the file instead of downloading it
          filename: 'download.html',
        });
      },
    },
  ]);

  await server.start();
  console.log(`Server listening on ${server.info.uri}`);
};

// catching an error if the init method's promise is rejected
process.on('unhandledRejection', (error) => {
  console.log(error);
  process.exit(1);
});

// initialize server
init();
