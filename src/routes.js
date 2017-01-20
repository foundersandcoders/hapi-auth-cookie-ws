const home = {
  method: 'GET',
  path: '/',
  handler (req, reply) {
      if (err) console.log(err);
      reply.view('index', { user });
    });
  }
};

const fileServer = {
  method: 'GET',
  path: '/static/{param*}',
  handler: {
    directory: {
      path: 'public'
    }
  }
};

module.exports = [
  home,
  fileServer
]
