# Hapi-auth-cookie workshop

In this workshop you'll be adding session management (cookies) and authentication to the existing simple hapi server using [hapi-auth-cookie](https://github.com/hapijs/hapi-auth-cookie). (These docs are a great resource)

You'll see the hapi.js server in the src directory with a handlebars templating engine already configured.

First clone the repo and run `npm install`.

> Note: This workshop is designed to be a straight forward walk through and a guide for later use during projects. You may be tempted to simply copy and paste this code. Don't, you'll gain more by writing your code from scratch!

## Step 1: Register hapi-auth-cookie

- First install the module with your command line:

```
npm install -S hapi-auth-cookie
```

- Require hapi-auth-cookie in server.js:

```javascript
var CookieAuth = require('hapi-auth-cookie');
```

- Now register the module with your server alongside the other plugins:

```javascript
server.register([Vision, Inert, CookieAuth], (err) => {
  if (err) throw err;
...
});
```

## Step 2: Configure the authentication strategy

```javascript
server.auth.strategy(name, scheme, [mode], [options]);
```

A strategy is a configured instance of a *scheme*.

#### What's a scheme?

It's the type, i.e. the *manner*, of authentication. Hapi-auth-cookie creates a scheme called 'cookie', which we reference when creating our strategy (the second argument of `strategy`).

The strategy must be configured within the register callback. We could use any name for our strategy, but we will need to use the name we choose to refer to it later. In this case we will create one strategy called 'base'.

```javascript
server.register([Vision, Inert, CookieAuth],
  ...
  var options = {
    password: 'm!*"2/),p4:xDs%KEgVr7;e#85Ah^WYC',
    cookie: 'cookie-name',
    isSecure: false,
    ttl: 24 * 60 * 60 * 1000
  };
  server.auth.strategy('base', 'cookie', options)
  ...
})
```
#### Options

 - Password should be at least 32 chars. The plugin will encrypt and decrypt your cookie using it.

 - Cookie name can be anything.

 - isSecure, if `true`, will prevent the cookie being sent on insecure connections. Hapi considers localhost as insecure, so set it to `false` for development.

 - ttl sets when the session will automatically expire in milliseconds after creation.

There are lots more options you can set. Check out the [docs](https://github.com/hapijs/hapi-auth-cookie).

## Step 3: Login a user

Logging someone in is called creating a session. Edit the `/login` route to create a session.

We will create a session by creating a cookie using the `set` method of the `cookieAuth` object which (by default) the plugin adds to the request object.

_Remember to require in the module to your routes.js file as well._

```javascript
const login = {
  method: 'POST',
  path: '/login',
  handler (req, reply) {
    var username = req.payload.username;
    var password = req.payload.password;
    // We would normally check username and password details against database.
    // If user exists, return an object that uniquely identifies the user.
    // For this workshop skip this process and set the cookie right away...
    req.cookieAuth.set(username);

    reply.view('user-page');
  }
}
```
## Step 4: Accessing the cookie

### 1) Access details of the logged in user

Easy: `request.auth.credentials`. We get back whatever we passed to `set`.

Use this with handlebars to selectively render authenticated user information.

Your solution might look something like this...

1) Adding to the route.
```javascript
handler: function (request, reply) {
    ...
    reply.view('user-page', {
        credentials: request.auth.credentials
    });
}
```
2) Adding to the views.

```javascript
{{#if credentials.username}}
    <h1>Welcome back {{credentials.username}}!</h1>
{{else}}
    <h1>Welcome guest!</h1>
{{/if}}
```

Bonus points... check out [hapi-context-credentials](https://github.com/mtharrison/hapi-context-credentials) for a neater way of doing this.

### 2) Logout (end session)

Also easy: `request.cookieAuth.clear()`. No more cookie!

Create a logout button and route which clears the cookie.


## Stretch Goals - Add auth to your routes

Add authentication to your `/auth-only` route.

We can check whether a cookie has been set by configuring the `auth` object of a route. We can allow access to the route and handle the 'session checking' in the handler:


```javascript
server.route({  
  method: 'GET',
  path: '/auth-only',
  config: {
    auth: {
      mode: 'try',
      strategy: 'base'
    },
    handler (request, reply) {
      reply(request.auth.isAuthenticated
      ? 'You\'re authenticated :)'
      : 'You\'re not authenticated :(');
    }
  }
})
```

## Further information

#### Mode

You have the option of passing a `mode` argument to `strategy` in this position:

```javascript
server.auth.strategy(name, scheme, [mode], [options])
```

If you pass `true` or `'required'`, all routes will automatically be protected by the strategy. If you pass `'try'`, all routes will be protected, but with their `config.auth.mode` property set to try (see *Add auth to your routes* above). This is a good exercise to play around with if you have some time left.
