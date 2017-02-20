const CookieAuth = require('hapi-auth-cookie');

const home = {
  method: 'GET',
  path: '/',
  handler (req, reply) {
    reply.view('index');
  }
}

const login = {
  method: 'POST',
  path: '/login',
  handler (req, reply) {
    var username = req.payload.username;
    var password = req.payload.password;
    // Database check
    req.cookieAuth.set({ username: username });
    reply.view('user-page');
  }
}

const authRoute = {
  method: 'GET',
  path: '/secret',
  config: {
    auth: {
      strategy: 'base'
      },
    handler (request, reply) {
      reply('you’re authenticated :)')
    }
  }
}

const fileServer = {
  method: 'GET',
  path: '/{param*}',
  handler: {
    directory: {
      path: './public'
    }
  }
}

module.exports = [
  home,
  fileServer,
  login,
  authRoute
]
