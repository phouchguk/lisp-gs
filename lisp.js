/* globals car, cdr, cons, makeSymbol, Env, Fn, Pair, Symbol */

(function (exports) {
    "use strict";

    var defSymbol, doSymbol, fnSymbol, ifSymbol, isSelfEvaluating, isTaggedList, listOfValues, okSymbol, quoteSymbol, setSymbol;

    defSymbol = makeSymbol("def");
    doSymbol = makeSymbol("do");
    fnSymbol = makeSymbol("fn");
    ifSymbol = makeSymbol("if");
    okSymbol = makeSymbol("ok");
    quoteSymbol = makeSymbol("quote");
    setSymbol = makeSymbol("set!");

    isSelfEvaluating = function (exp) {
        return exp === true || exp === null ||
            typeof(exp) === "number" || typeof(exp) === "string";
    };

    isTaggedList = function (exp, tag) {
        var theCar;

        if (exp instanceof Pair) {
            theCar = car(exp);
            return theCar instanceof Symbol && theCar === tag;
        }

        return false;
    };


    listOfValues = function (exps, env) {
        if (exps === null) {
            return null;
        }

        return cons(exports.eval(car(exps), env),
                    listOfValues(cdr(exps), env));
    };

    exports.eval = function (exp, env) {
        var arg1, arg2, arg3, args, proc;

        while (true) {
            if (isSelfEvaluating(exp)) {
                return exp;
            }

            // variable lookup
            if (exp instanceof Symbol) {
                return env.lookup(exp);
            }

            arg1 = car(cdr(exp));

            // quote
            if (isTaggedList(exp, quoteSymbol)) {
                return arg1;
            }

            arg2 = car(cdr(cdr(exp)));

            // set
            if (isTaggedList(exp, setSymbol)) {
                env.set(arg1, exports.eval(arg2, env));

                return okSymbol;
            }

            // def
            if (isTaggedList(exp, defSymbol)) {
                env.def(arg1, exports.eval(arg2, env));

                return okSymbol;
            }

            arg3 = car(cdr(cdr(cdr(exp))));

            // if
            if (isTaggedList(exp, ifSymbol)) {
                if (exports.eval(arg1, env) === null) {
                    // false
                    exp = exports.eval(arg3, env);
                } else {
                    // true
                    exp = exports.eval(arg2, env);
                }

                continue;
            }

            // fn
            if (isTaggedList(exp, fnSymbol)) {
                return new Fn(arg1, cdr(cdr(exp)), env);
            }

            // do
            if (isTaggedList(exp, doSymbol)) {
                exp = cdr(exp);

                while (cdr(exp) !== null) {
                    exports.eval(car(exp), env);
                    exp = cdr(exp);
                }

                exp = car(exp);

                continue;
            }

            // application
            if (exp instanceof Pair) {
                proc = exports.eval(car(exp), env);
                args = listOfValues(cdr(exp), env);

                if (typeof(proc) === "function") {
                    return proc(args);
                }

                if (proc instanceof Fn) {
                    env = env.extend(proc.params, args, proc.env);
                    exp = cons(doSymbol, proc.body);

                    continue;
                }

                throw("unknown procedure type");
            }

            throw("cannot eval unknown expression type");
        }
    };

    exports.globalEnv = new Env(null);
}(window.lisp = window.lisp || {}));
