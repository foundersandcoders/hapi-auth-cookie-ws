# Hapi-auth-cookie workshop

In this workshop you'll be adding session management (cookies) and authentication using hapi-auth-cookie to an existing project.

You'll see a Hapi.js server setup with handlebars templating engine already configured.


First clone the repo and run `npm install`.

## Step 1: Register hapi-auth-cookie

- First install the dependency using `npm install -S hapi-auth-cookie`.

- Then you'll need to require in this module in server.js:

```javascript
var CookieAuth = require('hapi-auth-cookie');
```

- Now register the module with your server alongside your other plugins:

```javascript
server.register([Vision, Inert, CookieAuth], (err) => {
  if (err) throw err;

...

});
```
## Step 2: Configure the Strategy

```javascript
server.auth.strategy(name, scheme, [mode], [options]);
```

A strategy is a configured instance of a *scheme*.

###### What's a scheme?

It's the type, i.e. the *manner*, of authentication. Hapi-auth-cookie creates a scheme called 'cookie', which we reference when creating our strategy (the second argument of `strategy`).

> We might want to use more than one strategy of the same scheme. For example, if we have two different classes of users (ordinary users and administrators) defining two strategies will allow us to set different permissions on routes more easily. In this case we are creating one strategy called 'base' - we do not need any more.


The strategy must be configured within the register callback.

```javascript
server.register(CookieAuth, function (err) {

  var options = {
      password: 'm!*"2/),p4:xDs%KEgVr7;e#85Ah^WYC',
      cookie: 'cookie-name',
      isSecure: false,
      ttl: 24 * 60 * 60 * 1000
    })

  server.auth.strategy('base', 'cookie', options)

  ...
})
```
###### Options
We could use any name for our strategy, but we will need to use the name we choose to refer to it later.

 - Password should be at least 32 chars. The plugin will encrypt and decrypt your cookie using it. In real life this should not be written into your code.

 - Cookie name can be anything.

 - isSecure, if `true`, will prevent the cookie being sent on insecure connections. Hapi seems to consider localhost as insecure, so set it to `false` for development and `true` for production (assuming you are hosting on https).

 - ttl sets when the session will automatically expire in milliseconds after creation.

There are lots more options you can set. If you want to define more than one strategy, you will need to make use of the `requestDecoratorName` option, for example. Check the docs for the plugin.


## Step 3: Login a user

Logging someone in is called creating a session. We will create a session by creating a cookie using the `set` method of the `cookieAuth` object which (by default) the plugin adds to the request object.

_Remember to require in the module to your routes.js file as well._

```javascript
const login = {
  method: 'POST',
  path: '/login',
  handler (req, reply) {
    var username = req.payload.username;
    var password = req.payload.password;
    // Check username and password details against database.
    // If user exists, return an object with data uniquely identifying user.
    // For this workshop skip this process and set the cookie right away...
    req.cookieAuth.set(username);

    reply.view('user-page');
  }
}
```

## Step 4: Add auth to your routes

Now we can check whether a cookie has been set by configuring the `auth` object of a route. We can simply block a route for users without a set cookie:

The hyperlink makes a request for the /secret end point. Add authentication to this route.

```javascript
server.route({  
  method: 'GET',
  path: '/some-route',
  config: {
    auth: {
      strategy: 'base'
    },
    handler (request, reply) {
      reply('you’re authenticated :)')
    }
  }
})
```

The plugin will check if a cookie has been set and if not, block access, intercepting before the handler is called.


## Access details of the logged in user

Easy: `request.auth.credentials`. We get back whatever we passed to `set`.

## Logout (end session)

Also easy: `request.cookieAuth.clear()`. No more cookie!


## Set defaults

You have the option of passing a `mode` argument to `strategy` in this position:

```javascript
server.auth.strategy(name, scheme, [mode], [options])
```

If you pass `true` or `'required'`, all routes will automatically be protected by the strategy. If you pass `'try'`, all routes will be protected, but with their `config.auth.mode` property set to try (see *Add auth to your routes* above).

## Gotcha!

Unlike the plugins you have used so far, hapi-cookie-auth loads asynchronously. That means anything you do to the server (`server.start`, `server.routes`) must be done in the `register` callback. This should make testing fun.
