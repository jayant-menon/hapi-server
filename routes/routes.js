"use strict";

const Joi = require("@hapi/joi");

exports.configureRoutes = (server) => {
  return server.route([
    {
      method: "GET",
      path: "/home/{name}",
      handler: (request, h) => {
        return `Hello ${request.params.name}!`;
      },
    },
    {
      method: "POST",
      path: "/home/date/required",
      config: {
        validate: {
          payload: Joi.object({
            date: Joi.date().required(),
          }),
        },
      },
      handler: (request, h) => {
        return request.payload;
      },
    },
    {
      method: "POST",
      path: "/home/create/travel",
      config: {
        validate: {
          payload: Joi.object({
            from: Joi.date().min("now").required(),
            to: Joi.date().greater(Joi.ref("from")).required(),
          }),
        },
      },
      handler: (request, h) => {
        return request.payload;
      },
    },
  ]);
};
