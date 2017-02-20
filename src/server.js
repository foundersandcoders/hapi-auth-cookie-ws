const Hapi = require('hapi');
const Vision = require('vision');
const Inert = require('inert');
const Handlebars = require('handlebars');

const routes = require('./routes.js');

const server = new Hapi.Server();

server.connection({
  port: process.env.PORT || 4000
});

server.register([Vision, Inert], (err) => {
  if (err) throw err;

  server.views({
    engines: { html: Handlebars },
    path: './src/views',
    layoutPath: './src/views/layout',
    layout: 'index'
  });

  server.route(routes);
});

module.exports = server;
