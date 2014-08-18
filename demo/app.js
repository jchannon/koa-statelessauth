'use strict';
var route = require('koa-route');
var koa = require('koa');
var login = require('./login.js');
var home = require('./index.js');
var statelessauth = require('../index.js');
var app = module.exports = koa();

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

var statelessauthOptions = {
    ignorePaths: ["/login"]
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

app.use(route.get('/', home.home));
app.use(route.post('/login', login.login));
//app.use(route.get('/messages/:id', messages.fetch));

if (!module.parent) {
    app.listen(3000);
    console.log('listening on port 3000');
}