#Koa StatelessAuth

This is a stateless auth library for `koa`.  If there is no `Authorization` header or if is empty it will return `401` status code.  The library accepts a validator object with a `validate` function. Pass in your own object to determine how it validates.  If the validator does not return a `user` object a 401 is returned;  You can also pass in an optional `options` object that can define paths to ignore and therefore `yield` to the next function without validating the request.

##Usage

```
var statelessauth = require('statelessauth');

var validator = {
    validate: function (token) {
        //This should go to a DB etc to get your user based on token
        if (token === '123') {
            return;
        }
        return {
            "name": "bob",
            "role": "admin",
            "email": "bob@acme.com"
        };
    }
};

var statelessauthOptions = {
    ignorePaths: ["/", "/nonsecure"]
};

app.use(statelessauth(validator, statelessauthOptions));

app.use(function * (next) {
    if (this.user) {
        console.log(this.user.name);
        console.log(this.user.email);
        console.log(this.user.role);
    }
    yield next;
});
```

##statelessauthOptions

* __ignorePaths:__ ( default: *[]* ) Array of Paths, that are ignored by the Authentification.
* __verbose:__ ( default: *false* ) Show verbose consolelogs if true.



##TODO
Allow passthrough for cookie type authentication
