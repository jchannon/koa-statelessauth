#Koa StatelessAuth

This is a stateless auth library for koa.  If there is no `Authorization` header or if is empty it will return `401` status code.  The library accepts a validation object with a `validate` function. Pass in your own object to determine how it validates.

##Usage

```
var statelessauth = require('statelessauth');

var validator = {
    validate: function (token) {
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

app.use(statelessauth(validator));

app.use(function * (next) {
    console.log(this.user.name);
    console.log(this.user.email);
    console.log(this.user.role);
    yield next;
});
```
