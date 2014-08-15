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

        if (!validator.validate(authheader)) {
            this.status = 401;
            console.log('validator failed');
            return;
        }

        yield next;
    }
}