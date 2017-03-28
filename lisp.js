/* globals car, cdr, cons, makeSymbol, parser, stream, Env, Fn, Pair, Symbol */

(function (exports) {
    "use strict";

    var defSymbol, doSymbol, fnSymbol, globalEnv, globalEval, ifSymbol, init, isSelfEvaluating, isTaggedList, lispEval, listOfValues, okSymbol, procApply, procEval, quoteSymbol, setSymbol;

    defSymbol = makeSymbol("def");
    doSymbol = makeSymbol("do");
    fnSymbol = makeSymbol("fn");
    ifSymbol = makeSymbol("if");
    okSymbol = makeSymbol("ok");
    quoteSymbol = makeSymbol("quote");
    setSymbol = makeSymbol("set!");

    init = function () {
        globalEnv.values["+"] = function (args) {
            var result;

            result = 0;

            while (args !== null) {
                result = result + car(args);
                args = cdr(args);
            }

            return result;
        };

        globalEnv.values.apply = procApply;
        globalEnv.values.eval = procEval;

        globalEnv.values.environment = function () {
            return new Env(globalEnv);
        };

        globalEnv.values["current-env"] = function () {
            return globalEnv;
        };

        globalEnv.values.read = function (args) {
            return parser.read(car(args));
        };

        globalEnv.values["set-eval!"] = function (args) {
            globalEval = car(args);

            return okSymbol;
        };

        globalEnv.values.error = function (args) {
            throw(car(args));
        };

        globalEnv.values["back-char"] = function (args) {
            car(args).back();

            return okSymbol;
        };

        globalEnv.values["log!"] = function (args) {
            console.log(car(args));

            return okSymbol;
        };

        globalEnv.values["peek-char"] = function (args) {
            return car(args).peek();
        };

        globalEnv.values["read-char"] = function (args) {
            return car(args).next();
        };

        globalEnv.values["string->stream"] = function (args) {
            return new stream.Stream(car(args));
        };

        globalEnv.values["read-macros"] = function (args) {
            return parser.readMacros;
        };

        globalEnv.values["read-macros!"] = function (args) {
            parser.readMacros = car(args);

            return okSymbol;
        };
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

    lispEval = function (exp, env) {
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

                env.set(arg1, lispEval(arg2, env));

                return okSymbol;
            }

            // def
            if (isTaggedList(exp, defSymbol)) {
                arg1 = car(cdr(exp));
                arg2 = car(cdr(cdr(exp)));

                env.def(arg1, lispEval(arg2, env));

                return okSymbol;
            }

            // if
            if (isTaggedList(exp, ifSymbol)) {
                arg1 = car(cdr(exp));
                arg2 = car(cdr(cdr(exp)));
                arg3 = car(cdr(cdr(cdr(exp))));

                if (lispEval(arg1, env) === null) {
                    // false
                    exp = lispEval(arg3, env);
                } else {
                    // true
                    exp = lispEval(arg2, env);
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
                    lispEval(car(exp), env);
                    exp = cdr(exp);
                }

                exp = car(exp);

                continue;
            }

            // application
            if (exp instanceof Pair) {
                proc = lispEval(car(exp), env);
                args = listOfValues(cdr(exp), env);

                if (typeof(proc) === "function") {
                    if (proc === procApply) {
                        proc = car(args);
                        args = car(cdr(args));
                    }

                    if (proc === procEval) {
                        exp = car(args);
                        env = car(cdr(args));

                        continue;
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

    listOfValues = function (exps, env) {
        if (exps === null) {
            return null;
        }

        return cons(lispEval(car(exps), env),
                    listOfValues(cdr(exps), env));
    };

    procApply = function () {
        throw("illegal state. The body of the apply primitive procedure should not execute.");
    };

    procEval = function () {
        throw("illegal state. The body of the eval primitive procedure should not execute.");
    };

    exports.readEval = function (str) {
        var exp;

        if (globalEval === lispEval) {
            exp = parser.read(new stream.Stream(str));
        } else if (globalEval instanceof Symbol) {
            exp = cons(globalEval, cons(str, null));
        } else {
            throw("global eval must be a symbol");
        }

        return lispEval(exp, globalEnv);
    };

    globalEnv = new Env(null);
    globalEval = lispEval;

    init();
}(window.lisp = window.lisp || {}));
