'use strict';
var parse = require('co-body');
var jwt = require('jsonwebtoken');

module.exports.login = function * login() {
    console.log('logging in');
    var user = yield parse(this);
    if (user.name !== 'fred' && user.password !== '123') {
        this.body = 'try again!';
        this.status = 401;
        return;
    }
    var token = jwt.sign(user, 'shhhhh');

    this.body = token;
};