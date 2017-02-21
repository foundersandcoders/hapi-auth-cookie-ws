const home = {
  method: 'GET',
  path: '/',
  handler (req, reply) {
    reply.view('index');
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

const login = {
  method: 'POST',
  path: '/login',
  handler (req, reply) {
    reply.view('user-page');
  }
}

const authRoute = {
  method: 'GET',
  path: '/auth-only',
  handler (request, reply) {
    reply('You\'re not authenticated :(');
  }
}

module.exports = [
  home,
  fileServer,
  login,
  authRoute
]
