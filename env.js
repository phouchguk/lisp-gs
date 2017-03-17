/* globals car, cdr */

(function () {
    "use strict";

    window.Env = function (parent) {
        this.values = {};
        this.parent = parent;
    };

    window.Env.prototype.def = function (sym, value) {
        this.values[sym.value] = value;
    };

    window.Env.prototype.extend = function (vars, vals) {
        var env;

        env = new window.Env(this);

        while (vars !== null) {
            env.def(car(vars), car(vals));

            vars = cdr(vars);
            vals = cdr(vals);
        }
    };

    window.Env.prototype.lookup = function (sym) {
        var env;

        env = this;

        while (env !== null) {
            if (this.values[sym.value]) {
                return this.values[sym.value];
            }

            env = env.parent;
        }

        throw("unbound variable");
    };

    window.Env.prototype.set = function (sym, value) {
        var env;

        env = this;

        while (env !== null) {
            if (this.values[sym.value]) {
                this.values[sym.value] = value;

                return;
            }

            env = env.parent;
        }

        throw("unbound variable");
    };
})();
