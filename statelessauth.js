module.exports = statelessauth;

function statelessauth(validator) {
    return function * (next) {
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