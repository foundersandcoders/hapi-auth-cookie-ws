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
    console.log(req, "login request");
    req.cookieAuth.set(req.payload.username);
    console.log(request.auth.credentials);
    reply.view('index');
  }
}

module.exports = [
  home,
  fileServer
]
