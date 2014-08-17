var assert = require("assert");
var statelessauth = require('../index.js');

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

var emptythis = {
    path: "/",
    get: function (headername) {}
};

var statelessauthOptions = {
    ignorePaths: []
};

function * nextFunc() {
    return "nextFunc result";
}

describe('StatelessAuth', function () {

    it('should return next func result if ignore path matched', function () {

        var statelessauthOptions = {
            ignorePaths: ["/", "/nonsecure"]
        };

        var fn = statelessauth(validator, statelessauthOptions).bind(emptythis)(nextFunc);

        var nextFuncResult = fn.next().value().next().value;

        assert.equal("nextFunc result", nextFuncResult);

    });

    it('should return 401 if no Authorization header supplied', function () {

        var fn = statelessauth(validator, statelessauthOptions).bind(emptythis)(nextFunc);

        fn.next();

        assert.equal(401, emptythis.status);

    });

    it('should return 401 if Authorization header is empty', function () {

        var emptythis = {
            path: "/",
            get: function (headername) {
                return '';
            }
        };

        var fn = statelessauth(validator, statelessauthOptions).bind(emptythis)(nextFunc);

        fn.next();

        assert.equal(401, emptythis.status);
    });

    it('should return 401 if validator does not validate', function () {

        var emptythis = {
            path: "/",
            get: function (headername) {
                return '123';
            }
        };

        var fn = statelessauth(validator, statelessauthOptions).bind(emptythis)(nextFunc);

        fn.next();

        assert.equal(401, emptythis.status);
    });

    it('should return user if validator does validate', function () {

        var emptythis = {
            path: "/",
            get: function (headername) {
                return 'verifiedheadertoken';
            }
        };

        var fn = statelessauth(validator, statelessauthOptions).bind(emptythis)(nextFunc);

        fn.next();

        assert.equal('bob', emptythis.user.name);
        assert.equal('admin', emptythis.user.role);
        assert.equal('bob@acme.com', emptythis.user.email);
    });
})