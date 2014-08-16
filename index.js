var minimatch = require('minimatch');

module.exports = statelessauth;

function statelessauth(validator, options) {
    return function * (next) {

        if (options && options.ignorePaths) {
            var ignorePathMatched = false;
            var path = this.path;
            options.ignorePaths.some(function (element) {
                console.log("path=" + path);
                console.log("ignorepath=" + element);
                var match = minimatch(path, element);
                if (match) {
                    console.log("matched");
                    ignorePathMatched = true;
                    return true;
                }
                return false;
            });
            //Can't yield from normal function
            if (ignorePathMatched) {
                yield next;
            }
        }


        var authheader = this.get("Authorization");
        if (this.get("Authorization") === undefined) {
            this.status = 401;
            console.log('no header');
            return;
        }

        if (authheader === '') {
            this.status = 401;
            console.log('empty header');
            return;
        }

        var claims = validator.validate(authheader);

        if (!claims) {
            this.status = 401;
            console.log('validator failed');
            return;
        }

        this.user = {};
        this.user.name = claims.name;
        this.user.email = claims.email;
        this.user.role = claims.role;

        yield next;
    }
}