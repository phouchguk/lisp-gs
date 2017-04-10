/* globals car, cdr, makeSymbol */

(function () {
    "use strict";

    var us;

    us = makeSymbol("_");

    window.Env = function (parent) {
        this.values = {};
        this.parent = parent;
    };

    window.Env.prototype.def = function (sym, value) {
        if (sym !== us) {
            this.values[sym.value] = value;
        }
    };

    window.Env.prototype.extend = function (vars, vals) {
        var env;

        env = new window.Env(this);

        while (vars !== null) {

            env.def(car(vars), car(vals));

            vars = cdr(vars);
            vals = cdr(vals);
        }

        return env;
    };

    window.Env.prototype.lookup = function (sym) {
        var env;

        env = this;

        while (env !== null) {
            if (typeof env.values[sym.value] !== "undefined") {
                return env.values[sym.value];
            }

            env = env.parent;
        }

        throw("unbound variable '" + sym.value + "'");
    };

    window.Env.prototype.set = function (sym, value) {
        var env;

        env = this;

        while (env !== null) {
            if (typeof env.values[sym.value] !== "undefined") {
                env.values[sym.value] = value;

                return;
            }

            env = env.parent;
        }

        throw("unbound variable '" + sym.value + "'");
    };
})();
