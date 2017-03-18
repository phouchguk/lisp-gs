/* globals car, cdr, cons, makeSymbol, Env, Fn, Pair, Symbol */

(function (exports) {
    "use strict";

    var applySymbol, defSymbol, doSymbol, fnSymbol, ifSymbol, init, isSelfEvaluating, isTaggedList, listOfValues, okSymbol, prepareApplyOperands, procApply, quoteSymbol, setSymbol;

    applySymbol = makeSymbol("apply");
    defSymbol = makeSymbol("def");
    doSymbol = makeSymbol("do");
    fnSymbol = makeSymbol("fn");
    ifSymbol = makeSymbol("if");
    okSymbol = makeSymbol("ok");
    quoteSymbol = makeSymbol("quote");
    setSymbol = makeSymbol("set!");

    init = function () {
        exports.globalEnv.values["+"] = function (args) {
            var result;

            result = 0;

            while (args !== null) {
                result = result + car(args);
                args = cdr(args);
            }

            return result;
        };

        exports.globalEnv.values.apply = procApply;
    };

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

    prepareApplyOperands = function (args) {
        if (cdr(args) === null) {
            return car(args);
        }

        return cons(car(args), prepareApplyOperands(cdr(args)));
    };

    procApply = function () {
        throw("illegal state. The body of the apply primitive procedure should not execute.");
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

            // quote
            if (isTaggedList(exp, quoteSymbol)) {
                return car(cdr(exp));
            }

            // set
            if (isTaggedList(exp, setSymbol)) {
                arg1 = car(cdr(exp));
                arg2 = car(cdr(cdr(exp)));

                env.set(arg1, exports.eval(arg2, env));

                return okSymbol;
            }

            // def
            if (isTaggedList(exp, defSymbol)) {
                arg1 = car(cdr(exp));
                arg2 = car(cdr(cdr(exp)));

                env.def(arg1, exports.eval(arg2, env));

                return okSymbol;
            }

            // if
            if (isTaggedList(exp, ifSymbol)) {
                arg1 = car(cdr(exp));
                arg2 = car(cdr(cdr(exp)));
                arg3 = car(cdr(cdr(cdr(exp))));

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
                arg1 = car(cdr(exp));

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
                    if (proc === procApply) {
                        proc = car(args);
                        args = prepareApplyOperands(cdr(args));
                    }

                    return proc(args);
                }

                if (proc instanceof Fn) {
                    env = proc.env.extend(proc.params, args);
                    exp = cons(doSymbol, proc.body);

                    continue;
                }

                throw("unknown procedure type");
            }

            throw("cannot eval unknown expression type");
        }
    };

    exports.globalEnv = new Env(null);
    init();
}(window.lisp = window.lisp || {}));
