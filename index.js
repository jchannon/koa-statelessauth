var minimatch = require('minimatch');

module.exports = statelessauth;

function statelessauth(validator, options) {
    return function * (next) {

        if (options && options.ignorePaths) {
            var ignorePathMatched = false;
            var path = this.path;
            options.ignorePaths.some(function (element) {
                options.verbose && console.log("path=" + path);
                options.verbose && console.log("ignorepath=" + element);
                var match = minimatch(path, element);
                if (match) {
                    options.verbose && console.log("matched");
                    ignorePathMatched = true;
                    return true;
                }
                return false;
            });
            //Can't yield from normal function
            if (ignorePathMatched) {
                yield next;
                return;
            }
        }


        var authheader = this.get("Authorization");
        if (this.get("Authorization") === undefined) {
            this.status = 401;
            options.verbose && console.log('no header');
            return;
        }

        if (authheader === '') {
            this.status = 401;
            options.verbose && console.log('empty header');
            return;
        }

        if (!validator || !validator.validate) {
            this.status = 401;
            options.verbose && console.log('no validator');
            return;
        }

        var claims = validator.validate(authheader);

        if (!claims) {
            this.status = 401;
            options.verbose && console.log('validator failed');
            return;
        }

        this.user = {};
        this.user.name = claims.name;
        this.user.email = claims.email;
        this.user.role = claims.role;

        yield next;
    }
}
