/* globals car, cdr, stream, Fn, Pair, Symbol */

(function (exports) {
    "use strict";

    var htmlPair, makeSpan, writePair;

    htmlPair = function (pair) {
        var carObj, cdrObj, temp;

        carObj = car(pair);
        cdrObj = cdr(pair);

        temp = exports.html(carObj);

        if (cdrObj instanceof Pair) {
            return temp + " " + htmlPair(cdrObj);
        }

        if (cdrObj === null) {
            return temp;
        }

        return temp + " . " + exports.html(cdrObj);
    };

    makeSpan = function (cls, text) {
        return "<span class=\"lisp-" + cls + "\">" + text + "</span>";
    };

    writePair = function (pair) {
        var carObj, cdrObj, temp;

        carObj = car(pair);
        cdrObj = cdr(pair);

        temp = exports.write(carObj);

        if (cdrObj instanceof Pair) {
            return temp + " " + writePair(cdrObj);
        }

        if (cdrObj === null) {
            return temp;
        }

        return temp + " . " + exports.write(cdrObj);
    };


    exports.html = function (obj) {
        var cls, text, t;

        if (obj instanceof Pair) {
            return makeSpan("paren", "(") + htmlPair(obj) + makeSpan("paren", ")");
        } else {
            text = exports.write(obj);
            t = typeof(obj);

            if (obj === true || obj === null) {
                cls = "bool";
            } else if (obj instanceof stream.Stream) {
                text = "#&lt;stream&gt;";
                cls = "paren";
            } else if (obj instanceof Symbol) {
                cls = "sym";
            } else if (t === "function") {
                text = "#&lt;procedure&gt;";
                cls = "paren";
            } else if (t === "number") {
                cls = "nr";
            } else if (t === "string") {
                cls = "str";
            } else if (obj instanceof Fn) {
                text = "#&lt;procedure&gt;";
                cls = "paren";
            } else {
                throw("cannot html unknown type");
            }

            return makeSpan(cls, text);
        }
    };

    exports.write = function (obj) {
        var c, i, len, t, token;

        if (obj === true) {
            return "#t";
        }

        if (obj === null) {
            return "nil";
        }

        if (obj instanceof Pair) {
            return "(" + writePair(obj) + ")";
        }

        if (obj instanceof Fn) {
            return "#<procedure>";
        }

        if (obj instanceof stream.Stream) {
            return "#<stream>";
        }

        if (obj instanceof Symbol) {
            return obj.value;
        }

        t = typeof(obj);

        if (t === "function") {
            return "#<procedure>";
        }

        if (t === "number") {
            return obj + "";
        }

        if (t === "string") {
            token = "";
            len = obj.length;

            for (i = 0; i < len; i++) {
                c = obj.substring(i, i + 1);

                switch (c) {
                case "\n":
                    token = token + "\\n";
                    break;

                case "\\":
                    token = token + "\\\\";
                    break;

                case "\"":
                    token = token + "\\\"";
                    break;

                default:
                    token = token + c;
                }
            }

            return "\"" + token + "\"";
        }

        throw("cannot write unknown type");
    };
}(window.print = window.print || {}));
